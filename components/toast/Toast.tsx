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
const REDUCED_MOTION_DURATION = 0.2;
const TOAST_EXIT_DURATION = 0.2;

function getStackTransform(index: number, scale: number) {
  return `translateY(${index * TOAST_OFFSET}%) scale(${scale})`
}

export function Toast({ index, reduceMotion, title, description, titleColor }: ToastProps) {
  return (
    <m.div
      className="absolute top-0 right-0 w-max max-w-[calc(100vw-2rem)]"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : {
            opacity: 0,
            transform: "translateY(-100%) scale(0.9)",
          }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : {
            opacity: 1,
            transform: getStackTransform(index, 1),
          }
      }
      transition={
        reduceMotion
          ? {
            opacity: {
              duration: REDUCED_MOTION_DURATION,
              ease: TOAST_EASE_OUT,
            },
          }
          : {
            opacity: {
              duration: TOAST_OPACITY_DURATION,
              ease: TOAST_EASE_OUT,
            },
            transform: TOAST_SPRING,
          }
      }
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
              transform: getStackTransform(index - 1, 0.95),
              transition: {
                opacity: {
                  duration: TOAST_EXIT_DURATION,
                  ease: TOAST_EASE_OUT,
                },
                transform: {
                  duration: TOAST_EXIT_DURATION,
                  ease: TOAST_EASE_OUT,
                },
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
