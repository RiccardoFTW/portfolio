import { annotationGroup } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

export type AnnotationEntry = {
  element: HTMLElement;
  annotation: RoughAnnotation;
};

/** Reveal annotations in document order; sync CSS vars for text-color transitions. */
export function revealAnnotations(entries: AnnotationEntry[]) {
  let delay = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (const { element, annotation } of entries) {
    if (reduceMotion || !annotation.animate) {
      annotation.animate = false;
      annotation.animationDuration = 0;
    }

    const duration = annotation.animationDuration ?? 500;
    element.style.setProperty("--annotation-delay", `${delay}ms`);
    element.style.setProperty("--annotation-duration", `${duration}ms`);
    element.dataset.annotated = "true";
    delay += duration;
  }

  annotationGroup(entries.map(({ annotation }) => annotation)).show();
}
