/**
 * Calla: one calla lily on a slightly arched stem, with a single leaf. The
 * spathe is a funnel seen three-quarters on, its back drawn up into a point
 * and its front lip turned out, the long spadix standing in its throat. The
 * pointer brushes the plant: it pushes the stem away from its side, most at a
 * hand's reach and less farther off, and the stem bends from its foot, which
 * never moves. Flower and leaf ride the bend. The slider is the widest bend,
 * in degrees.
 */
const { Cam, circ, disposer, fit, hull, mk, open, pointer, poly, proj, r2, rad, register, ringAt, spring, stepS } = HL;

const H = [Math.SQRT1_2, -Math.SQRT1_2, 0], G = [Math.SQRT1_2, Math.SQRT1_2, 0], Z = [0, 0, 1];
const SL = 150, SN = 24, SR0 = 2.6, SR1 = 2.1, ARCH = 14, LEAF_AT = 0.16;
const FL = 52, FR = 21, NECK = 2.15, M = 72, RINGS = [0, 0.05, 0.12, 0.22, 0.36, 0.5, 0.64, 0.78, 0.9, 1];
const LL = 80, LW = 30, LN = 28, REACH = 70, WIDEST = 10;

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));
/** v turned t radians round G, the axis the stem bends about: positive leans toward +H, right on screen. */
const turn = (v, t) => add(add(mul(v, Math.cos(t)), cross(G, v), Math.sin(t)), G, dot(G, v) * (1 - Math.cos(t)));

const EYE = norm(add(mul(G, 0.866), Z, 0.5));
const AX = norm(add(add(mul(H, 0.4), Z, 0.82), G, 0.42));
const UP = norm(add(Z, AX, -dot(Z, AX))), SIDE = cross(AX, UP);
const LEAF = norm(add(add(mul(H, -0.82), Z, 0.5), G, -0.12)), LSIDE = norm(cross(EYE, LEAF));

/** The stem's share of the bend at s, 0 at its foot and 1 at its top. */
const share = (s) => s ** 1.4;

/** The plant bent `flex` degrees at its top, in world space. */
function pose(flex) {
  const stem = [{ c: [0, 0, 0], side: H, r: SR0 }];
  let c = [0, 0, 0];
  for (let i = 1; i <= SN; i++) {
    const s = i / SN, mid = (i - 0.5) / SN;
    c = add(c, turn(Z, rad(ARCH * mid ** 1.6 + flex * share(mid))), SL / SN);
    stem.push({ c, side: turn(H, rad(ARCH * s ** 1.6 + flex * share(s))), r: SR0 + (SR1 - SR0) * s });
  }
  const t = rad(flex), A = stem[Math.round(LEAF_AT * SN)].c, tl = rad(flex * share(LEAF_AT));
  const lo = [], hi = [], rib = [];
  for (let k = 0; k <= LN; k++) {
    const q = k / LN, m = add(mul(LEAF, LL * q), Z, LL * (0.24 * Math.sin(Math.PI * q) - 0.22 * q * q));
    const tw = 0.5 * q, across = add(mul(LSIDE, Math.cos(tw)), EYE, -Math.sin(tw));
    const half = (LW / 2) * Math.max(0, Math.sin(Math.PI * q ** 0.62)) ** 0.85;
    lo.push(add(m, across, half)); hi.push(add(m, across, -half)); rib.push(m);
  }
  const at = (p) => add(A, turn(p, tl));
  return {
    stem, O: c, T: turn(Z, rad(ARCH + flex)), a: turn(AX, t), u: turn(UP, t), w: turn(SIDE, t),
    leaf: lo.concat(hi.reverse()).map(at), rib: rib.slice(1, LN - 3).map(at),
  };
}

/** A point of the spathe: s runs up the funnel, th round it, 0 being the back where it draws up into its point. */
function spathe(f, s, th, inset = 0) {
  const e = s ** 3, tip = Math.max(0, Math.cos(th)) ** 10, lip = Math.max(0, -Math.cos(th)) ** 2;
  const ax = e * FL * (0.2 * Math.cos(th) + 0.5 * tip - 0.08 * lip) - inset * 4;
  const r = (NECK + (FR - NECK) * s ** 2 + e * FR * (0.24 * tip + 0.22 * lip)) * (1 - inset * 0.13);
  // The spine leaves the stem along the stem's own tangent, then turns into the flower's axis.
  const spine = add(add(f.O, f.T, -3 * (1 - s) ** 2 + 0.6 * FL * s * (1 - s)), f.a, FL * s * s + ax);
  return add(spine, add(mul(f.u, Math.cos(th)), f.w, Math.sin(th)), r);
}

/** The spadix: three rings up a rod standing in the throat, leaning toward the spathe's point. */
function spadix(f) {
  const b = norm(add(f.a, f.u, 0.28)), p = norm(cross(b, f.w)), q = cross(b, p);
  const foot = add(f.O, f.a, FL * 0.3);
  return [[0, 2.8], [FL * 0.6, 2.5], [FL * 0.66, 1.3]].map(([l, r]) => {
    const c = add(foot, b, l);
    return Array.from({ length: 16 }, (_, i) => add(add(c, p, r * Math.cos(i * Math.PI / 8)), q, r * Math.sin(i * Math.PI / 8)));
  }).flat();
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let widest = value, over = null, drawn = NaN, said = "";

  const C = Cam(45, 0.5, 1.38);
  const ends = [];
  for (const flex of [-WIDEST, 0, WIDEST]) {
    const f = pose(flex);
    ends.push(...f.stem.map((n) => n.c), ...f.leaf, ...spadix(f));
    for (let i = 0; i < M; i += 4) ends.push(spathe(f, 1, (i / M) * 2 * Math.PI));
  }
  fit(C, ends, 200, 166);
  const P = proj(C), Q = (p) => P(p[0], p[1], p[2]);
  const anchor = Q(pose(0).stem[SN / 2].c)[0];

  const g = mk("g", {}, svg);
  mk("path", { class: "dash nf", d: poly(ringAt(P, circ(10, 32), 0)) }, g);
  const leaf = mk("path", { class: "sil" }, g), rib = mk("path", { class: "nf lo" }, g);
  // Stem and spathe are a fill and an open outline, so the cut where one meets the other is never stroked.
  const stemFill = mk("path", { class: "fo" }, g), stemEl = mk("path", { class: "nf sil" }, g);
  const bodyFill = mk("path", { class: "fo" }, g), body = mk("path", { class: "nf sil" }, g);
  const crease = mk("path", { class: "nf lo" }, g);
  const rod = mk("path", { class: "sil hi" }, g);
  const wall = mk("path", { class: "fo" }, g), lip = mk("path", { class: "nf" }, g);

  function draw(flex) {
    const f = pose(flex);
    leaf.setAttribute("d", poly(f.leaf.map(Q)));
    rib.setAttribute("d", open(f.rib.map(Q)));
    const L = f.stem.map((n) => Q(add(n.c, n.side, n.r))), R = f.stem.map((n) => Q(add(n.c, n.side, -n.r)));
    stemFill.setAttribute("d", poly(L.concat(R.slice().reverse())));
    stemEl.setAttribute("d", open(L) + open(R));

    // The funnel's outline: each ring's two extremes across the flower's axis on screen, then round the far half of the mouth.
    const rings = RINGS.map((s) => Array.from({ length: M }, (_, i) => Q(spathe(f, s, (i / M) * 2 * Math.PI))));
    const o = Q(f.O), tip = Q(add(f.O, f.a, 1)), len = Math.hypot(tip[0] - o[0], tip[1] - o[1]);
    const d = [(tip[0] - o[0]) / len, (tip[1] - o[1]) / len];
    const across = (p) => p[1] * d[0] - p[0] * d[1], along = (p) => p[0] * d[0] + p[1] * d[1];
    const ext = (ring) => {
      let lo = 0, hi = 0;
      ring.forEach((p, i) => { if (across(p) < across(ring[lo])) lo = i; if (across(p) > across(ring[hi])) hi = i; });
      return [lo, hi];
    };
    const sides = rings.slice(0, -1).map((ring) => ext(ring).map((i) => ring[i]));
    const mouth = rings[rings.length - 1], [iL, iR] = ext(mouth);
    const arc = (a, b) => { const out = [a]; for (let i = a; i !== b;) { i = (i + 1) % M; out.push(i); } return out; };
    const mean = (ix) => ix.reduce((s, i) => s + along(mouth[i]), 0) / ix.length;
    const one = arc(iL, iR), two = arc(iR, iL).reverse();
    const [far, near] = mean(one) > mean(two) ? [one, two] : [two, one];
    const left = sides.map((s) => s[0]), right = sides.map((s) => s[1]).reverse();
    const outline = [...left, ...far.map((i) => mouth[i]), ...right];
    bodyFill.setAttribute("d", poly(outline));
    body.setAttribute("d", open(outline));
    crease.setAttribute("d", open(far.slice(4, -4).map((i) => Q(spathe(f, 1, (i / M) * 2 * Math.PI, 1)))));
    rod.setAttribute("d", poly(hull(spadix(f).map(Q))));
    wall.setAttribute("d", poly([...left, ...near.map((i) => mouth[i]), ...right]));
    lip.setAttribute("d", open(near.map((i) => mouth[i])));
  }

  draw(0); drawn = 0; read.textContent = said = "rest";
  const bend = spring(0, { eps: 0.02 });
  const B = register(stage, (dt) => {
    const moving = stepS(bend, dt);
    if (r2(bend.x) !== drawn) { drawn = r2(bend.x); draw(drawn); }
    const text = over ? `inclinazione ${Math.abs(Math.round(bend.x))}°` : "rest";
    if (text !== said) { said = text; read.textContent = text; }
    return moving;
  });
  bag.add(B.unregister);

  /** The push: away from the pointer's side, strongest at REACH from the stem's resting line, fading past it. */
  function retarget() {
    const u = over ? (over[0] - anchor) / REACH : 0;
    bend.t = -widest * u * Math.exp(0.5 * (1 - u * u));
    rod.classList.toggle("hi", !over);
    stemEl.classList.toggle("hi", !!over);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { widest = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "calla",
  means: "Una calla sfiorata: lo stelo si flette dal piede, lontano dal puntatore, e fiore e foglia seguono la curva.",
  rules: [1, 3, 5, 6, 8, 9],
  range: [4, 7, 10],
  mount,
});
