import { m } from "motion/react";

type FeedbackButtonProps = {
  onClick: () => void;
};

export function FeedbackButton({ onClick }: FeedbackButtonProps) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      layoutId="feedback-popover"
      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#e9e9e7] bg-white px-5 font-sans text-lg leading-6 font-medium text-article-accent"
    >
      <m.span layoutId="feedback-label">Feedback</m.span>
    </m.button>
  );
}
