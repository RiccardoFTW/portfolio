"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname } from "next/navigation";
import type { RoughAnnotation } from "rough-notation/lib/model";
import { revealAnnotations } from "./AnnotationGroup";
import { createEvidenziatore } from "./best-practices/hairline/evidenziatore";
import { createStilografica } from "./best-practices/hairline/stilografica";
import styles from "./best-practices/hairline/ChapterIllustration.module.css";

type ToolName = "stilografica" | "evidenziatore";

export type InkEntry = {
  element: HTMLElement;
  annotation: RoughAnnotation;
  type: string;
};

export type InkFigure = {
  lift(name: string | null): void;
  tip(name: string): { x: number; y: number } | null;
  hide(name: string, hidden: boolean): void;
};

type InkController = {
  register: (entry: InkEntry) => () => void;
  bind: (figure: InkFigure | null) => void;
};

const InkShowContext = createContext<InkController | null>(null);

export function useInkShow() {
  return useContext(InkShowContext);
}

const LIFT_MS = 820;
const TRAVEL_MS = 320;
const HOP_MS = 240;

type Point = { x: number; y: number };

function toolFor(type: string): ToolName {
  return type === "highlight" ? "evidenziatore" : "stilografica";
}

function abortError() {
  return new DOMException("Aborted", "AbortError");
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const id = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(abortError());
      },
      { once: true },
    );
  });
}

/** CSS `ease-out`, the curve rough-notation uses on stroke-dashoffset. */
function easeOut(t: number) {
  return cubicBezier(0, 0, 0.58, 1, t);
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;
  const slopeX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const slope = slopeX(u);
    if (Math.abs(slope) < 1e-6) break;
    u = Math.min(1, Math.max(0, u - (sampleX(u) - t) / slope));
  }
  return sampleY(u);
}

function animate(
  ms: number,
  signal: AbortSignal,
  tick: (t: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const started = performance.now();
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      reject(abortError());
    };
    signal.addEventListener("abort", stop, { once: true });
    const step = (now: number) => {
      try {
        const t = Math.min(1, (now - started) / Math.max(ms, 1));
        tick(t);
        if (t < 1) frame = requestAnimationFrame(step);
        else {
          signal.removeEventListener("abort", stop);
          resolve();
        }
      } catch (error) {
        signal.removeEventListener("abort", stop);
        reject(error);
      }
    };
    frame = requestAnimationFrame(step);
  });
}

function inView(element: Element) {
  const box = element.getBoundingClientRect();
  const visible =
    Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
  const needed = Math.min(24, box.height);
  return (
    visible + 0.5 >= needed &&
    box.left < window.innerWidth &&
    box.right > 0
  );
}

function annotationSvg(element: HTMLElement) {
  for (const node of [element.previousElementSibling, element.nextElementSibling]) {
    if (node instanceof SVGSVGElement && node.classList.contains("rough-annotation")) {
      return node;
    }
  }
  return null;
}

function pointOn(path: SVGPathElement, length: number): Point | null {
  const svg = path.ownerSVGElement;
  const ctm = path.getScreenCTM();
  if (!svg || !ctm) return null;
  const local = path.getPointAtLength(Math.max(0, Math.min(length, path.getTotalLength())));
  const pt = svg.createSVGPoint();
  pt.x = local.x;
  pt.y = local.y;
  const screen = pt.matrixTransform(ctm);
  return { x: screen.x, y: screen.y };
}

type Writer = {
  stage: HTMLDivElement;
  /** Nib or chisel, in the 400 × 320 viewBox, used as the rotation origin. */
  nib: [number, number];
};

type Writers = Record<ToolName, Writer>;

const LIFT_OFF = -72;

function heading(from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx * dx + dy * dy < 0.25) return null;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

type Cursor = {
  show(tool: ToolName): void;
  hide(): void;
  place(point: Point, angle: number): void;
  turn(from: Point, to: Point, allowFlip: boolean): number;
};

/** The lying pen pivots on its nib. A return stroke does not spin it around. */
function cursorFor(writers: Writers): Cursor {
  let aim = LIFT_OFF;
  let stage: HTMLDivElement | null = null;
  let nib: [number, number] = [0, 0];

  function place(point: Point, angle: number) {
    if (!stage) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const ox = (nib[0] / 400) * width;
    const oy = (nib[1] / 320) * height;
    stage.style.transformOrigin = `${ox}px ${oy}px`;
    stage.style.transform = `translate(${point.x - ox}px, ${point.y - oy}px) rotate(${angle}deg)`;
  }

  return {
    show(tool) {
      const writer = writers[tool];
      stage = writer.stage;
      nib = writer.nib;
      aim = LIFT_OFF;
      writer.stage.style.opacity = "1";
      const other: ToolName = tool === "stilografica" ? "evidenziatore" : "stilografica";
      writers[other].stage.style.opacity = "0";
    },
    hide() {
      if (stage) stage.style.opacity = "0";
      stage = null;
    },
    place,
    turn(from, to, allowFlip) {
      const target = heading(from, to);
      if (target == null) return aim;
      let delta = target - aim;
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;
      if (!allowFlip && Math.abs(delta) > 100) return aim;
      aim += delta * 0.45;
      return aim;
    },
  };
}

function readingOrder(a: InkEntry, b: InkEntry) {
  return a.element.compareDocumentPosition(b.element) &
    Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
}

async function fly(
  cursor: Cursor,
  from: Point,
  to: Point,
  msTravel: number,
  signal: AbortSignal,
) {
  await animate(msTravel, signal, (t) => {
    const e = smoothstep(t);
    cursor.place(
      {
        x: from.x + (to.x - from.x) * e,
        y: from.y + (to.y - from.y) * e,
      },
      cursor.turn(from, to, true),
    );
  });
  return to;
}

function heldPaths(element: HTMLElement) {
  const svg = annotationSvg(element);
  const paths = svg ? [...svg.querySelectorAll("path")] : [];
  for (const path of paths) holdStroke(path);
  return paths;
}

/** A stroke the pen has not reached yet must stay hidden, even if the library started it. */
function silenceRunning(current: HTMLElement) {
  for (const svg of document.querySelectorAll("svg.rough-annotation")) {
    const host =
      svg.previousElementSibling instanceof HTMLElement
        ? svg.previousElementSibling
        : svg.nextElementSibling;
    if (host === current) continue;
    for (const path of svg.querySelectorAll("path")) {
      if (path.style.animationName === "rough-notation-dash") holdStroke(path);
    }
  }
}

/** Keep the stroke invisible until the nib draws it. The CSS animation would run on its own. */
function holdStroke(path: SVGPathElement) {
  const len = path.getTotalLength();
  for (const animation of path.getAnimations()) animation.cancel();
  path.style.animation = "none";
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  return len;
}

async function trace(
  cursor: Cursor,
  paths: SVGPathElement[],
  duration: number,
  signal: AbortSignal,
) {
  const tracks = paths
    .map((path) => ({ path, len: holdStroke(path) }))
    .filter((track) => track.len > 0);
  if (!tracks.length) return null;

  const totalLen = tracks.reduce((sum, track) => sum + track.len, 0);
  let last: Point | null = null;

  for (const track of tracks) {
    const msTravel = Math.max(140, duration * (track.len / totalLen));
    await animate(msTravel, signal, (t) => {
      const e = easeOut(t);
      track.path.style.strokeDashoffset = `${track.len * (1 - e)}`;
      const point = pointOn(track.path, e * track.len);
      if (!point) return;
      const angle = last ? cursor.turn(last, point, false) : cursor.turn(point, point, false);
      cursor.place(point, angle);
      last = point;
    });
  }

  return last;
}

export function InkShow({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hold = pathname === "/";
  const entriesRef = useRef<InkEntry[]>([]);
  const figureRef = useRef<InkFigure | null>(null);
  const writersRef = useRef<Writers | null>(null);
  const penStageRef = useRef<HTMLDivElement>(null);
  const penSvgRef = useRef<SVGSVGElement>(null);
  const markStageRef = useRef<HTMLDivElement>(null);
  const markSvgRef = useRef<SVGSVGElement>(null);

  const register = useCallback((entry: InkEntry) => {
    entriesRef.current.push(entry);
    return () => {
      entriesRef.current = entriesRef.current.filter((item) => item !== entry);
    };
  }, []);

  const bind = useCallback((figure: InkFigure | null) => {
    figureRef.current = figure;
  }, []);

  const controller = useMemo(() => ({ register, bind }), [register, bind]);

  useEffect(() => {
    if (!hold) return;
    const penStage = penStageRef.current;
    const penSvg = penSvgRef.current;
    const markStage = markStageRef.current;
    const markSvg = markSvgRef.current;
    if (!penStage || !penSvg || !markStage || !markSvg) return;

    const pen = createStilografica(penStage, penSvg);
    const mark = createEvidenziatore(markStage, markSvg);
    writersRef.current = {
      stilografica: { stage: penStage, nib: pen.nib() },
      evidenziatore: { stage: markStage, nib: mark.nib() },
    };
    return () => {
      writersRef.current = null;
      pen.destroy();
      mark.destroy();
    };
  }, [hold]);

  useEffect(() => {
    if (!hold) return;
    const signal = new AbortController();

    void play(signal.signal, entriesRef, figureRef, writersRef).catch((error) => {
      if (!isAbort(error)) throw error;
    });

    return () => signal.abort();
  }, [hold]);

  return (
    <InkShowContext.Provider value={hold ? controller : null}>
      {children}
      {hold ? (
        <>
          <div
            ref={penStageRef}
            aria-hidden="true"
            data-hairline="stilografica"
            className={`${styles.illustration} ${styles.writer}`}
          >
            <svg ref={penSvgRef} viewBox="0 0 400 320" className="size-full" />
          </div>
          <div
            ref={markStageRef}
            aria-hidden="true"
            data-hairline="evidenziatore"
            className={`${styles.illustration} ${styles.marker} ${styles.writer}`}
          >
            <svg ref={markSvgRef} viewBox="0 0 400 320" className="size-full" />
          </div>
        </>
      ) : null}
    </InkShowContext.Provider>
  );
}

async function play(
  signal: AbortSignal,
  entriesRef: RefObject<InkEntry[]>,
  figureRef: RefObject<InkFigure | null>,
  writersRef: RefObject<Writers | null>,
) {
  if (signal.aborted) return;
  await document.fonts.ready;
  if (signal.aborted) return;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  if (signal.aborted) return;

  const pending = () =>
    entriesRef.current
      .filter((entry) => !entry.annotation.isShowing())
      .sort(readingOrder);
  let entries = pending();
  for (let i = 0; i < 4 && entries.length === 0; i++) {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    if (signal.aborted) return;
    entries = pending();
  }
  const figure = figureRef.current;
  const writers = writersRef.current;
  const pot = document.querySelector("[data-hairline='portapenne']");
  const text = entries[0]?.element;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fits = document.documentElement.scrollHeight <= window.innerHeight + 8;
  const together = Boolean(fits && pot && text && inView(pot) && inView(text));

  if (!entries.length) return;
  if (reduce || !figure || !writers || !together) {
    for (const entry of entries) revealAnnotations([entry]);
    return;
  }

  const cursor = cursorFor(writers);
  let held: ToolName | null = null;
  let pos: Point | null = null;
  let leftPot = false;

  try {
    for (const entry of entries) {
      const tool = toolFor(entry.type);
      if (tool !== held) {
        if (held && pos) {
          const back = figure.tip(held);
          if (back) await fly(cursor, pos, back, TRAVEL_MS, signal);
          figure.hide(held, false);
          cursor.hide();
        }
        figure.lift(tool);
        held = tool;
        await sleep(LIFT_MS, signal);
        const start = figure.tip(tool);
        if (!start) {
          figure.lift(null);
          held = null;
          for (const rest of entries) {
            if (!rest.annotation.isShowing()) revealAnnotations([rest]);
          }
          return;
        }
        figure.hide(tool, true);
        cursor.show(tool);
        cursor.place(start, LIFT_OFF);
        pos = start;
        leftPot = true;
      }

      entry.annotation.animate = false;
      entry.annotation.show();
      let paths = heldPaths(entry.element);
      silenceRunning(entry.element);
      const seq = ((window as unknown as { __seq?: string[] }).__seq ??= []);
      seq.push(
        `show ${entry.element.textContent?.trim().slice(0, 24)} paths=${paths.length} anim=${paths[0]?.style.animationName || "none"} off=${paths[0]?.style.strokeDashoffset ? "set" : "empty"}`,
      );

      const origin = paths[0] ? pointOn(paths[0], 0) : null;
      if (origin && pos) {
        pos = await fly(cursor, pos, origin, leftPot ? TRAVEL_MS : HOP_MS, signal);
      }
      leftPot = false;

      const duration = entry.annotation.animationDuration ?? 500;
      entry.element.style.setProperty("--annotation-delay", "0ms");
      entry.element.style.setProperty("--annotation-duration", `${duration}ms`);
      entry.element.dataset.annotated = "true";

      paths = heldPaths(entry.element);
      const end = await trace(cursor, paths, duration, signal);
      if (end) pos = end;
    }

    if (held && pos) {
      const back = figure.tip(held);
      if (back) await fly(cursor, pos, back, TRAVEL_MS, signal);
      figure.hide(held, false);
      cursor.hide();
      figure.lift(null);
      held = null;
    }
  } catch (error) {
    if (isAbort(error)) return;
    for (const entry of entries) {
      if (!entry.annotation.isShowing()) revealAnnotations([entry]);
    }
    throw error;
  } finally {
    cursor.hide();
    const current = figureRef.current;
    if (held && current) {
      current.hide(held, false);
      current.lift(null);
    }
  }
}
