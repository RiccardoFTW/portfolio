"use client";

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import styles from "./ArticleNav.module.css";

const ROW_HEIGHT = 24;
const BASE_WIDTH = 12;
const PEAK_WIDTH = 20;
// Rows reached by the wave on each side of the pointer.
const FALLOFF = 2;

type ArticleNavProps = {
  sections: readonly { id: string; title: string }[];
};

function canHover(pointerType: string) {
  return (
    pointerType !== "touch" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function Marker({ index, center }: { index: number; center: MotionValue<number> }) {
  const scaleX = useTransform(center, (value) => {
    const proximity = Math.max(0, 1 - Math.abs(index - value) / FALLOFF);
    return (BASE_WIDTH + (PEAK_WIDTH - BASE_WIDTH) * proximity) / PEAK_WIDTH;
  });

  return (
    <motion.span
      aria-hidden="true"
      className={styles.marker}
      style={{ scaleX, originX: 0 }}
    />
  );
}

export function ArticleNav({ sections }: ArticleNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"pointer" | "keyboard">("pointer");
  const [pointerInside, setPointerInside] = useState(false);
  const reduceMotion = useReducedMotion();
  const center = useSpring(0, { stiffness: 400, damping: 30, mass: 0.5 });
  const previewId = inputMode === "keyboard" ? focusedId : hoveredId;
  const previewOpen = previewId !== null && previewId !== dismissedId;
  const activeIndex = Math.max(0, sections.findIndex(({ id }) => id === activeId));
  const emphasizedIndex = sections.findIndex(
    ({ id }) => id === (previewOpen ? previewId : activeId),
  );
  const instant = reduceMotion || inputMode === "keyboard";

  const previewIndex = sections.findIndex(({ id }) => id === previewId);
  const previewSection = sections[previewIndex];

  const moveCenter = (value: number) => {
    if (instant) center.jump(value);
    else center.set(value);
  };

  const showPointerPreview = (id: string, pointerType: string) => {
    if (!canHover(pointerType)) return;

    setInputMode("pointer");
    setHoveredId(id);
    setDismissedId(null);
  };

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (!canHover(event.pointerType)) return;

    const top = event.currentTarget.getBoundingClientRect().top;
    const row = (event.clientY - top) / ROW_HEIGHT - 0.5;
    setPointerInside(true);
    moveCenter(Math.min(sections.length - 1, Math.max(0, row)));
  };

  useEffect(() => {
    if (pointerInside && inputMode === "pointer") return;
    const target = emphasizedIndex === -1 ? activeIndex : emphasizedIndex;
    if (instant) center.jump(target);
    else center.set(target);
  }, [activeIndex, center, emphasizedIndex, inputMode, instant, pointerInside]);

  useEffect(() => {
    if (!previewOpen) return;

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDismissedId(previewId);
    };

    window.addEventListener("keydown", dismissOnEscape);
    return () => window.removeEventListener("keydown", dismissOnEscape);
  }, [previewId, previewOpen]);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.2;
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      let current = elements[0];

      for (const element of elements) {
        if (element.getBoundingClientRect().top <= readingLine) {
          current = element;
        }
      }

      setActiveId(atBottom ? elements[elements.length - 1].id : current.id);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <aside className="fixed top-1/2 left-6 z-10 hidden w-11 -translate-y-1/2 xl:block">
      <nav
        aria-label="Sezioni dell’articolo"
        className={styles.nav}
        data-input={inputMode}
        style={{ "--row-height": `${ROW_HEIGHT}px` } as CSSProperties}
        onPointerMove={followPointer}
        onPointerLeave={() => {
          setHoveredId(null);
          setPointerInside(false);
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Tab") setInputMode("keyboard");
        }}
      >
        <ul className="flex list-none flex-col">
          {sections.map((section, index) => {
            const isActive = activeId === section.id;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`${styles.link} flex w-11 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink`}
                  aria-current={isActive ? "location" : undefined}
                  onPointerEnter={(event) =>
                    showPointerPreview(section.id, event.pointerType)
                  }
                  onPointerMove={(event) => {
                    if (inputMode === "keyboard") {
                      showPointerPreview(section.id, event.pointerType);
                    }
                  }}
                  onFocus={(event) => {
                    setFocusedId(section.id);
                    if (event.currentTarget.matches(":focus-visible")) {
                      setInputMode("keyboard");
                    }
                    setDismissedId(null);
                  }}
                  onBlur={() => setFocusedId(null)}
                >
                  <Marker index={index} center={center} />
                  <span className="sr-only">{section.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
        {previewOpen && previewSection && (
          <div
            aria-hidden="true"
            className={styles.preview}
            data-input={inputMode}
            style={{ "--preview-index": previewIndex } as CSSProperties}
          >
            {previewSection.title}
          </div>
        )}
      </nav>
    </aside>
  );
}
