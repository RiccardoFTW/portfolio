"use client";

import { useEffect, useRef, useState } from "react";
import { domMax, LazyMotion, MotionConfig } from "motion/react";

import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackPopover } from "@/components/feedback/FeedbackPopover";

type FormState = "idle" | "loading" | "success";

const popoverTransition = {
  type: "spring",
  duration: 0.26,
  bounce: 0,
} as const;

export function FeedbackComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const containerRef = useRef<HTMLDivElement>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreFocusRef = useRef(false);

  function close() {
    restoreFocusRef.current = true;
    setIsOpen(false);
    setFormState("idle");
  }

  function handleSubmit() {
    if (!feedback.trim() || formState !== "idle") return;
    setFormState("loading");

    submitTimerRef.current = setTimeout(() => {
      setFormState("success");

      closeTimerRef.current = setTimeout(() => {
        close();
        setFeedback("");
      }, 1500);
    }, 1200);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        restoreFocusRef.current = true;
        setIsOpen(false);
        setFormState("idle");
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFormState("idle");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isOpen]);

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig transition={popoverTransition} reducedMotion="user">
        <div ref={containerRef} className="flex w-full justify-center">
          {isOpen ? (
            <FeedbackPopover
              feedback={feedback}
              onFeedbackChange={setFeedback}
              onSubmit={handleSubmit}
              isLoading={formState === "loading"}
              isSuccess={formState === "success"}
            />
          ) : (
            <FeedbackButton
              onClick={() => setIsOpen(true)}
              buttonRef={(element) => {
                if (element && restoreFocusRef.current) {
                  element.focus();
                  restoreFocusRef.current = false;
                }
              }}
            />
          )}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
