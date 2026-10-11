"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, LazyMotion, domMax, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

export type CodeExample = {
  label: string;
  code: string;
};

const CODE_LINE_HEIGHT = 22;
const CODE_VERTICAL_PADDING = 32;

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type CodeExamplesProps = {
  examples: readonly CodeExample[];
  className?: string;
  ariaLabel?: string;
};

export default function CodeExamples({
  examples,
  className,
  ariaLabel = "Esempi di codice",
}: CodeExamplesProps) {
  if (examples.length === 0) {
    throw new Error("CodeExamples richiede almeno un esempio.");
  }

  const id = useId();
  const reduceMotion = Boolean(useReducedMotion());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentExample = examples[selectedIndex];
  const currentCode = currentExample.code.trim();
  const panelHeight =
    currentCode.split("\n").length * CODE_LINE_HEIGHT + CODE_VERTICAL_PADDING;

  const selectExample = (index: number) => setSelectedIndex(index);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (selectedIndex + 1) % examples.length;
    else if (event.key === "ArrowLeft") {
      nextIndex = (selectedIndex - 1 + examples.length) % examples.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = examples.length - 1;

    if (nextIndex === undefined) return;

    event.preventDefault();
    selectExample(nextIndex);
    tabs.current[nextIndex]?.focus();
  };

  return (
    <LazyMotion features={domMax}>
      <div
        className={classNames(
          "w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-card",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border p-2">
          <div
            role="tablist"
            aria-label={ariaLabel}
            onKeyDown={handleTabKeyDown}
            className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {examples.map((example, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={example.label}
                  ref={(element) => {
                    tabs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${index}`}
                  aria-selected={isSelected}
                  aria-controls={`${id}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectExample(index)}
                  className={classNames(
                    "relative h-9 shrink-0 touch-manipulation rounded-lg px-3 text-sm font-medium outline-hidden select-none",
                    "transition-[scale,color] duration-150 ease-out active:scale-[0.96] motion-reduce:transition-[color]",
                    "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-foreground",
                    isSelected ? "text-foreground" : "text-text hover:text-foreground",
                  )}
                >
                  {isSelected && (
                    <m.span
                      layoutId={`${id}-active-tab`}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", visualDuration: 0.25, bounce: 0.1 }
                      }
                      className="absolute inset-0 rounded-lg bg-inset"
                    />
                  )}
                  <span className="relative">{example.label}</span>
                </button>
              );
            })}
          </div>
          <CopyCode value={currentCode} />
        </div>

        <m.div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${selectedIndex}`}
          tabIndex={0}
          layout
          initial={false}
          style={{ height: panelHeight }}
          transition={{
            layout: {
              duration: reduceMotion ? 0 : 0.28,
              ease: [0.23, 1, 0.32, 1],
            },
          }}
          className="overflow-x-auto overflow-y-clip [scrollbar-width:none] [&::-webkit-scrollbar]:hidden outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-foreground"
        >
          <m.div
            layout
            className="relative"
            style={{ height: panelHeight }}
            transition={{
              layout: {
                duration: reduceMotion ? 0 : 0.28,
                ease: [0.23, 1, 0.32, 1],
              },
            }}
          >
            <AnimatePresence initial={false}>
              <m.pre
                key={selectedIndex}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 3 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: reduceMotion ? 0.12 : 0.18,
                    ease: "easeOut",
                  },
                }}
                exit={{
                  opacity: 0,
                  y: reduceMotion ? 0 : -2,
                  transition: {
                    duration: reduceMotion ? 0.1 : 0.12,
                    ease: "easeOut",
                  },
                }}
                className="absolute top-0 left-0 m-0 w-max min-w-full px-4 py-4 font-mono text-[13px] leading-[22px] text-foreground"
              >
                <code>{currentCode}</code>
              </m.pre>
            </AnimatePresence>
          </m.div>
        </m.div>
      </div>
    </LazyMotion>
  );
}

function CopyCode({ value }: { value: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const attempt = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const showStatus = (nextStatus: "copied" | "failed") => {
    setStatus(nextStatus);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1600);
  };

  const copy = async () => {
    const currentAttempt = ++attempt.current;
    showStatus("copied");

    try {
      if (!navigator.clipboard) throw new Error("Clipboard non disponibile");
      await navigator.clipboard.writeText(value);
    } catch {
      if (currentAttempt === attempt.current) showStatus("failed");
    }
  };

  const copied = status === "copied";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Codice copiato" : "Copia il codice di questo esempio"}
        className="relative grid size-9 shrink-0 touch-manipulation place-items-center rounded-lg text-text outline-hidden hover:text-foreground transition-[scale,color] duration-150 ease-out active:scale-[0.96] motion-reduce:transition-[color] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-foreground"
      >
        <AnimatePresence initial={false}>
          <m.svg
            key={copied ? "check" : "copy"}
            initial={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.25,
              filter: reduceMotion ? "none" : "blur(4px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.25,
              filter: reduceMotion ? "none" : "blur(4px)",
            }}
            transition={
              reduceMotion
                ? { duration: 0.15, ease: "easeOut" }
                : { type: "spring", visualDuration: 0.3, bounce: 0 }
            }
            viewBox="0 0 16 16"
            className="col-start-1 row-start-1 size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {copied ? (
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
            ) : (
              <>
                <rect x="5.25" y="5.25" width="8" height="8" rx="1.75" />
                <path d="M10.75 5.25V4a1.25 1.25 0 0 0-1.25-1.25H4A1.25 1.25 0 0 0 2.75 4v5.5A1.25 1.25 0 0 0 4 10.75h1.25" />
              </>
            )}
          </m.svg>
        </AnimatePresence>
      </button>
      <span role="status" className="sr-only">
        {status === "copied"
          ? "Codice copiato"
          : status === "failed"
            ? "Impossibile copiare il codice"
            : ""}
      </span>
    </>
  );
}
