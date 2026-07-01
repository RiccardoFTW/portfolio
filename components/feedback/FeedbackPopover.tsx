import { AnimatePresence, m } from "motion/react";

import { Spinner } from "@/components/feedback/Spinner";

type FeedbackPopoverProps = {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSuccess: boolean;
};

const contentTransition = {
  duration: 0.2,
  ease: [0.23, 1, 0.32, 1],
} as const;

export function FeedbackPopover({
  feedback,
  onFeedbackChange,
  onSubmit,
  isLoading,
  isSuccess,
}: FeedbackPopoverProps) {
  return (
    <m.div
      layoutId="feedback-popover"
      className="relative h-48 w-[min(100%,364px)] overflow-hidden rounded-2xl bg-[#f5f6f7] p-1 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]"
    >
      <m.span
        aria-hidden="true"
        layoutId="feedback-label"
        animate={{ opacity: feedback ? 0 : 1 }}
        transition={{ opacity: { duration: 0.15 } }}
        className="pointer-events-none absolute left-4 top-4 z-10 text-sm text-zinc-400"
      >
        Feedback
      </m.span>
      <AnimatePresence initial={false} mode="popLayout">
        {isSuccess ? (
          <m.div
            key="success"
            initial={{
              transform: "translateY(-32px)",
              opacity: 0,
              filter: "blur(4px)",
            }}
            animate={{
              transform: "translateY(0px)",
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={contentTransition}
            className="flex h-full items-center justify-center"
          >
            <p className="text-sm font-medium">Feedback received. Thank you!</p>
          </m.div>
        ) : (
          <m.form
            key="form"
            transition={contentTransition}
            exit={{
              transform: "translateY(32px)",
              opacity: 0,
              filter: "blur(4px)",
            }}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            className="h-full rounded-lg border border-[#e6e7e8] bg-white"
          >
            <textarea
              aria-label="Feedback"
              value={feedback}
              onChange={(event) => onFeedbackChange(event.target.value)}
              onKeyDown={(event) => {
                const isSubmitShortcut =
                  (event.metaKey || event.ctrlKey) && event.key === "Enter";

                if (isSubmitShortcut) {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              className="h-32 w-full resize-none rounded-t-lg p-3 text-sm outline-none"
            />
            <div className="flex h-12 items-center border-t border-dashed border-[#e6e7e8] px-2.5">
              <button
                type="submit"
                disabled={isLoading || feedback.trim().length === 0}
                className="relative ml-auto inline-flex h-6 w-[104px] items-center justify-center overflow-hidden rounded-md bg-(--accent) text-xs font-medium text-white"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <m.span
                    key={isLoading ? "loading" : "idle"}
                    initial={{
                      transform: "translateY(4px)",
                      opacity: 0,
                      filter: "blur(2px)",
                    }}
                    animate={{
                      transform: "translateY(0px)",
                      opacity: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      transform: "translateY(-4px)",
                      opacity: 0,
                      filter: "blur(2px)",
                    }}
                    transition={{
                      duration: 0.15,
                      ease: [0.77, 0, 0.175, 1],
                    }}
                    className="inline-flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        <span className="sr-only">Sending feedback</span>
                      </>
                    ) : (
                      "Send Feedback"
                    )}
                  </m.span>
                </AnimatePresence>
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </m.div>
  );
}
