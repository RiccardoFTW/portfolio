"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function TransitionText({ text }: { text: string }) {
  const [initialText] = useState(text);
  const elementRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || element.textContent === text) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = text;
      return;
    }

    const duration = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--text-swap-dur"),
    ) || 150;

    element.classList.add("is-exit");
    const timer = setTimeout(() => {
      element.textContent = text;
      element.classList.remove("is-exit");
      element.classList.add("is-enter-start");
      void element.offsetHeight;
      element.classList.remove("is-enter-start");
    }, duration);

    return () => {
      clearTimeout(timer);
      element.classList.remove("is-exit", "is-enter-start");
    };
  }, [text]);

  return (
    <span ref={elementRef} aria-hidden="true" className="t-text-swap">
      {initialText}
    </span>
  );
}
