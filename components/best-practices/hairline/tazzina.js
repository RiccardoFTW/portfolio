/* eslint-disable */
import { HL } from "./kernel.js";

let definition;
function hairline(figure) {
  definition = figure;
}

/** A centred cup slides sideways; its handle shifts the visual weight. */
const {
  Cam, circ, clamp, disposer, fit, hull, mk, pointer, poly, proj,
  put, reducedMotion, register, ringAt, solid, spring, stepS,
} = HL;

function mount({ stage, svg, read, liquid }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.12);
  const maxShift = 12, saucerZ = 5, rimZ = 39, handleZ = 23;
  const rim = circ(29, 72), foot = circ(19, 72), plate = circ(58, 96);
  const extremes = plate.map((s) => [s.u, s.v, saucerZ]);
  for (const offset of [-maxShift, maxShift]) {
    const diagonal = offset / Math.SQRT2;
    extremes.push(...rim.map((s) => [s.u + diagonal, s.v - diagonal, rimZ]));
    extremes.push([(46 + offset) / Math.SQRT2, -(46 + offset) / Math.SQRT2, handleZ]);
  }
  fit(C, extremes, 200, 166);
  const P = proj(C);
  const centre = P(0, 0, saucerZ);
  // Twice the default spring frequency, with the same damping ratio.
  const shift = spring(0, { k: 400, c: 36, m: 1 });
  let over = null, drawn = null, lastRead = "";

  // Paint the fixed saucer first, including its shallow inner well.
  put(solid(svg), {
    sil: poly(hull(ringAt(P, circ(54, 96), 1).concat(ringAt(P, plate, saucerZ)))),
    crease: poly(ringAt(P, circ(53, 96), saucerZ)),
  });
  mk("path", { class: "lo nf", d: poly(ringAt(P, circ(32, 72), saucerZ)) }, svg);

  // An open handle sits behind the opaque cup, so its attachments disappear.
  const handle = mk("path", { class: "sil hi", "fill-rule": "evenodd" }, svg);
  const cup = solid(svg);
  cup.sil.classList.add("hi");
  function handleRing(Q, rx, rz) {
    return Array.from({ length: 72 }, (_, i) => {
      const a = i / 72 * Math.PI * 2;
      const reach = (28 + rx * Math.cos(a)) / Math.SQRT2;
      return Q(reach, -reach, handleZ + rz * Math.sin(a));
    });
  }
  function draw() {
    const offset = clamp(shift.x, -maxShift, maxShift);
    if (offset !== drawn) {
      drawn = offset;
      // Equal and opposite world offsets give a horizontal screen movement.
      const diagonal = offset / Math.SQRT2;
      const Q = (x, y, z) => P(x + diagonal, y - diagonal, z);
      handle.setAttribute("d", poly(handleRing(Q, 18, 14)) + poly(handleRing(Q, 11, 8)));
      put(cup, {
        sil: poly(hull(ringAt(Q, foot, saucerZ).concat(ringAt(Q, rim, rimZ)))),
        crease: poly(ringAt(Q, circ(26, 72), rimZ)),
      });
    }
    const amount = Math.round(offset);
    const text = over ? `scarto ${amount > 0 ? "+" : amount < 0 ? "−" : ""}${Math.abs(amount)}` : "rest";
    if (text !== lastRead) { lastRead = text; read.textContent = text; }
  }
  draw();

  const loop = register(stage, (dt) => {
    const moving = stepS(shift, dt);
    draw();
    // The liquid keeps the loop awake while it sloshes or drops are still falling.
    const settling = liquid
      ? liquid.frame(dt, {
          P, offset: clamp(shift.x, -maxShift, maxShift), velocity: shift.v,
          saucerZ, rimZ, rimR: 29, innerR: 26, footR: 19, plateR: 54,
          still: reducedMotion(),
        })
      : false;
    return moving || settling;
  });
  bag.add(loop.unregister);
  liquid?.bind(loop.wake);
  function retarget() {
    shift.t = over ? value * clamp((over[0] - centre[0]) / 90, -1, 1) : 0;
    loop.wake();
  }
  bag.add(pointer(stage, {
    move(point) {
      // The whole fixed stage responds, including the margins around the cup.
      over = point;
      retarget();
    },
    leave() { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set(next) { value = clamp(next, 6, maxShift); retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "tazzina",
  means: "Il manico sposta il peso visivo: la tazzina scorre sul piattino alla ricerca di equilibrio.",
  rules: [1, 3, 4, 5, 6, 7, 8, 9],
  range: [6, 9, 12],
  mount,
});

export function createTazzina(stage, svg, liquid) {
  HL.inject(document);
  return definition.mount({ stage, svg, liquid, read: { textContent: "rest" } }, definition.range[1]);
}