/**
 * Stilografica: a fountain pen lying on the desk, nib toward screen-right,
 * the nib lifted a little off the paper. The pointer along the pen presses
 * it down: on the nib it dips fully and takes the bright stroke, on the
 * barrel it dips less and the bright moves to the barrel. The slider is
 * how far the full press lowers the nib, in degrees.
 */
const { Cam, disposer, fit, mk, open, pointer, poly, proj, rad, register, tdone, tset, tval, tween } = HL;

const H = [Math.SQRT1_2, -Math.SQRT1_2, 0], G = [Math.SQRT1_2, Math.SQRT1_2, 0], Z = [0, 0, 1];
const EYE = [0.866 * G[0], 0.866 * G[1], 0.5];
const PROF = [[0, 0.8], [2.2, 5.4], [6, 6.4], [68, 6.4], [72, 5], [80, 3.6], [84, 0.5]];
const NIB = [80, 102], R = 6.4, REST = 10, JOIN = 0.72, HIT = 22, N = 16;

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));

/** Pitched by `phi` degrees, nib up when phi is positive. The tail sits on the desk. */
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
    for (const t of [0, NIB[1]]) ends.push(add(o, L, t), add(add(o, L, t), G, R), add(add(o, L, t), Z, R));
  }
  fit(C, ends, 200, 166);
  const P = proj(C), Q = (p) => P(p[0], p[1], p[2]);

  const g = mk("g", {}, svg);
  const sil = mk("path", { class: "sil" }, g);
  const seam = mk("path", { class: "nf lo" }, g);
  const nibEl = mk("path", { class: "sil" }, g);
  const slit = mk("path", { class: "nf lo" }, g);
  const ink = mk("path", { class: "ink fo" }, g);

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
    const arc = (t, r) => open(Array.from({ length: 13 }, (_, i) => at(t, r, r, th0 - Math.PI / 2 + (i / 12) * Math.PI)));
    seam.setAttribute("d", arc(68, 6.4));
    const [t0, t1] = NIB, f = (t, w) => Q(add(add(add(o, L, t), p, w), q, 1.4));
    const k = (t1 - t0) / 16;
    nibEl.setAttribute("d", poly([f(t0, -3.4), f(t0 + 5 * k, -3.8), f(t0 + 11 * k, -1.9), f(t1, 0), f(t0 + 11 * k, 1.9), f(t0 + 5 * k, 3.8), f(t0, 3.4)]));
    nibEl.classList.toggle("hi", hot);
    slit.setAttribute("d", open([f(t0 + 7 * k, 0), f(t1, 0)]));
    ink.setAttribute("d", poly([f(t0 + 13 * k, -1.3), f(t1, 0), f(t0 + 13 * k, 1.3)]));
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
  const segs = [[band(0), band(NIB[1] * JOIN)], [band(NIB[1] * JOIN), band(NIB[1])]];
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
    read.textContent = a < 0 ? "rest" : a === 0 ? "corpo" : "pennino";
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
      const q = norm(cross(norm(cross(L, EYE)), L));
      return Q(add(add(o, L, NIB[1]), q, 1.4));
    },
  };
}

hairline({
  name: "stilografica",
  means: "Una stilografica distesa, pennino a destra: il puntatore sul pennino lo abbassa.",
  rules: [1, 3, 4, 5, 8, 9],
  range: [6, 10, 16],
  mount,
});
