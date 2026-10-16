"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { annotate } from "rough-notation";
import type { BracketType } from "rough-notation/lib/model";
import { useAnnotationGroup } from "./AnnotationGroup";
import { revealAnnotations } from "./revealAnnotations";
import { useInkShow } from "./InkShow";

type AnnotationProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  type?: "underline" | "box" | "circle" | "highlight" | "bracket";
  color?: string;
  padding?: number;
  as?: "span" | "div";
  animate?: boolean;
  multiline?: boolean;
  animationDuration?: number;
  iterations?: number;
  brackets?: BracketType | BracketType[];
};

export function Annotation({
  children,
  className,
  style,
  type = "underline",
  color = "var(--annotation-ink)",
  animate = true,
  padding = 2,
  as = "span",
  multiline = false,
  animationDuration = 500,
  iterations,
  brackets,
}: AnnotationProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const group = useAnnotationGroup();
  const ink = useInkShow();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const annotation = annotate(element, {
      type,
      color,
      animate:
        animate &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      strokeWidth: 2,
      padding,
      animationDuration,
      multiline,
      brackets,
      iterations,
    });

    const svg =
      type === "highlight"
        ? element.previousElementSibling
        : element.nextElementSibling;
    if (svg instanceof SVGElement && svg.classList.contains("rough-annotation")) {
      svg.setAttribute("aria-hidden", "true");
      if (type === "highlight") svg.style.opacity = "0";
    }

    const entry = { element, annotation };
    const unregister = group
      ? group(entry)
      : ink?.register({ ...entry, type });
    if (!group && !ink) revealAnnotations([entry]);

    // rough-notation throttles resize updates by 400ms. Keep visible strokes
    // aligned with reflowing text, coalescing resize events into one frame.
    let resizeFrame: number | null = null;
    const handleResize = () => {
      if (resizeFrame !== null) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        // show() redraws an already visible annotation without replaying it.
        if (annotation.isShowing()) annotation.show();
      });
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      unregister?.();
      annotation.remove();
      delete element.dataset.annotated;
      element.style.removeProperty("--annotation-delay");
      element.style.removeProperty("--annotation-duration");
    };
  }, [
    as,
    type,
    color,
    animate,
    padding,
    multiline,
    animationDuration,
    iterations,
    brackets,
    group,
    ink,
  ]);

  if (as === "div") {
    return (
      <div
        ref={(node) => {
          elementRef.current = node;
        }}
        className={className}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <span
      ref={(node) => {
        elementRef.current = node;
      }}
      className={`inline ${className ?? ""}`}
      style={style}
    >
      {children}
    </span>
  );
}
