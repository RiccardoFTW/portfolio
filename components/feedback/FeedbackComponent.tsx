"use client";

import { useEffect, useRef, useState } from "react";
import { domMax, LazyMotion, MotionConfig } from "motion/react";

import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackPopover } from "@/components/feedback/FeedbackPopover";

type FormState = "idle" | "loading" | "success";

const popoverTransition = {
  type: "spring",
  duration: 0.6,
  bounce: 0,
} as const;

export function FeedbackComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const containerRef = useRef<HTMLDivElement>(null);

  function handleSubmit() {
    if (!feedback.trim() || formState !== "idle") return;
    setFormState("loading");

    setTimeout(() => {
      setFormState("success");

      setTimeout(() => {
        setIsOpen(false);
        setFeedback("");
        setFormState("idle");
      }, 1500);
    }, 1200);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig transition={popoverTransition} reducedMotion="user">
        <div ref={containerRef}>
          {isOpen ? (
            <FeedbackPopover
              feedback={feedback}
              onFeedbackChange={setFeedback}
              onSubmit={handleSubmit}
              isLoading={formState === "loading"}
              isSuccess={formState === "success"}
            />
          ) : (
            <FeedbackButton onClick={() => setIsOpen(true)} />
          )}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
