import { m } from "motion/react";

type ToastProps = {
  index: number;
  reduceMotion: boolean | null;
  title: string;
  description?: string;
  titleColor?: string;
};

const TOAST_OFFSET = 120;
const TOAST_EASE_OUT = [0.23, 1, 0.32, 1] as const;
const TOAST_OPACITY_DURATION = 0.18;
const TOAST_SPRING = {
  type: "spring",
  duration: 0.48,
  bounce: 0.18,
} as const;
const REDUCED_MOTION_DURATION = 0.01;
const TOAST_EXIT_DURATION = 0.5;

export function Toast({ index, reduceMotion, title, description, titleColor }: ToastProps) {
  return (
    <m.div
      className="absolute top-0 right-0 w-max max-w-[calc(100vw-2rem)]"
      initial={
        reduceMotion
          ? {
            opacity: 0,
            y: `${index * TOAST_OFFSET}%`,
          }
          : {
            opacity: 0,
            y: "-100%",
            scale: 0.9,
          }
      }
      animate={{
        opacity: 1,
        y: `${index * TOAST_OFFSET}%`,
        scale: 1,
      }}
      transition={{
        opacity: {
          duration: reduceMotion ? REDUCED_MOTION_DURATION : TOAST_OPACITY_DURATION,
          ease: TOAST_EASE_OUT,
        },
        y: reduceMotion ? { duration: REDUCED_MOTION_DURATION } : TOAST_SPRING,
        scale: reduceMotion ? { duration: REDUCED_MOTION_DURATION } : TOAST_SPRING,
      }}
      exit={
        reduceMotion
          ? {
            opacity: 0,
            transition: {
              duration: REDUCED_MOTION_DURATION,
            },
          }
          : {
            opacity: 0,
            y: `${(index - 1) * TOAST_OFFSET}%`,
            scale: 0.95,
            transition: {
              duration: TOAST_EXIT_DURATION,
              ease: TOAST_EASE_OUT,
            },
          }
      }
    >
      <article className="flex w-max max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-2xl bg-white px-3.5 pt-2.5 pb-3 font-sans shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
        <span
          className="toast-card__title text-(--accent)"
          style={titleColor ? { color: titleColor } : undefined}
        >
          {title}
        </span>
        {description ? (
          <span className="toast-card__description text-zinc-500">{description}</span>
        ) : null}
      </article>
    </m.div>
  );
}
