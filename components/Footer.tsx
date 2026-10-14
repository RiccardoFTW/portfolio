"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  createPortapenne,
  type PortapenneFigure,
} from "./best-practices/hairline/portapenne";
import styles from "./best-practices/hairline/ChapterIllustration.module.css";
import { Annotation } from "./Annotation";
import { useInkShow } from "./InkShow";
import { ContactMenu } from "./ContactMenu";

const SM_QUERY = "(min-width: 40rem)";

function subscribeToSm(onChange: () => void) {
  const query = window.matchMedia(SM_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsSm() {
  return useSyncExternalStore(
    subscribeToSm,
    () => window.matchMedia(SM_QUERY).matches,
    () => true,
  );
}

export function Footer() {
  const isSm = useIsSm();
  const ink = useInkShow();
  const stageRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const figureRef = useRef<PortapenneFigure | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!stage || !svg) return;

    const figure = createPortapenne(stage, svg);
    figureRef.current = figure;
    return () => {
      figureRef.current = null;
      figure.destroy();
    };
  }, []);

  useEffect(() => {
    const figure = figureRef.current;
    if (!ink || !figure) return;
    ink.bind(figure);
    return () => ink.bind(null);
  }, [ink]);

  return (
    <footer className="mx-auto flex w-full flex-1 max-w-(--page-max-width) flex-col items-center px-(--page-padding-inline) pb-[calc(1.5rem+env(safe-area-inset-bottom))] [--figure-h:min(11rem,30dvh)] sm:[--figure-h:min(15rem,30dvh)]">
      {/* The figure leaves room above for a lifted tool, so its box overlaps what sits above and below it. */}
      <button
        type="button"
        ref={stageRef}
        data-hairline="portapenne"
        aria-label="Disegna le annotazioni"
        onClick={() => ink?.start()}
        className={`${styles.illustration} relative mt-4 -mb-[calc(var(--figure-h)*0.1)] aspect-[5/4] h-(--figure-h) cursor-pointer appearance-none border-0 bg-transparent p-0 text-inherit outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 400 320"
          className="absolute inset-0 size-full"
        />
      </button>
      <div className="relative mt-auto flex flex-col items-center gap-3 pt-10 sm:block sm:pt-0.5 translate-1">
        <ContactMenu />
      </div>
    </footer>
  );
}
