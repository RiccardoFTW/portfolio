export type Vec3 = [number, number, number];

export const VIEW_W = 400;
export const VIEW_H = 320;

type Options<C extends string> = {
  vertex: string;
  fragment: string;
  /** Float attributes in buffer order, as [name, size]. */
  attributes: readonly (readonly [string, number])[];
  uniforms: readonly string[];
  /** CSS colours to resolve against the stage, re-read when the theme changes. */
  colors: Record<C, string>;
};

export type GlLayer<C extends string> = {
  gl: WebGLRenderingContext;
  colors: Record<C, Vec3>;
  floatsPerVertex: number;
  /** Device pixels per viewBox unit. */
  unit(): number;
  /** Device pixels per CSS pixel. */
  px(): number;
  draw(vertices: Float32Array, length: number, setUniforms: (uniform: (name: string) => WebGLUniformLocation | null) => void): void;
  clear(): void;
  bind(wake: () => void): void;
  isLost(): boolean;
  destroy(): void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/** Resolves any CSS colour, including light-dark() and oklch(), to 0–1 RGB. */
function readColor(probe: HTMLElement, value: string): Vec3 {
  probe.style.color = value;
  const resolved = getComputedStyle(probe).color;
  const scratch = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!scratch) return [0, 0, 0];
  scratch.canvas.width = scratch.canvas.height = 1;
  scratch.fillStyle = resolved;
  scratch.fillRect(0, 0, 1, 1);
  const [r, g, b] = scratch.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/** A transparent WebGL canvas over a hairline figure, in the figure's 400 × 320 viewBox. */
export function createGlLayer<C extends string>(
  stage: HTMLElement,
  canvas: HTMLCanvasElement,
  options: Options<C>,
): GlLayer<C> | null {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true });
  if (!gl) return null;

  const floatsPerVertex = options.attributes.reduce((sum, [, size]) => sum + size, 0);
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let locations = new Map<string, WebGLUniformLocation | null>();
  let wake = () => {};
  let lost = false;

  function setup() {
    program = link(gl!, options.vertex, options.fragment);
    buffer = gl!.createBuffer();
    if (!program || !buffer) return false;
    gl!.useProgram(program);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    let offset = 0;
    for (const [name, size] of options.attributes) {
      const location = gl!.getAttribLocation(program, name);
      gl!.enableVertexAttribArray(location);
      gl!.vertexAttribPointer(location, size, gl!.FLOAT, false, floatsPerVertex * 4, offset * 4);
      offset += size;
    }
    locations = new Map(options.uniforms.map((name) => [name, gl!.getUniformLocation(program!, name)]));
    gl!.enable(gl!.BLEND);
    gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
    return true;
  }
  if (!setup()) return null;

  const probe = document.createElement("span");
  probe.hidden = true;
  stage.appendChild(probe);

  // Read lazily: the kernel injects the --hl-* variables only when the figure mounts.
  const colors = {} as Record<C, Vec3>;
  let staleColors = true;
  function refreshColors() {
    staleColors = true;
    wake();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      wake();
    }
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const themeObserver = new MutationObserver(refreshColors);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  scheme.addEventListener("change", refreshColors);

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
  };
  const onRestored = () => {
    lost = !setup();
    wake();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  function clear() {
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
  }

  return {
    gl,
    colors,
    floatsPerVertex,
    unit: () => canvas.width / VIEW_W,
    px: () => canvas.width / Math.max(1, canvas.clientWidth),
    draw(vertices, length, setUniforms) {
      if (lost) return;
      if (staleColors) {
        staleColors = false;
        for (const key in options.colors) colors[key] = readColor(probe, options.colors[key]);
      }
      clear();
      setUniforms((name) => locations.get(name) ?? null);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices.subarray(0, length), gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, length / floatsPerVertex);
    },
    clear() {
      if (!lost) clear();
    },
    bind(next) {
      wake = next;
    },
    isLost: () => lost,
    destroy() {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener("change", refreshColors);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      probe.remove();
      if (!lost) clear();
    },
  };
}
