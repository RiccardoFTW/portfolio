import { m } from "motion/react";
import type { Ref } from "react";

type FeedbackButtonProps = {
  onClick: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

export function FeedbackButton({ onClick, buttonRef }: FeedbackButtonProps) {
  return (
    <m.button
      type="button"
      ref={buttonRef}
      onClick={onClick}
      layoutId="feedback-popover"
      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#e9e9e7] bg-white px-5 font-sans text-lg leading-6 font-medium text-article-accent outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <m.span layoutId="feedback-label">Feedback</m.span>
    </m.button>
  );
}
