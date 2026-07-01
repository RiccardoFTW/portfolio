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
      className="inline-flex h-9 items-center justify-center rounded-2xl border border-[#e9e9e7] bg-white px-3 text-sm text-(--accent) font-medium"
    >
      <m.span layoutId="feedback-label">Feedback</m.span>
    </m.button>
  );
}
