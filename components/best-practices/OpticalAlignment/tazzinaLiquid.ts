import { createGlLayer, type Vec3 } from "../hairline/glLayer";
import type { TazzinaFrame, TazzinaLiquid } from "../hairline/tazzina";

// Brim-full, so only a quick slide spills; a slow one only sloshes.
const LEVEL_BELOW_RIM = 4.5;
const LIQUID_R = 24.6;
// The slosh: a lightly damped pendulum, driven by the cup's acceleration.
const SLOSH_FREQ = 11;
const SLOSH_DAMPING = 0.14;
const SLOSH_GRAVITY = 4000;
const MAX_TILT = 0.45;
const GRAVITY = 380;
const MAX_DROPS = 24;
const MAX_SPLATS = 36;
const SPLAT_HOLD = 3.5;
const SPLAT_FADE = 1.5;

const DIAGONAL: [number, number] = [Math.SQRT1_2, -Math.SQRT1_2];
const FRONT: [number, number] = [Math.SQRT1_2, Math.SQRT1_2];

const VERTEX = `
attribute vec2 a_pos;
attribute vec4 a_seg;
attribute vec4 a_shape;
uniform vec2 u_res;
varying vec2 v_pos;
varying vec4 v_seg;
varying vec4 v_shape;
void main() {
  v_pos = a_pos;
  v_seg = a_seg;
  v_shape = a_shape;
  gl_Position = vec4(a_pos.x / u_res.x * 2.0 - 1.0, 1.0 - a_pos.y / u_res.y * 2.0, 0.0, 1.0);
}`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 u_fill;
uniform vec3 u_edge;
uniform vec3 u_drop;
uniform vec4 u_opening;
uniform vec4 u_liquid;
uniform vec4 u_outer;
uniform vec4 u_foot;
uniform float u_shear;
uniform float u_line;
varying vec2 v_pos;
varying vec4 v_seg;
varying vec4 v_shape;

float ellipse(vec2 q, vec2 r) {
  vec2 k = q / r;
  float l = length(k);
  if (l < 1e-4) return -min(r.x, r.y);
  return (l - 1.0) / length(k / (r * l));
}

float cup(vec2 p) {
  float t = clamp((p.y - u_outer.y) / (u_foot.y - u_outer.y), 0.0, 1.0);
  float band = step(u_outer.y, p.y) * step(p.y, u_foot.y)
    * clamp(0.5 + mix(u_outer.z, u_foot.z, t) - abs(p.x - mix(u_outer.x, u_foot.x, t)), 0.0, 1.0);
  float top = clamp(0.5 - ellipse(p - u_outer.xy, u_outer.zw), 0.0, 1.0);
  float base = clamp(0.5 - ellipse(p - u_foot.xy, u_foot.zw), 0.0, 1.0);
  return max(band, max(top, base));
}

void main() {
  vec2 p = v_pos;
  float kind = v_shape.z;
  if (kind < 0.5) {
    vec2 q = p - u_liquid.xy;
    q.y += u_shear * q.x;
    float d = ellipse(q, u_liquid.zw);
    float clip = clamp(0.5 - ellipse(p - u_opening.xy, u_opening.zw) - u_line, 0.0, 1.0);
    float body = clamp(0.5 - d, 0.0, 1.0);
    float line = clamp(0.5 + u_line * 0.5 - abs(d), 0.0, 1.0);
    float alpha = max(body, line) * clip;
    gl_FragColor = vec4(mix(u_fill, u_edge, line) * alpha, alpha);
    return;
  }
  vec2 a = v_seg.xy;
  vec2 s = vec2(p.x, a.y + (p.y - a.y) * v_shape.y);
  vec2 b = vec2(v_seg.z, a.y + (v_seg.w - a.y) * v_shape.y);
  vec2 sa = s - a;
  vec2 ba = b - a;
  float h = clamp(dot(sa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  float d = length(sa - ba * h) - v_shape.x;
  if (kind < 1.5) {
    float alpha = clamp(0.5 - d, 0.0, 1.0) * v_shape.w;
    gl_FragColor = vec4(u_drop * alpha, alpha);
    return;
  }
  // Splats are small pools of the same liquid, outlined like its surface.
  float line = clamp(0.5 + u_line * 0.5 - abs(d), 0.0, 1.0);
  float alpha = max(clamp(0.5 - d, 0.0, 1.0), line) * v_shape.w;
  // They lie on the saucer, so any part inside the cup's outline is behind it.
  alpha *= 1.0 - cup(p);
  gl_FragColor = vec4(mix(u_fill, u_edge, line) * alpha, alpha);
}`;

type Drop = { x: number; y: number; z: number; vx: number; vy: number; vz: number };
type Splat = { x: number; y: number; size: number; age: number };

const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export function createTazzinaLiquid(
  stage: HTMLElement,
  canvas: HTMLCanvasElement,
): (TazzinaLiquid & { destroy(): void }) | null {
  const layer = createGlLayer(stage, canvas, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    attributes: [["a_pos", 2], ["a_seg", 4], ["a_shape", 4]],
    uniforms: ["u_res", "u_fill", "u_edge", "u_drop", "u_opening", "u_liquid", "u_outer", "u_foot", "u_shear", "u_line"],
    colors: { plate: "var(--hl-plate)", hi: "var(--hl-hi)", edge: "var(--hl-edge)" },
  });
  if (!layer) return null;

  const { gl, colors, floatsPerVertex } = layer;
  const vertices = new Float32Array((1 + MAX_DROPS + MAX_SPLATS) * 6 * floatsPerVertex);
  const drops: Drop[] = [];
  const splats: Splat[] = [];
  let tilt = 0, tiltVelocity = 0;
  let lastVelocity: number | null = null;
  let spill = 0, sinceDrop = 1;

  function step(dt: number, frame: TazzinaFrame) {
    if (dt <= 0) return;
    const acceleration = lastVelocity === null ? 0 : (frame.velocity - lastVelocity) / dt;
    lastVelocity = frame.velocity;
    const target = -acceleration / SLOSH_GRAVITY;
    tiltVelocity += (SLOSH_FREQ ** 2 * (target - tilt) - 2 * SLOSH_DAMPING * SLOSH_FREQ * tiltVelocity) * dt;
    tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt + tiltVelocity * dt));

    // The raised side of the surface tops the rim: it spills a drop or two.
    const over = Math.abs(tilt) * LIQUID_R - (LEVEL_BELOW_RIM - 0.5);
    sinceDrop += dt;
    if (over > 0) {
      spill += over * dt * 9;
      if (sinceDrop > 0.4) spill = Math.max(spill, 1);
    } else {
      spill = 0;
    }
    while (spill >= 1 && drops.length < MAX_DROPS && sinceDrop > 0.05) {
      spill -= 1;
      sinceDrop = 0;
      const side = Math.sign(tilt);
      const angle = 0.3 + Math.random() * 0.7;
      const dx = Math.cos(angle) * side * DIAGONAL[0] + Math.sin(angle) * FRONT[0];
      const dy = Math.cos(angle) * side * DIAGONAL[1] + Math.sin(angle) * FRONT[1];
      const reach = frame.rimR + 0.6;
      const carry = frame.velocity * 0.3;
      drops.push({
        x: frame.offset * DIAGONAL[0] + dx * reach,
        y: frame.offset * DIAGONAL[1] + dy * reach,
        z: frame.rimZ,
        vx: DIAGONAL[0] * carry + dx * 6,
        vy: DIAGONAL[1] * carry + dy * 6,
        vz: 4,
      });
    }

    for (let i = drops.length - 1; i >= 0; i--) {
      const drop = drops[i];
      drop.vz -= GRAVITY * dt;
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      drop.z += drop.vz * dt;
      if (drop.z > frame.saucerZ) continue;
      drops.splice(i, 1);
      if (Math.hypot(drop.x, drop.y) > frame.plateR - 2) continue;
      if (splats.length >= MAX_SPLATS) splats.shift();
      splats.push({ x: drop.x, y: drop.y, size: 1.8 + Math.random() * 1.1, age: 0 });
    }

    for (let i = splats.length - 1; i >= 0; i--) {
      splats[i].age += dt;
      if (splats[i].age > SPLAT_HOLD + SPLAT_FADE) splats.splice(i, 1);
    }
  }

  function render(frame: TazzinaFrame) {
    const unit = layer!.unit();
    const o = frame.P(0, 0, 0), ex = frame.P(1, 0, 0), ey = frame.P(0, 1, 0);
    const scale = Math.hypot(ex[0] - o[0], ey[0] - o[0]);
    const k = Math.hypot(ex[1] - o[1], ey[1] - o[1]) / scale;
    const zf = Math.sqrt(1 - k * k);
    const cx = frame.offset * DIAGONAL[0], cy = frame.offset * DIAGONAL[1];
    const at = (x: number, y: number, z: number): [number, number] => {
      const p = frame.P(x, y, z);
      return [p[0] * unit, p[1] * unit];
    };
    const ellipse = (z: number, r: number) => {
      const c = at(cx, cy, z);
      return [c[0], c[1], r * scale * unit, r * scale * k * unit] as const;
    };
    let n = 0;

    function quad(a: [number, number], b: [number, number], radius: number, squash: number, kind: number, alpha: number, padX = radius, padY = radius / squash) {
      const x0 = Math.min(a[0], b[0]) - padX - 1.5, x1 = Math.max(a[0], b[0]) + padX + 1.5;
      const y0 = Math.min(a[1], b[1]) - padY - 1.5, y1 = Math.max(a[1], b[1]) + padY + 1.5;
      for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1], [x0, y1], [x1, y0], [x1, y1]]) {
        vertices.set([x, y, a[0], a[1], b[0], b[1], radius, squash, kind, alpha], n);
        n += floatsPerVertex;
      }
    }

    const opening = ellipse(frame.rimZ, frame.innerR);
    const centre: [number, number] = [opening[0], opening[1]];
    quad(centre, centre, 0, 1, 0, 1, opening[2], opening[3]);

    for (const splat of splats) {
      const grow = 1 - Math.exp(-splat.age * 18);
      const fade = Math.max(0, Math.min(1, 1 - (splat.age - SPLAT_HOLD) / SPLAT_FADE));
      const c = at(splat.x, splat.y, frame.saucerZ);
      quad(c, c, splat.size * grow * scale * unit, 1 / k, 2, fade);
    }
    for (const drop of drops) {
      const head = at(drop.x, drop.y, drop.z);
      const tail = at(drop.x - drop.vx * 0.02, drop.y - drop.vy * 0.02, drop.z - drop.vz * 0.02);
      quad(head, tail, 0.7 * scale * unit, 1, 1, 1);
    }

    layer!.draw(vertices, n, (uniform) => {
      gl.uniform2f(uniform("u_res"), canvas.width, canvas.height);
      gl.uniform3fv(uniform("u_fill"), mix(colors.plate, colors.hi, 0.16));
      gl.uniform3fv(uniform("u_edge"), colors.edge);
      gl.uniform3fv(uniform("u_drop"), mix(colors.plate, colors.hi, 0.7));
      gl.uniform4fv(uniform("u_opening"), opening);
      gl.uniform4fv(uniform("u_liquid"), ellipse(frame.rimZ - LEVEL_BELOW_RIM, LIQUID_R));
      gl.uniform4fv(uniform("u_outer"), ellipse(frame.rimZ, frame.rimR));
      gl.uniform4fv(uniform("u_foot"), ellipse(frame.saucerZ, frame.footR));
      gl.uniform1f(uniform("u_shear"), tilt * zf);
      gl.uniform1f(uniform("u_line"), 0.9 * layer!.px());
    });
  }

  return {
    bind: layer.bind,
    frame(dt, frame) {
      if (frame.still) {
        tilt = tiltVelocity = 0;
        lastVelocity = null;
        drops.length = splats.length = 0;
      } else {
        step(dt, frame);
      }
      render(frame);
      const sloshing = Math.abs(tilt) > 1e-3 || Math.abs(tiltVelocity) > 1e-2;
      return !frame.still && !layer.isLost() && (sloshing || drops.length > 0 || splats.length > 0);
    },
    destroy: layer.destroy,
  };
}
