"use client";

import {
  animate,
  domAnimation,
  LazyMotion,
  m,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

type Phase = "idle" | "filling" | "filled";

const FILL_DURATION = 0.9;
const DRAIN_DURATION = 0.15;
const FILL_COMPLETE_THRESHOLD = 0.98;

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 16 16">
      <path
        clipRule="evenodd"
        d="M6.75 2.75C6.75 2.06 7.31 1.5 8 1.5C8.69 1.5 9.25 2.06 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23 6.48 0 8 0C9.52 0 10.75 1.23 10.75 2.75V3H12.92H14.25H15V4.5H14.25H13.88L13.18 13.69C13.08 14.99 11.99 16 10.68 16H5.32C4.01 16 2.92 14.99 2.82 13.69L2.12 4.5H1.75H1V3H1.75H3.08H5.25ZM4.32 13.58L3.62 4.5H12.38L11.68 13.58C11.64 14.1 11.21 14.5 10.68 14.5H5.32C4.79 14.5 4.36 14.1 4.32 13.58Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 16 16"
    >
      <path d="m3.5 8 3 3 6-6" />
    </svg>
  );
}

const contentClassName =
  "flex h-12 items-center gap-2.5 rounded-full px-7 text-base font-medium";

export function HoldToDeleteButton() {
  const reduceMotion = useReducedMotion();
  const fillDuration = reduceMotion ? 0.01 : FILL_DURATION;
  const drainDuration = reduceMotion ? 0.01 : DRAIN_DURATION;

  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const progress = useMotionValue(0);
  const fillClipPath = useTransform(
    progress,
    (value) => `inset(0 ${(1 - value) * 100}% 0 0)`,
  );
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  function stopAnimation() {
    animationRef.current?.stop();
    animationRef.current = null;
  }

  function commitPhase(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  useEffect(() => stopAnimation, []);

  function latchDeleted() {
    stopAnimation();
    progress.set(1);
    commitPhase("filled");
  }

  function drain() {
    stopAnimation();
    commitPhase("idle");
    animationRef.current = animate(progress, 0, {
      duration: drainDuration,
      ease: [0.215, 0.61, 0.355, 1],
      onComplete: () => {
        animationRef.current = null;
      },
    });
  }

  function startFill() {
    commitPhase("filling");
    stopAnimation();
    animationRef.current = animate(progress, 1, {
      duration: fillDuration,
      ease: "linear",
      onComplete: () => {
        animationRef.current = null;
        if (phaseRef.current === "filling") latchDeleted();
      },
    });
  }

  function releaseFill() {
    if (phaseRef.current !== "filling") return;

    if (progress.get() >= FILL_COMPLETE_THRESHOLD) {
      latchDeleted();
      return;
    }

    drain();
  }

  function cancelFill() {
    if (phaseRef.current !== "filling") return;
    drain();
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (phaseRef.current === "filled") {
      drain();
      return;
    }

    if (phaseRef.current !== "idle") return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startFill();
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    releaseFill();
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    cancelFill();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();

    if (phaseRef.current === "filled") {
      drain();
      return;
    }

    if (phaseRef.current === "idle") startFill();
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    releaseFill();
  }

  const isDeleted = phase === "filled";
  const label = isDeleted ? "Deleted" : "Hold to delete";
  const Icon = isDeleted ? CheckIcon : TrashIcon;

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <m.button
          type="button"
          aria-describedby="hold-to-delete-description"
          aria-pressed={isDeleted}
          className="relative min-w-48 touch-manipulation select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#e5484d] focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas)"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={cancelFill}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        >
          <span
            className={`${contentClassName} pointer-events-none relative bg-[#f6f5f5] text-[#21201c] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`}
          >
            <Icon />
            {label}
          </span>
          <span className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-full">
            <m.span
              style={{ clipPath: fillClipPath }}
              className={`${contentClassName} absolute inset-0 bg-[#ffdbdc] text-[#e5484d]`}
            >
              <Icon />
              {label}
            </m.span>
          </span>
        </m.button>

        <p id="hold-to-delete-description" className="text-body">
          {isDeleted
            ? "The demo is complete. Press the button once to reset it."
            : "Press and hold for one second to confirm the destructive action."}
        </p>
        <p aria-live="polite" className="sr-only">
          {isDeleted ? "Item deleted" : ""}
        </p>
      </div>
    </LazyMotion>
  );
}
