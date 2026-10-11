import { HL } from "./kernel.js";

let definition;
function hairline(figure) {
  definition = figure;
}

/**
 * Evidenziatore: a highlighter lying on the desk, chisel toward screen-right,
 * the tip lifted a little off the paper. The pointer along it presses it
 * down: on the chisel it dips fully and the lip takes the bright stroke, on
 * the body it dips less and the bright moves to the body. The slider is how
 * far the full press lowers the tip, in degrees.
 */
const { Cam, disposer, fit, mk, open, pointer, poly, proj, rad, register, tdone, tset, tval, tween } = HL;

const H = [Math.SQRT1_2, -Math.SQRT1_2, 0], G = [Math.SQRT1_2, Math.SQRT1_2, 0], Z = [0, 0, 1];
const EYE = [0.866 * G[0], 0.866 * G[1], 0.5];
const PROF = [[0, 0.9], [2.4, 7.2], [6, 8.4], [76, 8.4], [82, 7.4], [90, 5.4, 5.4], [100, 4.2, 1.15]];
const TIP = 100, R = 8.4, REST = 10, JOIN = 0.78, HIT = 24, N = 16;

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));

/** Pitched by `phi` degrees, tip up when phi is positive. The tail sits on the desk. */
function pose(phi) {
  const L = norm(add(mul(H, Math.cos(rad(phi))), Z, Math.sin(rad(phi))));
  return { o: [0, 0, R], L };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dip = value;

  const C = Cam(45, 0.5, 2.55);
  const ends = [];
  for (const phi of [REST, REST - 16]) {
    const { o, L } = pose(phi);
    for (const t of [0, TIP]) ends.push(add(o, L, t), add(add(o, L, t), G, R), add(add(o, L, t), Z, R));
  }
  fit(C, ends, 200, 166);
  const P = proj(C), Q = (p) => P(p[0], p[1], p[2]);

  const g = mk("g", {}, svg);
  const sil = mk("path", { class: "sil" }, g);
  const seam = mk("path", { class: "nf lo" }, g);
  const face = mk("path", { class: "mark fo" }, g);
  const lip = mk("path", { class: "lip nf" }, g);

  function draw(phi, hot) {
    const { o, L } = pose(phi);
    const p = norm(cross(L, EYE)), q = norm(cross(p, L));
    const at = (t, rp, rq, th) => Q(add(add(add(o, L, t), p, rp * Math.cos(th)), q, rq * Math.sin(th)));
    const a = Q(o), b = Q(add(o, L, 1)), span = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const across = (s) => ((s[1] - a[1]) * (b[0] - a[0]) - (s[0] - a[0]) * (b[1] - a[1])) / span;
    const left = [], right = [];
    for (const [t, rp, rq = rp] of PROF) {
      const ring = Array.from({ length: N }, (_, i) => at(t, rp, rq, (i / N) * 2 * Math.PI));
      let lo = ring[0], hi = ring[0];
      for (const s of ring) { if (across(s) < across(lo)) lo = s; if (across(s) > across(hi)) hi = s; }
      left.push(lo); right.push(hi);
    }
    sil.setAttribute("d", poly([...left, ...right.reverse()]));
    sil.classList.toggle("hi", !hot);
    const th0 = Math.atan2(dot(q, EYE), dot(p, EYE));
    seam.setAttribute("d", open(Array.from({ length: 13 }, (_, i) => at(76, 8.4, 8.4, th0 - Math.PI / 2 + (i / 12) * Math.PI))));
    const last = PROF[PROF.length - 1];
    const mouth = Array.from({ length: N }, (_, i) => at(last[0], last[1], last[2], (i / N) * 2 * Math.PI));
    let lo = mouth[0], hi = mouth[0];
    for (const s of mouth) { if (across(s) < across(lo)) lo = s; if (across(s) > across(hi)) hi = s; }
    const f = (t, w) => Q(add(add(add(o, L, t), p, w), q, 0.35));
    face.setAttribute("d", poly([f(TIP - 9, -3.1), f(TIP - 0.8, -2.2), f(TIP - 0.8, 2.2), f(TIP - 9, 3.1)]));
    lip.setAttribute("d", open([lo, hi]));
    lip.classList.toggle("hi", hot);
    lip.classList.toggle("lo", !hot);
  }

  let act = null;
  const press = tween(0);
  const B = register(stage, (_dt, now) => {
    draw(REST - tval(press, now) * dip, act !== 0);
    return !tdone(press, now);
  });
  bag.add(B.unregister);

  const rest = pose(REST);
  const band = (t) => Q(add(rest.o, rest.L, t));
  const segs = [[band(0), band(TIP * JOIN)], [band(TIP * JOIN), band(TIP)]];
  function near(pt, s, e) {
    const dx = e[0] - s[0], dy = e[1] - s[1];
    const u = Math.max(0, Math.min(1, ((pt[0] - s[0]) * dx + (pt[1] - s[1]) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(pt[0] - s[0] - u * dx, pt[1] - s[1] - u * dy);
  }
  function hit(pt) {
    const d = segs.map(([s, e]) => near(pt, s, e));
    if (Math.min(d[0], d[1]) > HIT) return -1;
    return d[1] < d[0] ? 1 : 0;
  }

  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(press, a === 1 ? 1 : a === 0 ? 0.35 : 0, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : a === 0 ? "corpo" : "punta";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { dip = v; B.wake(); },
    destroy: bag.dispose,
    nib: () => {
      const { o, L } = pose(REST - tval(press, performance.now()) * dip);
      return Q(add(o, L, TIP));
    },
  };
}

hairline({
  name: "evidenziatore",
  means: "Un evidenziatore disteso, scalpello a destra: il puntatore sulla punta la preme.",
  rules: [1, 3, 4, 5, 8, 9],
  range: [6, 10, 16],
  mount,
});

export function createEvidenziatore(stage, svg) {
  HL.inject(document);
  return definition.mount({ stage, svg, read: { textContent: "rest" } }, definition.range[1]);
}
