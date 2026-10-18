/* eslint-disable */
import { HL } from "./kernel.js";

let definition;
function hairline(figure) {
  definition = figure;
}

/** Five running lanes: every inset preserves the two semicircles' centres. */
const {
  Cam, circ, clamp, disposer, fit, hull, mk, open, pointer, poly, proj,
  put, reducedMotion, register, ringAt, rrect, seg, solid, spring, stepS, unproj,
} = HL;

const STRAIGHT = 48, R = 46, LANES = 5;
const MIN_GAP = 3.5, MAX_GAP = 7;

function mount({ stage, svg, read, runners }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.83);
  const W = STRAIGHT + R;
  const ring = (inset) => rrect(-W + inset, -R + inset, W - inset, R - inset, R - inset, 22);
  const outer = ring(0);
  fit(C, outer.flatMap((s) => [[s.u, s.v, -3], [s.u, s.v, 0]]), 200, 166);
  const P = proj(C);
  // The cup's responsive spring also suits a continuously scrubbed lane width.
  const gap = spring(value, { k: 400, c: 36, m: 1 });
  let over = null, drawn = null, lastRead = "";

  // A shallow opaque slab gives the running surface a front edge.
  const crease = ringAt(P, ring(0.9), 0);
  put(solid(svg), {
    sil: poly(hull(ringAt(P, outer, -3).concat(ringAt(P, outer, 0)))),
    crease: open(crease.concat([crease[0]])),
  });
  const lanes = Array.from({ length: LANES - 1 }, () => mk("path", { class: "sil nf" }, svg));
  const infield = mk("path", { class: "sil hi" }, svg);
  const finish = mk("path", { class: "lo nf" }, svg);
  const starts = mk("path", { class: "lo nf" }, svg);

  // The field's fixed markings identify the venue without words or colours.
  const pitch = mk("path", { class: "lo nf" }, svg);

  function draw() {
    const g = clamp(gap.x, MIN_GAP, MAX_GAP);
    if (g !== drawn) {
      drawn = g;
      lanes.forEach((el, i) => el.setAttribute("d", poly(ringAt(P, ring((i + 1) * g), 0))));
      infield.setAttribute("d", poly(ringAt(P, ring(LANES * g), 0)));
      // Two adjacent lines run across the far straight, one finish for all lanes.
      finish.setAttribute("d", seg(P(19, -R + 0.6, 0), P(19, -R + LANES * g - 0.6, 0))
        + seg(P(20.5, -R + 0.6, 0), P(20.5, -R + LANES * g - 0.6, 0)));
      // Staggered starts follow the near bend, each confined to its own lane.
      starts.setAttribute("d", Array.from({ length: LANES }, (_, i) => {
        const angle = Math.PI / 2 - 0.18 - i * 0.13;
        const point = (radius) => P(STRAIGHT + radius * Math.cos(angle), radius * Math.sin(angle), 0);
        return seg(point(R - i * g - 0.6), point(R - (i + 1) * g + 0.6));
      }).join(""));
      const halfHeight = Math.min(14, R - LANES * g - 3);
      const areaHeight = halfHeight * 0.65;
      pitch.setAttribute("d", poly(ringAt(P, rrect(-34, -halfHeight, 34, halfHeight, 0.8, 4), 0))
        + seg(P(0, -halfHeight, 0), P(0, halfHeight, 0))
        + poly(ringAt(P, circ(Math.min(5, halfHeight * 0.4), 36), 0))
        + open([P(-34, -areaHeight, 0), P(-24, -areaHeight, 0), P(-24, areaHeight, 0), P(-34, areaHeight, 0)])
        + open([P(34, -areaHeight, 0), P(24, -areaHeight, 0), P(24, areaHeight, 0), P(34, areaHeight, 0)]));
    }
    const shownGap = Math.round(g * 10) / 10;
    const innerR = Math.round((R - LANES * g) * 10) / 10;
    const text = over ? `g${shownGap} · r${innerR}` : "rest";
    if (text !== lastRead) { lastRead = text; read.textContent = text; }
  }
  draw();

  const loop = register(stage, (dt) => {
    const moving = stepS(gap, dt);
    draw();
    // Runners keep the loop awake; the kernel already pauses it off screen.
    const running = runners
      ? runners.frame(dt, {
          P, straight: STRAIGHT, radius: R, lanes: LANES,
          gap: clamp(gap.x, MIN_GAP, MAX_GAP), still: reducedMotion(),
        })
      : false;
    return moving || running;
  });
  bag.add(loop.unregister);
  runners?.bind(loop.wake);
  function retarget() {
    gap.t = over ? clamp(value + over[0] / W * 1.5, MIN_GAP, MAX_GAP) : value;
    loop.wake();
  }
  bag.add(pointer(stage, {
    move(point) {
      // The fixed outer footprint remains the hit area at every lane width.
      const p = unproj(C, point[0], point[1], 0);
      const distance = Math.hypot(p[0] - clamp(p[0], -STRAIGHT, STRAIGHT), p[1]);
      over = distance <= R ? p : null;
      retarget();
    },
    leave() { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return {
    set(next) { value = clamp(next, MIN_GAP, MAX_GAP); retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pista",
  means: "Le corsie condividono il centro delle curve: cambiando la distanza tra i bordi, cambiano i raggi.",
  rules: [1, 3, 4, 6, 7, 8, 9, 10],
  range: [4, 5.5, 7],
  mount,
});

export function createPista(stage, svg, runners) {
  HL.inject(document);
  return definition.mount({ stage, svg, runners, read: { textContent: "rest" } }, definition.range[1]);
}