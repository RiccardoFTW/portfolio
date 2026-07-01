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
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import { addToast } from "@/components/toast/toast-store";

function TorchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="28"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="28"
    >
      <path d="M15 3H9C8.06 3 7.59 3 7.29 3.29C7 3.59 7 4.06 7 5V6C7 7.04 7.27 8.07 7.79 8.98L9 11V18C9 18.93 9 19.4 9.15 19.77C9.36 20.26 9.74 20.64 10.23 20.85C10.6 21 11.07 21 12 21C12.93 21 13.4 21 13.77 20.85C14.26 20.64 14.64 20.26 14.85 19.77C15 19.4 15 18.93 15 18V11L16.21 8.98C16.73 8.07 17 7.04 17 6V5C17 4.06 17 3.59 16.71 3.29C16.41 3 15.94 3 15 3Z" />
      <path d="M7 6H17" />
      <path d="M12 13V15" />
    </svg>
  );
}

function BluetoothIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="28"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="28"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M11.6 12V8.61C11.6 7.67 11.6 7.2 11.89 7.04C12.18 6.89 12.56 7.16 13.31 7.71L14.16 8.33C14.72 8.74 15 8.94 15 9.23C15 9.51 14.72 9.72 14.16 10.13L11.6 12ZM11.6 12V15.39C11.6 16.33 11.6 16.8 11.89 16.96C12.18 17.11 12.56 16.84 13.31 16.29L14.16 15.67C14.72 15.26 15 15.06 15 14.77C15 14.49 14.72 14.28 14.16 13.87L11.6 12ZM11.6 12L9 9.78M11.6 12L9 14.22" />
    </svg>
  );
}

const FILL_DURATION = 1;
const DRAIN_DURATION = 0.4;
const FILL_COMPLETE_THRESHOLD = 0.98;

type Phase = "idle" | "filling" | "filled";

type PressFillButtonProps = {
  ariaLabel: string;
  icon: ReactNode;
  fillClassName: string;
  fillIconClassName: string;
  baseClassName: string;
  toastTitle: string;
  toastDescription?: string;
  toastTitleColor?: string;
};

function PressFillButton({
  ariaLabel,
  icon,
  fillClassName,
  fillIconClassName,
  baseClassName,
  toastTitle,
  toastDescription,
  toastTitleColor,
}: PressFillButtonProps) {
  const reduceMotion = useReducedMotion();
  const fillDuration = reduceMotion ? 0.01 : FILL_DURATION;
  const drainDuration = reduceMotion ? 0.01 : DRAIN_DURATION;

  const progress = useMotionValue(0);
  const fillClipPath = useTransform(
    progress,
    (value) => `inset(${(1 - value) * 100}% 0 0 0)`,
  );

  const phaseRef = useRef<Phase>("idle");
  const cancelFillRef = useRef(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const [isActive, setIsActive] = useState(false);

  const contentClassName =
    "flex size-14 items-center justify-center rounded-full";

  const stopAnimation = () => {
    animationRef.current?.stop();
    animationRef.current = null;
  };

  const setPhase = (phase: Phase) => {
    phaseRef.current = phase;
    setIsActive(phase === "filled");
  };

  const latchFilled = () => {
    stopAnimation();
    progress.set(1);
    setPhase("filled");
    addToast(toastTitle, {
      description: toastDescription,
      titleColor: toastTitleColor,
    });
  };

  const drain = () => {
    stopAnimation();
    setPhase("idle");

    animationRef.current = animate(progress, 0, {
      duration: drainDuration,
      ease: [0.215, 0.61, 0.355, 1],
      onComplete: () => {
        animationRef.current = null;
      },
    });
  };

  const startFill = () => {
    cancelFillRef.current = false;
    setPhase("filling");
    stopAnimation();

    animationRef.current = animate(progress, 1, {
      duration: fillDuration,
      ease: "linear",
      onComplete: () => {
        animationRef.current = null;
        if (!cancelFillRef.current) {
          latchFilled();
        }
      },
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (phaseRef.current === "filled") {
      drain();
      return;
    }

    if (phaseRef.current !== "idle") {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    startFill();
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (phaseRef.current !== "filling") {
      return;
    }

    if (progress.get() >= FILL_COMPLETE_THRESHOLD) {
      latchFilled();
      return;
    }

    cancelFillRef.current = true;
    drain();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (phaseRef.current === "filling") {
      cancelFillRef.current = true;
      drain();
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.button
        type="button"
        aria-label={ariaLabel}
        aria-pressed={isActive}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative size-14 touch-manipulation rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-(--component-surface)"
      >
        <span
          className={`${contentClassName} ${baseClassName} pointer-events-none absolute inset-0`}
        >
          {icon}
        </span>
        <span className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-full">
          <m.span
            style={{ clipPath: fillClipPath }}
            className={`${contentClassName} ${fillClassName} ${fillIconClassName} absolute inset-0`}
          >
            {icon}
          </m.span>
        </span>
      </m.button>
    </LazyMotion>
  );
}

export function TorchButton() {
  return (
    <PressFillButton
      ariaLabel="Hold to light"
      icon={<TorchIcon />}
      fillClassName="bg-[#fef08a]"
      fillIconClassName="text-[#ffffff]"
      baseClassName="bg-[#f6f5f5] text-[#21201c]"
      toastTitle="Torch on"
      toastTitleColor="#ca8a04"
    />
  );
}

export function LikeButton() {
  return (
    <PressFillButton
      ariaLabel="Hold to connect"
      icon={<BluetoothIcon />}
      fillClassName="bg-[#0082FC]"
      fillIconClassName="text-[#ffffff]"
      baseClassName="bg-[#f6f5f5] text-[#21201c]"
      toastTitle="Bluetooth on"
      toastTitleColor="#0082FC"
    />
  );
}
