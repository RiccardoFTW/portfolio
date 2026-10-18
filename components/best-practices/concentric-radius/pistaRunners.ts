import { createGlLayer, VIEW_H, type Vec3 } from "../hairline/glLayer";
import type { PistaFrame, PistaRunners } from "../hairline/pista";

const TAU = Math.PI * 2;

// One runner per lane; speeds differ slightly so the field never moves in lockstep.
const PACE = [1, 0.975, 1.02, 0.99, 1.012];
const SPEED = 16;
// Body units per world unit of lane width: a 10-unit figure stands about 1.3 lanes tall.
const BODY_PER_LANE = 0.13;
const STRIDE = 6.4;

const VERTEX = `
attribute vec2 a_pos;
attribute vec4 a_seg;
attribute vec3 a_shape;
uniform vec2 u_res;
varying vec2 v_pos;
varying vec4 v_seg;
varying vec3 v_shape;
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
uniform vec3 u_ink;
uniform vec3 u_shadow;
varying vec2 v_pos;
varying vec4 v_seg;
varying vec3 v_shape;
void main() {
  vec2 a = v_seg.xy;
  vec2 p = vec2(v_pos.x, a.y + (v_pos.y - a.y) * v_shape.y);
  vec2 b = vec2(v_seg.z, a.y + (v_seg.w - a.y) * v_shape.y);
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  float d = length(pa - ba * h) - v_shape.x;
  float alpha = clamp(0.5 - d, 0.0, 1.0);
  vec3 color = mix(u_ink, u_shadow, v_shape.z);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

/** Where a lane's centreline is after `t` of a lap, running anticlockwise from the far straight's right end. */
function lanePoint(straight: number, r: number, t: number) {
  const lengths = [2 * straight, Math.PI * r, 2 * straight, Math.PI * r];
  let s = (((t % 1) + 1) % 1) * lengths.reduce((sum, l) => sum + l, 0);
  if (s < lengths[0]) return { x: straight - s, y: -r, tx: -1, ty: 0 };
  s -= lengths[0];
  if (s < lengths[1]) {
    const a = -Math.PI / 2 - s / r;
    return { x: -straight + r * Math.cos(a), y: r * Math.sin(a), tx: Math.sin(a), ty: -Math.cos(a) };
  }
  s -= lengths[1];
  if (s < lengths[2]) return { x: -straight + s, y: r, tx: 1, ty: 0 };
  s -= lengths[2];
  const a = Math.PI / 2 - s / r;
  return { x: straight + r * Math.cos(a), y: r * Math.sin(a), tx: Math.sin(a), ty: -Math.cos(a) };
}

function lapLength(straight: number, r: number) {
  return 4 * straight + TAU * r;
}

export function createPistaRunners(
  stage: HTMLElement,
  canvas: HTMLCanvasElement,
): (PistaRunners & { destroy(): void }) | null {
  const layer = createGlLayer(stage, canvas, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    attributes: [["a_pos", 2], ["a_seg", 4], ["a_shape", 3]],
    uniforms: ["u_res", "u_ink", "u_shadow"],
    colors: { ink: "var(--hl-hi)", shadow: "var(--hl-lo)" },
  });
  if (!layer) return null;

  const { gl, colors, floatsPerVertex } = layer;
  const runners = PACE.map((pace, lane) => ({ lane, pace, progress: Number.NaN, phase: lane * 1.7 }));
  const vertices = new Float32Array(runners.length * 11 * 6 * floatsPerVertex);

  function render(frame: PistaFrame) {
    const unit = layer!.unit();
    const px = layer!.px();
    // Ground circles project to axis-aligned ellipses: S wide, S·k tall.
    const o = frame.P(0, 0, 0), ex = frame.P(1, 0, 0), ey = frame.P(0, 1, 0);
    const scale = Math.hypot(ex[0] - o[0], ey[0] - o[0]);
    const k = Math.hypot(ex[1] - o[1], ey[1] - o[1]) / scale;
    const size = frame.gap * BODY_PER_LANE;
    let n = 0;

    const toDevice = (p: [number, number]): [number, number] => [p[0] * unit, p[1] * (canvas.height / VIEW_H)];

    function quad(a: [number, number], b: [number, number], radius: number, squash: number, tone: number) {
      const pad = radius + 1.5;
      const padY = radius / squash + 1.5;
      const x0 = Math.min(a[0], b[0]) - pad, x1 = Math.max(a[0], b[0]) + pad;
      const y0 = Math.min(a[1], b[1]) - padY, y1 = Math.max(a[1], b[1]) + padY;
      for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1], [x0, y1], [x1, y0], [x1, y1]]) {
        vertices.set([x, y, a[0], a[1], b[0], b[1], radius, squash, tone], n);
        n += floatsPerVertex;
      }
    }

    // Far runners first, so their shadows sit under nearer bodies.
    const placed = runners
      .map((runner) => {
        const r = frame.radius - (runner.lane + 0.5) * frame.gap;
        return { runner, point: lanePoint(frame.straight, r, runner.progress) };
      })
      .sort((a, b) => a.point.x + a.point.y - (b.point.x + b.point.y));

    for (const { runner, point } of placed) {
      const { x, y, tx, ty } = point;
      const nx = -ty, ny = tx;
      const p = runner.phase;
      const bounce = 0.35 * Math.abs(Math.sin(p));
      // Body-relative coordinates: forward along the lane, sideways across it, up.
      const at = (forward: number, side: number, up: number) => {
        const f = forward * size, s = side * size;
        return toDevice(frame.P(x + tx * f + nx * s, y + ty * f + ny * s, up * size));
      };
      const hip: Vec3 = [0, 0, 4.6 + bounce];
      const neck: Vec3 = [0.9, 0, 7.7 + bounce];

      const ground = at(0.3, 0, 0);
      quad(ground, ground, 1.4 * size * scale * unit, 1 / k, 1);

      const limb = (from: Vec3, angle: number, length: number): Vec3 => [
        from[0] + Math.sin(angle) * length,
        from[1],
        from[2] - Math.cos(angle) * length,
      ];
      const stroke = (from: Vec3, to: Vec3, width: number) =>
        quad(at(from[0], from[1], from[2]), at(to[0], to[1], to[2]), (width / 2) * px, 1, 0);

      for (const side of [-1, 1]) {
        const swing = p + (side > 0 ? 0 : Math.PI);
        const thigh = 0.6 * Math.sin(swing);
        const bend = 0.25 + 1.25 * Math.max(0, Math.cos(swing));
        const hipSide: Vec3 = [hip[0], side * 0.45, hip[2]];
        const knee = limb(hipSide, thigh, 2.4);
        const foot = limb(knee, thigh - bend, 2.4);
        stroke(hipSide, knee, 0.95);
        stroke(knee, foot, 0.95);

        const arm = -0.7 * Math.sin(swing);
        const shoulder: Vec3 = [neck[0], side * 0.7, neck[2] - 0.2];
        const elbow = limb(shoulder, arm, 1.6);
        const hand = limb(elbow, arm + 1.5, 1.4);
        stroke(shoulder, elbow, 0.8);
        stroke(elbow, hand, 0.8);
      }
      stroke(hip, neck, 1.15);
      const head = at(1.1, 0, 8.9 + bounce);
      quad(head, head, 0.8 * size * scale * unit, 1, 0);
    }

    layer!.draw(vertices, n, (uniform) => {
      gl.uniform2f(uniform("u_res"), canvas.width, canvas.height);
      gl.uniform3fv(uniform("u_ink"), colors.ink);
      gl.uniform3fv(uniform("u_shadow"), colors.shadow);
    });
  }

  return {
    bind: layer.bind,
    frame(dt, frame) {
      for (const runner of runners) {
        const r = frame.radius - (runner.lane + 0.5) * frame.gap;
        const lap = lapLength(frame.straight, r);
        if (Number.isNaN(runner.progress)) {
          // Each runner starts on its staggered mark on the near bend.
          const arc = (0.18 + runner.lane * 0.13) * r;
          runner.progress = (4 * frame.straight + Math.PI * r + arc) / lap;
        }
        if (!frame.still) {
          const speed = SPEED * runner.pace;
          runner.progress = (runner.progress + (speed * dt) / lap) % 1;
          const stride = STRIDE * frame.gap * BODY_PER_LANE;
          runner.phase = (runner.phase + ((speed * dt) / stride) * TAU) % TAU;
        }
      }
      render(frame);
      return !frame.still && !layer.isLost();
    },
    destroy: layer.destroy,
  };
}
