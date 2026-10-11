"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import { annotationGroup } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

export type AnnotationEntry = {
  element: HTMLElement;
  annotation: RoughAnnotation;
};

type RegisterAnnotation = (entry: AnnotationEntry) => () => void;

const AnnotationGroupContext = createContext<RegisterAnnotation | null>(null);

export function useAnnotationGroup() {
  return useContext(AnnotationGroupContext);
}

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

function documentOrder(a: AnnotationEntry, b: AnnotationEntry) {
  return a.element.compareDocumentPosition(b.element) &
    Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
}

export function AnnotationGroup({
  children,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  const entries = useRef(new Map<HTMLElement, AnnotationEntry>());
  const observer = useRef<IntersectionObserver | null>(null);

  const register = useCallback<RegisterAnnotation>((entry) => {
    entries.current.set(entry.element, entry);
    observer.current?.observe(entry.element);

    return () => {
      observer.current?.unobserve(entry.element);
      entries.current.delete(entry.element);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void document.fonts.ready.then(() => {
      if (cancelled) return;

      const visibilityObserver = new IntersectionObserver(
        (changes) => {
          const visible = changes
            .filter(
              (change) =>
                change.isIntersecting && change.intersectionRatio >= 0.25,
            )
            .map((change) => entries.current.get(change.target as HTMLElement))
            .filter((entry): entry is AnnotationEntry => entry !== undefined)
            .sort(documentOrder);

          if (!visible.length) return;

          for (const entry of visible) {
            visibilityObserver.unobserve(entry.element);
            entries.current.delete(entry.element);
          }

          revealAnnotations(visible);
        },
        { threshold: 0.25, rootMargin: "0px 0px -12% 0px" },
      );

      observer.current = visibilityObserver;
      for (const entry of entries.current.values()) {
        visibilityObserver.observe(entry.element);
      }
    });

    return () => {
      cancelled = true;
      observer.current?.disconnect();
      observer.current = null;
    };
  }, []);

  return (
    <AnnotationGroupContext.Provider value={register}>
      <section {...props}>{children}</section>
    </AnnotationGroupContext.Provider>
  );
}
