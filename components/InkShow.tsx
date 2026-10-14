"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setEnabled } from "cuelume";
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { usePathname } from "next/navigation";
import type { RoughAnnotation } from "rough-notation/lib/model";
import { revealAnnotations } from "./revealAnnotations";
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
  /** Draw the marks. No-ops while a pass is already running. */
  start: () => void;
};

const InkShowContext = createContext<InkController | null>(null);

export function useInkShow() {
  return useContext(InkShowContext);
}

const LIFT_MS = 820;
const TRAVEL_MS = 320;
const HOP_MS = 240;

const STROKE_SRC: Record<ToolName, string> = {
  stilografica: "/sounds/pen.mp3",
  evidenziatore: "/sounds/highlighter.mp3",
};

const STROKE_VOLUME: Record<ToolName, number> = {
  stilografica: 0.4,
  evidenziatore: 0.45,
};

const ERASER_SRC = "/sounds/eraser.mp3";
const ERASER_VOLUME = 0.45;
/** The file is a long rub. One wipe is enough for an instant erase. */
const ERASER_MS = 900;
const SOUND_KEY = "portfolio-sound";

const inkControlClass =
  "grid size-10 shrink-0 place-items-center rounded-full text-text transition-[color,background-color,scale] duration-150 ease-out pointer-fine:hover:bg-inset pointer-fine:hover:text-foreground active:scale-[0.96] motion-reduce:transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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

/** The whole mark sits in the viewport, so the pen can draw it on screen. */
function readyToDraw(element: Element) {
  const box = element.getBoundingClientRect();
  const slop = 4;
  return (
    box.width > 0 &&
    box.height > 0 &&
    box.top >= -slop &&
    box.bottom <= window.innerHeight + slop &&
    box.left < window.innerWidth &&
    box.right > 0
  );
}

function aboveView(element: Element) {
  return element.getBoundingClientRect().bottom < 0;
}

function whenDrawable(element: Element, signal: AbortSignal) {
  const state = () => {
    if (signal.aborted) return "abort" as const;
    if (readyToDraw(element)) return "draw" as const;
    if (aboveView(element)) return "pass" as const;
    return null;
  };
  const now = state();
  if (now === "draw" || now === "pass") return Promise.resolve(now);
  if (now === "abort") return Promise.reject(abortError());

  return new Promise<"draw" | "pass">((resolve, reject) => {
    let settled = false;
    const finish = (next: "draw" | "pass" | "abort") => {
      if (settled) return;
      settled = true;
      cleanup();
      if (next === "abort") reject(abortError());
      else resolve(next);
    };
    const check = () => {
      const next = state();
      if (next) finish(next);
    };
    const onAbort = () => finish("abort");
    const cleanup = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.visualViewport?.removeEventListener("resize", check);
      window.visualViewport?.removeEventListener("scroll", check);
      signal.removeEventListener("abort", onAbort);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.visualViewport?.addEventListener("resize", check);
    window.visualViewport?.addEventListener("scroll", check);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * rough-notation inserts the svg right before a highlight and right after
 * anything else. Looking on both sides would pick up the previous sibling's
 * svg when two annotations sit in the same paragraph.
 */
function annotationSvg({ element, type }: InkEntry) {
  const node =
    type === "highlight"
      ? element.previousElementSibling
      : element.nextElementSibling;
  return node instanceof SVGSVGElement && node.classList.contains("rough-annotation")
    ? node
    : null;
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
  to: Point | (() => Point | null),
  msTravel: number,
  signal: AbortSignal,
) {
  const sample = () => (typeof to === "function" ? to() : to);
  let end = sample() ?? from;
  await animate(msTravel, signal, (t) => {
    const next = sample();
    if (next) end = next;
    const e = smoothstep(t);
    cursor.place(
      {
        x: from.x + (end.x - from.x) * e,
        y: from.y + (end.y - from.y) * e,
      },
      cursor.turn(from, end, true),
    );
  });
  return end;
}

function heldPaths(entry: InkEntry) {
  const svg = annotationSvg(entry);
  const paths = svg ? [...svg.querySelectorAll("path")] : [];
  for (const path of paths) holdStroke(path);
  return paths;
}

/** A stroke the pen has not reached yet must stay hidden, even if the library started it. */
function silenceRunning(current: InkEntry, entries: InkEntry[]) {
  for (const entry of entries) {
    if (entry === current) continue;
    const svg = annotationSvg(entry);
    if (!svg) continue;
    for (const path of svg.querySelectorAll("path")) {
      if (path.style.animationName === "rough-notation-dash") holdStroke(path);
    }
  }
}

/**
 * Stroke audio has to be unlocked from the click that starts the show.
 * A later `play()` sits behind font and travel awaits, past the gesture.
 */
let strokeClips: Record<ToolName, HTMLAudioElement> | null = null;
let strokeFade = 0;
let soundEnabled = true;
let eraserClip: HTMLAudioElement | null = null;
let eraserToken = 0;
const soundListeners = new Set<() => void>();

function clipsForStrokes() {
  if (strokeClips) return strokeClips;
  if (typeof Audio === "undefined") return null;
  strokeClips = {
    stilografica: Object.assign(new Audio(STROKE_SRC.stilografica), {
      preload: "auto",
      loop: true,
    }),
    evidenziatore: Object.assign(new Audio(STROKE_SRC.evidenziatore), {
      preload: "auto",
      loop: false,
    }),
  };
  return strokeClips;
}

function primeStrokeAudio() {
  if (!soundEnabled) return;
  const clips = clipsForStrokes();
  if (!clips) return;
  const token = strokeFade;
  for (const audio of Object.values(clips)) {
    if (!audio.paused) continue;
    audio.muted = true;
    void audio.play().then(() => {
      if (strokeFade !== token) {
        audio.muted = false;
        return;
      }
      audio.pause();
      if (audio.readyState >= 1) audio.currentTime = 0;
      audio.muted = false;
    }).catch(() => {
      audio.muted = false;
    });
  }
}

function stopStrokeAudio() {
  strokeFade += 1;
  const clips = strokeClips;
  if (!clips) return;
  for (const audio of Object.values(clips)) {
    audio.pause();
    if (audio.readyState >= 1) audio.currentTime = 0;
  }
}

function fadePause(audio: HTMLAudioElement) {
  if (audio.paused) return;
  const token = ++strokeFade;
  const from = audio.volume;
  const started = performance.now();
  const step = (now: number) => {
    if (token !== strokeFade) return;
    const t = Math.min(1, (now - started) / 90);
    audio.volume = from * (1 - t);
    if (t < 1) {
      requestAnimationFrame(step);
      return;
    }
    audio.pause();
  };
  requestAnimationFrame(step);
}

function beginStroke(tool: ToolName) {
  if (!soundEnabled) return;
  const clips = clipsForStrokes();
  if (!clips) return;
  strokeFade += 1;
  const audio = clips[tool];
  const other = clips[tool === "stilografica" ? "evidenziatore" : "stilografica"];
  other.pause();
  if (other.readyState >= 1) other.currentTime = 0;
  audio.volume = STROKE_VOLUME[tool];
  if (tool === "evidenziatore" && audio.readyState >= 1) audio.currentTime = 0;
  void audio.play().catch(() => {});
}

function endStroke(tool: ToolName) {
  const clips = strokeClips;
  if (!clips || tool === "evidenziatore") return;
  fadePause(clips.stilografica);
}

function eraserAudio() {
  if (eraserClip) return eraserClip;
  if (typeof Audio === "undefined") return null;
  eraserClip = Object.assign(new Audio(ERASER_SRC), { preload: "auto" });
  return eraserClip;
}

function stopEraserAudio() {
  eraserToken += 1;
  const audio = eraserClip;
  if (!audio) return;
  audio.pause();
  if (audio.readyState >= 1) audio.currentTime = 0;
}

function playEraser() {
  if (!soundEnabled) return;
  const audio = eraserAudio();
  if (!audio) return;
  const token = ++eraserToken;
  audio.volume = ERASER_VOLUME;
  if (audio.readyState >= 1) audio.currentTime = 0;
  void audio.play().catch(() => {});
  const started = performance.now();
  const step = (now: number) => {
    if (token !== eraserToken) return;
    const elapsed = now - started;
    if (elapsed < ERASER_MS) {
      requestAnimationFrame(step);
      return;
    }
    const t = Math.min(1, (elapsed - ERASER_MS) / 140);
    audio.volume = ERASER_VOLUME * (1 - t);
    if (t < 1) {
      requestAnimationFrame(step);
      return;
    }
    audio.pause();
    if (audio.readyState >= 1) audio.currentTime = 0;
  };
  requestAnimationFrame(step);
}

function notifySound() {
  for (const listener of soundListeners) listener();
}

let preferenceReady = false;

function subscribeSound(listener: () => void) {
  soundListeners.add(listener);
  return () => soundListeners.delete(listener);
}

function getSoundEnabled() {
  if (!preferenceReady && typeof window !== "undefined") {
    preferenceReady = true;
    try {
      soundEnabled = localStorage.getItem(SOUND_KEY) !== "off";
    } catch {
      soundEnabled = true;
    }
  }
  return soundEnabled;
}

function getServerSoundEnabled() {
  return true;
}

function setSoundEnabled(next: boolean) {
  soundEnabled = next;
  try {
    localStorage.setItem(SOUND_KEY, next ? "on" : "off");
  } catch {
    // Preference storage is optional.
  }
  setEnabled(next);
  if (!next) {
    stopStrokeAudio();
    stopEraserAudio();
  } else {
    primeStrokeAudio();
  }
  notifySound();
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

async function traceStroke(
  tool: ToolName,
  cursor: Cursor,
  paths: SVGPathElement[],
  duration: number,
  signal: AbortSignal,
) {
  if (!paths.some((path) => path.getTotalLength() > 0)) return null;
  beginStroke(tool);
  try {
    return await trace(cursor, paths, duration, signal);
  } finally {
    if (signal.aborted) stopStrokeAudio();
    else endStroke(tool);
  }
}

function EraserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  );
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
  const runRef = useRef<AbortController | null>(null);
  const playingRef = useRef(false);
  const [started, setStarted] = useState(false);
  const soundOn = useSyncExternalStore(subscribeSound, getSoundEnabled, getServerSoundEnabled);
  const reduceMotion = useReducedMotion();

  const register = useCallback((entry: InkEntry) => {
    entriesRef.current.push(entry);
    return () => {
      entriesRef.current = entriesRef.current.filter((item) => item !== entry);
    };
  }, []);

  const bind = useCallback((figure: InkFigure | null) => {
    figureRef.current = figure;
  }, []);

  const erase = useCallback(() => {
    runRef.current?.abort();
    stopStrokeAudio();
    playEraser();
    for (const entry of entriesRef.current) {
      if (entry.annotation.isShowing()) entry.annotation.hide();
      delete entry.element.dataset.annotated;
    }
    setStarted(false);
  }, []);

  const start = useCallback(() => {
    if (playingRef.current) return;
    const pending = entriesRef.current.some((entry) => !entry.annotation.isShowing());
    if (!pending) return;

    runRef.current?.abort();
    stopEraserAudio();
    primeStrokeAudio();
    const run = new AbortController();
    runRef.current = run;
    playingRef.current = true;
    setStarted(true);

    void play(run.signal, entriesRef, figureRef, writersRef)
      .catch((error) => {
        if (!isAbort(error)) throw error;
      })
      .finally(() => {
        playingRef.current = false;
        if (runRef.current === run) runRef.current = null;
        if (run.signal.aborted) return;
        const drawn = entriesRef.current.some(
          (entry) => entry.annotation.isShowing() || entry.element.dataset.annotated === "true",
        );
        if (!drawn) setStarted(false);
      });
  }, []);

  const controller = useMemo(
    () => ({ register, bind, start }),
    [register, bind, start],
  );

  useEffect(() => {
    setEnabled(getSoundEnabled());
  }, []);

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
    if (hold) return;
    runRef.current?.abort();
    stopStrokeAudio();
    stopEraserAudio();
    setStarted(false);
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
      <LazyMotion features={domAnimation}>
        {hold ? (
          <div className="fixed top-14 z-40 flex items-center gap-1 right-[calc(max(var(--page-padding-inline),(100vw-var(--page-max-width))/2+var(--page-padding-inline))-0.75rem)]">
            <AnimatePresence>
              {started ? (
                <m.button
                  key="eraser"
                  type="button"
                  aria-label="Cancella le annotazioni"
                  onClick={erase}
                  className={inkControlClass}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.3, bounce: 0 }
                  }
                >
                  <EraserIcon />
                </m.button>
              ) : null}
            </AnimatePresence>
            <button
              type="button"
              aria-pressed={soundOn}
              aria-label={soundOn ? "Disattiva i suoni" : "Attiva i suoni"}
              onClick={() => setSoundEnabled(!soundOn)}
              className={inkControlClass}
            >
              {soundOn ? (
                <Volume2 aria-hidden="true" className="size-4" strokeWidth={1.75} />
              ) : (
                <VolumeX aria-hidden="true" className="size-4" strokeWidth={1.75} />
              )}
            </button>
          </div>
        ) : null}
      </LazyMotion>
    </InkShowContext.Provider>
  );
}

type Grip = "hand" | "cup" | "entrance" | "fail";

/**
 * The page is taller than the screen. Draw marks already in view, then each
 * one that scrolls in. The pen enters from below when the cup is off-screen.
 */
async function playScrolled(
  signal: AbortSignal,
  entries: InkEntry[],
  figure: InkFigure,
  writers: Writers,
  figureRef: RefObject<InkFigure | null>,
) {
  const cursor = cursorFor(writers);
  let held: ToolName | null = null;
  let pos: Point | null = null;
  let borrowed = false;

  const cupVisible = () => {
    const pot = document.querySelector("[data-hairline='portapenne']");
    if (!pot) return false;
    const box = pot.getBoundingClientRect();
    const visible = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
    return visible > Math.min(box.height, window.innerHeight) * 0.45;
  };

  const offstage = (near: Point): Point => ({
    x: Math.min(window.innerWidth - 32, Math.max(32, near.x)),
    y: window.innerHeight + 40,
  });

  async function putAway() {
    if (!held) {
      cursor.hide();
      return;
    }
    const tool = held;
    try {
      if (pos && !signal.aborted) {
        const back = borrowed && cupVisible() ? figure.tip(tool) : null;
        await fly(cursor, pos, back ?? offstage(pos), TRAVEL_MS, signal);
      }
    } finally {
      if (borrowed) figure.hide(tool, false);
      cursor.hide();
      figure.lift(null);
      borrowed = false;
      pos = null;
      held = null;
    }
  }

  async function take(tool: ToolName): Promise<Grip> {
    if (held !== tool) await putAway();
    held = tool;
    if (pos) return "hand";
    if (!cupVisible()) return "entrance";

    figure.lift(tool);
    await sleep(LIFT_MS, signal);
    const start = figure.tip(tool);
    if (!start) return "fail";
    figure.hide(tool, true);
    borrowed = true;
    cursor.show(tool);
    cursor.place(start, LIFT_OFF);
    pos = start;
    return "cup";
  }

  try {
    for (const entry of entries) {
      if (aboveView(entry.element)) {
        revealAnnotations([entry]);
        continue;
      }
      if (!readyToDraw(entry.element)) {
        await putAway();
        const gate = await whenDrawable(entry.element, signal);
        if (gate === "pass") {
          revealAnnotations([entry]);
          continue;
        }
      }

      const grip = await take(toolFor(entry.type));
      if (grip === "fail") {
        for (const rest of entries) {
          if (!rest.annotation.isShowing()) revealAnnotations([rest]);
        }
        return;
      }

      entry.annotation.animate = false;
      entry.annotation.show();
      let paths = heldPaths(entry);
      silenceRunning(entry, entries);

      const originNow = () => (paths[0] ? pointOn(paths[0], 0) : null);
      const origin = originNow();
      if (origin && grip === "entrance") {
        const from = offstage(origin);
        cursor.show(toolFor(entry.type));
        cursor.place(from, LIFT_OFF);
        pos = await fly(cursor, from, originNow, TRAVEL_MS, signal);
      } else if (origin && pos) {
        pos = await fly(cursor, pos, originNow, grip === "hand" ? HOP_MS : TRAVEL_MS, signal);
      }

      const duration = entry.annotation.animationDuration ?? 500;
      entry.element.style.setProperty("--annotation-delay", "0ms");
      entry.element.style.setProperty("--annotation-duration", `${duration}ms`);
      entry.element.dataset.annotated = "true";

      paths = heldPaths(entry);
      const end = await traceStroke(toolFor(entry.type), cursor, paths, duration, signal);
      if (end) pos = end;
    }

    await putAway();
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
  if (reduce || !figure || !writers) {
    for (const entry of entries) revealAnnotations([entry]);
    return;
  }
  // Cup and first mark share the screen, so the pen can leave the cup.
  // Otherwise it flies in from below and draws each mark as it reaches the viewport.
  if (!together) {
    await playScrolled(signal, entries, figure, writers, figureRef);
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
      let paths = heldPaths(entry);
      silenceRunning(entry, entries);

      const origin = paths[0] ? pointOn(paths[0], 0) : null;
      if (origin && pos) {
        pos = await fly(cursor, pos, origin, leftPot ? TRAVEL_MS : HOP_MS, signal);
      }
      leftPot = false;

      const duration = entry.annotation.animationDuration ?? 500;
      entry.element.style.setProperty("--annotation-delay", "0ms");
      entry.element.style.setProperty("--annotation-duration", `${duration}ms`);
      entry.element.dataset.annotated = "true";

      paths = heldPaths(entry);
      const end = await traceStroke(tool, cursor, paths, duration, signal);
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
