"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  createPortapenne,
  type PortapenneFigure,
} from "./best-practices/hairline/portapenne";
import styles from "./best-practices/hairline/ChapterIllustration.module.css";
import { AppThemeSwitcher } from "./theme";
import { useInkShow } from "./InkShow";
import { ContactMenu } from "./ContactMenu";

export function Footer() {
  const home = usePathname() === "/";
  const ink = useInkShow();
  const stageRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const figureRef = useRef<PortapenneFigure | null>(null);

  useEffect(() => {
    if (!home) return;
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!stage || !svg) return;

    const figure = createPortapenne(stage, svg);
    figureRef.current = figure;
    return () => {
      figureRef.current = null;
      figure.destroy();
    };
  }, [home]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!ink || !figure) return;
    ink.bind(figure);
    return () => ink.bind(null);
  }, [ink]);

  return (
    <footer className="mx-auto flex w-full flex-1 max-w-(--page-max-width) flex-col items-center gap-6 animate-enter [--stagger:2] px-(--page-padding-inline) pb-[calc(1.5rem+env(safe-area-inset-bottom))] [--figure-h:min(11rem,30dvh)] sm:[--figure-h:min(15rem,30dvh)]">
      {home ? (
        <button
          type="button"
          ref={stageRef}
          data-hairline="portapenne"
          aria-label="Disegna le annotazioni"
          onClick={() => ink?.start()}
          className={`${styles.illustration} relative mt-4 -mb-[calc(var(--figure-h)*0.1)] aspect-[5/4] h-(--figure-h) shrink-0 cursor-pointer appearance-none border-0 bg-transparent p-0 text-inherit outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 400 320"
            className="absolute inset-0 size-full"
          />
        </button>
      ) : null}
      <div className="relative mt-auto flex w-full items-center justify-between">
        <ContactMenu />
        <AppThemeSwitcher />
      </div>
    </footer>
  );
}
