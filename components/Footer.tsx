"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  createPortapenne,
  type PortapenneFigure,
} from "./best-practices/hairline/portapenne";
import styles from "./best-practices/hairline/ChapterIllustration.module.css";
import { Annotation } from "./Annotation";
import { useInkShow } from "./InkShow";

function BrandIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d={d} />
    </svg>
  );
}

const LINKS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: "https://github.com/USERNAME",
    icon: (
      <BrandIcon d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/USERNAME",
    icon: (
      <BrandIcon d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    label: "X",
    href: "https://x.com/USERNAME",
    icon: (
      <BrandIcon d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    ),
  },
];

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
    <footer className="mx-auto flex w-full flex-1 max-w-(--page-max-width) flex-col items-center px-(--page-padding-inline) pb-6 [--figure-h:min(11rem,30dvh)] sm:[--figure-h:min(15rem,30dvh)]">
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
        <Annotation type="bracket" as="div" brackets={isSm ? "right" : "top"}>
          <ul className="flex items-center gap-1">
            {LINKS.map(({ label, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                  className="grid size-10 place-items-center rounded-full text-text transition-[color,background-color,scale] duration-150 ease-out pointer-fine:hover:bg-inset pointer-fine:hover:text-foreground active:scale-[0.96] motion-reduce:transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </Annotation>
        <span className="order-first font-handwriting sm:absolute sm:top-1/2 sm:left-full sm:ml-4 sm:-translate-y-1/2 text-lg whitespace-nowrap text-accent">
          Let&apos;s connect!
        </span>
      </div>
    </footer>
  );
}
