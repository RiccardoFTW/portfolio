/* eslint-disable */
import { HL } from "./kernel.js";

let definition;
function hairline(figure) {
  definition = figure;
}

/**
 * Portapenne: a pen pot holding five tools, fanned out at rest, the fountain
 * pen standing in the middle with the bright stroke. The tool under the
 * pointer slides up along its own axis and takes the bright stroke; the
 * others lean away from it on the screen, staggered outwards from it on the
 * 700ms lift curve. Each tool is told apart by its own parts: a sharpened
 * cone, a nib with its slit, a cap with a clip, a chisel tip, a ferrule and
 * a tuft. The slider is how far the chosen tool rises.
 */
const { Cam, circ, disposer, facing, fit, hull, mk, open, place, pointer, poly, proj, rad, register, ringAt, run, tdone, tset, tval, tween } = HL;

const H = [Math.SQRT1_2, -Math.SQRT1_2, 0], G = [Math.SQRT1_2, Math.SQRT1_2, 0], Z = [0, 0, 1];
const EYE = [0.866 * G[0], 0.866 * G[1], 0.5];
const R0 = 22, R1 = 26, WT = 2.4, CH = 42, SPREAD = 7, STEP = 45, N = 20, HIT = 11;

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));
/** v turned t radians round G: on screen, a lean to the right for positive t. */
const turn = (v, t) => add(add(mul(v, Math.cos(t)), cross(G, v), Math.sin(t)), G, dot(G, v) * (1 - Math.cos(t)));
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/**
 * The five tools, left to right on screen. `dir` is where the tool leans, in (H, G); `lean` how far, in degrees.
 * `prof` is its radius along its axis, [t, r] or [t, r across, r toward the eye]; `marks` the seams, [t, r].
 */
const TOOLS = [
  { name: "pennello", at: [6, -4], dir: [-1, -0.2], lean: 24,
    prof: [[0, 0], [1, 2], [2, 2.3], [68, 2.6], [68.5, 3], [82, 3.3], [85, 3.9], [92, 4.4], [99, 3.4], [105, 1.5], [109, 0]],
    marks: [[68.5, 3], [75, 3.15], [82, 3.3]] },
  { name: "matita", at: [3, 8], dir: [-0.8, 0.3], lean: 12,
    prof: [[0, 0], [1.2, 2.8], [3, 3.2], [78, 3.2], [90, 1.1], [92, 0]], marks: [[78, 3.2], [88, 1.5]] },
  { name: "stilografica", at: [0, -6], dir: [0.1, -0.5], lean: 4, nib: [80, 96],
    prof: [[0, 0], [1.5, 3.8], [3, 4.4], [64, 4.4], [65, 3.8], [79, 3.1], [80, 0]], marks: [[64, 4.4], [56, 4.4]] },
  { name: "evidenziatore", at: [-4, 6], dir: [0.8, 0.35], lean: 11,
    prof: [[0, 0], [1.5, 5.2], [3, 6], [62, 6], [68, 3.6, 3.6], [76, 3.2, 0.8]], marks: [[62, 6]],
    chisel: [[72, 3.4, 2.2], [76, 3.2, 0.8]] },
  { name: "pennarello", at: [-6, -3], dir: [1, -0.2], lean: 22, clip: [70, 93],
    prof: [[0, 0], [1.5, 4.6], [3, 5.2], [64, 5.2], [64.5, 5.7], [96, 5.7], [99, 4.8], [101, 2.8], [102, 0]], marks: [[64.5, 5.7]] },
];

/** A tool's axis, risen by `lift` and leaning `spread` (-1 to 1) of SPREAD aside: its foot and direction. */
function axis(tool, lift, spread) {
  const hd = norm(add(mul(H, tool.dir[0]), G, tool.dir[1]));
  const L = turn(add(mul(hd, Math.sin(rad(tool.lean))), Z, Math.cos(rad(tool.lean))), rad(spread * SPREAD));
  const foot = add(add(mul(H, tool.at[0]), G, tool.at[1]), Z, 2);
  return { o: add(foot, L, lift), L };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;

  const C = Cam(45, 0.5, 2.1);
  const ends = [];
  // Centre the resting figure; raised tools use the surrounding viewBox space.
  for (const t of TOOLS) {
    const { o, L } = axis(t, 0, 0);
    ends.push(add(o, L, t.prof[t.prof.length - 1][0]));
  }
  for (const q of circ(R1, 24)) ends.push([q.u, q.v, CH], [q.u, q.v, 0]);
  fit(C, ends, 200, 160);
  const P = proj(C), Q = (p) => P(p[0], p[1], p[2]);
  const front = facing(C);

  // The pot, which never moves: its back is painted before the tools, its front wall after them.
  const foot = circ(R0, 72), top = circ(R1, 72), inner = circ(R1 - WT, 72);
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, CH)))) }, g);
  mk("path", { class: "nf", d: poly(ringAt(P, inner, CH)) }, g);

  const tools = TOOLS.map((t) => {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), seams = mk("path", { class: "nf lo" }, grp);
    const extra = mk("path", { class: "nf" }, grp);
    const nibEl = t.nib ? mk("path", { class: "sil" }, grp) : null;
    const slit = t.nib ? mk("path", { class: "nf lo" }, grp) : null;
    const hole = t.nib ? mk("circle", { r: 0.9, class: "dot off" }, grp) : null;
    const ink = t.nib ? mk("path", { class: "ink" }, grp) : null;
    const mark = t.chisel ? mk("path", { class: "mark fo" }, grp) : null;
    return { ...t, grp, sil, seams, extra, nibEl, slit, hole, ink, mark, lift: tween(0), spread: tween(0) };
  });
  // Back to front: by where each tool crosses the rim.
  tools.slice().sort((a, b) => {
    const pa = add(axis(a, 0, 0).o, axis(a, 0, 0).L, CH), pb = add(axis(b, 0, 0).o, axis(b, 0, 0).L, CH);
    return pa[0] + pa[1] - (pb[0] + pb[1]);
  }).forEach((t) => g.appendChild(t.grp));

  const iF = LR(ringAt(P, run(inner, front), CH)), oT = LR(ringAt(P, run(top, front), CH)), oB = LR(ringAt(P, run(foot, front), 0));
  const foreground = mk("g", { "data-cup-front": "" }, g);
  mk("path", { class: "fo", d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]) }, foreground);
  mk("path", { class: "nf lo", d: open(oT) }, foreground);
  mk("path", { class: "nf", d: open(iF) }, foreground);
  mk("path", { class: "nf sil", d: open([oT[0], ...oB, oT[oT.length - 1]]) }, foreground);

  function draw(tool, lift, spread) {
    const { o, L } = axis(tool, lift, spread);
    const p = norm(cross(L, EYE)), q = norm(cross(p, L));
    const th0 = Math.atan2(dot(q, EYE), dot(p, EYE));
    const at = (t, rp, rq, th) => Q(add(add(add(o, L, t), p, rp * Math.cos(th)), q, rq * Math.sin(th)));
    const a = Q(o), b = Q(add(o, L, 1)), len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const across = (s) => (s[1] - a[1]) * (b[0] - a[0]) / len - (s[0] - a[0]) * (b[1] - a[1]) / len;
    const left = [], right = [];
    for (const [t, rp, rq = rp] of tool.prof) {
      const ring = Array.from({ length: N }, (_, i) => at(t, rp, rq, (i / N) * 2 * Math.PI));
      let lo = ring[0], hi = ring[0];
      for (const s of ring) { if (across(s) < across(lo)) lo = s; if (across(s) > across(hi)) hi = s; }
      left.push(lo); right.push(hi);
    }
    tool.sil.setAttribute("d", poly([...left, ...right.reverse()]));
    const near = (t, r) => open(Array.from({ length: 13 }, (_, i) => at(t, r, r, th0 - Math.PI / 2 + (i / 12) * Math.PI)));
    tool.seams.setAttribute("d", tool.marks.map(([t, r]) => near(t, r)).join(""));
    if (tool.clip) tool.extra.setAttribute("d", open([at(tool.clip[0], 7, 7, th0), at(tool.clip[1], 7, 7, th0)]));
    if (tool.nib) {
      // The nib: a plate in the plane facing the eye, pointed, with its slit and breather hole.
      const [t0, t1] = tool.nib, f = (t, w) => Q(add(add(add(o, L, t), p, w), q, 1.6));
      const k = (t1 - t0) / 16;
      tool.nibEl.setAttribute("d", poly([f(t0, -3), f(t0 + 5 * k, -3.3), f(t0 + 11 * k, -1.7), f(t1, 0), f(t0 + 11 * k, 1.7), f(t0 + 5 * k, 3.3), f(t0, 3)]));
      tool.slit.setAttribute("d", open([f(t0 + 7 * k, 0), f(t1, 0)]));
      place(tool.hole, f(t0 + 6 * k, 0));
      tool.ink.setAttribute("d", poly([f(t0 + 13 * k, -1.1), f(t1, 0), f(t0 + 13 * k, 1.1)]));
    }
    if (tool.chisel) {
      const tipL = [], tipR = [];
      for (const [t, rp, rq = rp] of tool.chisel) {
        const ring = Array.from({ length: N }, (_, i) => at(t, rp, rq, (i / N) * 2 * Math.PI));
        let lo = ring[0], hi = ring[0];
        for (const s of ring) { if (across(s) < across(lo)) lo = s; if (across(s) > across(hi)) hi = s; }
        tipL.push(lo); tipR.push(hi);
      }
      tool.mark.setAttribute("d", poly([...tipL, ...tipR.reverse()]));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tools) {
      draw(t, tval(t.lift, now), tval(t.spread, now));
      if (!tdone(t.lift, now) || !tdone(t.spread, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // Hit areas: each tool's resting shaft, from the rim to its top. They never move.
  const shafts = TOOLS.map((t) => {
    const { o, L } = axis(t, 0, 0), top = t.prof[t.prof.length - 1][0];
    return [Q(add(o, L, CH / L[2])), Q(add(o, L, top))];
  });
  function hit([x, y]) {
    let best = -1, bd = HIT;
    shafts.forEach(([s, e], i) => {
      const dx = e[0] - s[0], dy = e[1] - s[1], u = Math.max(0, Math.min(1, ((x - s[0]) * dx + (y - s[1]) * dy) / (dx * dx + dy * dy)));
      const d = Math.hypot(x - s[0] - u * dx, y - s[1] - u * dy);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  const REST = 2;
  let act = null, locked = false;
  function setActive(a, force = false) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? REST;
    act = a;
    tools.forEach((t, i) => {
      const delay = Math.abs(i - from) * STEP;
      tset(t.lift, i === a ? rise : 0, now, delay);
      tset(t.spread, a < 0 || i === a ? 0 : Math.sign(i - a) / Math.abs(i - a), now, delay);
      const bright = a < 0 ? i === REST : i === a;
      t.sil.classList.toggle("hi", bright);
      t.nibEl?.classList.toggle("hi", bright);
    });
    read.textContent = a < 0 ? "rest" : tools[a].name;
    B.wake();
  }
  setActive(-1);

  // While a tool is out drawing on the page, the pointer must not pull another one up.
  bag.add(pointer(stage, {
    move: (p) => { if (!locked) setActive(hit(p)); },
    leave: () => { if (!locked) setActive(-1); },
  }));
  bag.add(() => svg.replaceChildren());

  /** Screen pose of a tool, sampled at its current lift and spread. */
  function pose(name) {
    const tool = tools.find((t) => t.name === name);
    if (!tool) return null;
    const now = performance.now();
    const { o, L } = axis(tool, tval(tool.lift, now), tval(tool.spread, now));
    const end = tool.nib ? tool.nib[1] : tool.prof[tool.prof.length - 1][0];
    const m = svg.getScreenCTM();
    if (!m) return null;
    const screen = (point) => {
      const [x, y] = Q(point);
      const pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      const s = pt.matrixTransform(m);
      return { x: s.x, y: s.y };
    };
    const q = norm(cross(norm(cross(L, EYE)), L));
    const nib = add(add(o, L, end), q, tool.nib ? 1.6 : 0);
    return { tip: screen(nib), base: screen(o) };
  }

  return {
    set: (v) => { rise = v; if (act >= 0) setActive(act, true); },
    destroy: bag.dispose,
    lift: (name) => {
      if (name == null) { locked = false; setActive(-1); return; }
      const i = tools.findIndex((t) => t.name === name);
      if (i < 0) return;
      locked = true;
      setActive(i);
    },
    tip: (name) => pose(name)?.tip ?? null,
    pose,
    fade: (name, opacity) => {
      const tool = tools.find((t) => t.name === name);
      if (tool) tool.grp.style.opacity = String(opacity);
    },
    hide: (name, hidden) => {
      const tool = tools.find((t) => t.name === name);
      if (tool) {
        tool.grp.style.visibility = hidden ? "hidden" : "";
        tool.grp.style.opacity = "1";
      }
    },
  };
}

hairline({
  name: "portapenne",
  means: "Un portapenne con cinque strumenti: quello sotto il puntatore si alza, e gli altri si scostano a cascata.",
  rules: [1, 2, 4, 5, 6, 8, 9],
  range: [10, 18, 26],
  mount,
});

export function createPortapenne(stage, svg) {
  HL.inject(document);
  return definition.mount({ stage, svg, read: { textContent: "rest" } }, definition.range[1]);
}
