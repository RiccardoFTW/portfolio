"use client";

import { type KeyboardEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
} from "motion/react";

import { Button } from "@/components/Button";

const tabs = [
  { id: "about", label: "About" },
  { id: "components", label: "Components" },
  { id: "blog", label: "Blog" },
] as const;

export type TabId = (typeof tabs)[number]["id"];

type TabsProps = {
  value: TabId;
  onValueChange: (tab: TabId) => void;
  panelId: string;
};

export function Tabs({ value, onValueChange, panelId }: TabsProps) {
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });
  const hoveredTabRef = useRef<TabId | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const shouldFocusActiveTabRef = useRef(false);
  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const scaleX = useTransform(velocity, [-1200, 0, 1200], [1.8, 1, 1.8]);
  const blur = useTransform(velocity, [-1200, 0, 1200], [3, 0, 3]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const overlayContentX = useTransform(x, (latest) => -latest);

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeTabElement = activeTabRef.current;
    const visualTabElement = container?.querySelector<HTMLButtonElement>(
      `#tab-${hoveredTabRef.current ?? valueRef.current}`,
    );

    if (!container || !activeTabElement || !visualTabElement) return;

    const containerRect = container.getBoundingClientRect();
    const visualTabRect = visualTabElement.getBoundingClientRect();
    const nextIndicator = {
      x: visualTabRect.left - containerRect.left,
      width: visualTabRect.width,
    };

    setIndicator((currentIndicator) => {
      const isSamePosition = Math.abs(currentIndicator.x - nextIndicator.x) < 0.5;
      const isSameWidth = Math.abs(currentIndicator.width - nextIndicator.width) < 0.5;

      return isSamePosition && isSameWidth ? currentIndicator : nextIndicator;
    });
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateIndicator();

    if (shouldFocusActiveTabRef.current) {
      activeTabRef.current?.focus();
      shouldFocusActiveTabRef.current = false;
    }

    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [updateIndicator, value]);

  function previewTab(tab: TabId) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      hoveredTabRef.current = tab;
      updateIndicator();
    }
  }

  function clearPreview() {
    hoveredTabRef.current = null;
    updateIndicator();
  }

  function selectTab(tab: TabId, options?: { focus?: boolean }) {
    shouldFocusActiveTabRef.current = options?.focus ?? false;
    onValueChange(tab);

    if (options?.focus && tab === value) {
      activeTabRef.current?.focus();
      shouldFocusActiveTabRef.current = false;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const activeIndex = tabs.findIndex((tab) => tab.id === value);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab(tabs[(activeIndex + 1) % tabs.length].id, { focus: true });
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab(tabs[(activeIndex - 1 + tabs.length) % tabs.length].id, {
        focus: true,
      });
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectTab(tabs[0].id, { focus: true });
    }

    if (event.key === "End") {
      event.preventDefault();
      selectTab(tabs[tabs.length - 1].id, { focus: true });
    }
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex items-center" onPointerLeave={clearPreview}>
        <div
          aria-hidden="true"
          className="w-10 shrink-0 self-stretch min-h-11"
          onPointerEnter={() => previewTab(tabs[0].id)}
        />

        <div ref={containerRef} data-tabs-root className="relative w-fit shrink-0">
          <ul
            role="tablist"
            aria-label="Portfolio sections"
            onKeyDown={handleKeyDown}
            className="flex justify-center gap-1 rounded-[var(--radius-tabs)] bg-[var(--tabs-surface)] p-1 shadow-[var(--shadow-tabs)]"
          >
            {tabs.map((tab) => (
              <li key={tab.id} onPointerEnter={() => previewTab(tab.id)}>
                <Button
                  id={`tab-${tab.id}`}
                  controls={panelId}
                  label={tab.label}
                  isActive={value === tab.id}
                  onClick={() => selectTab(tab.id)}
                  buttonRef={value === tab.id ? activeTabRef : undefined}
                />
              </li>
            ))}
          </ul>

          <m.div
            data-tabs-overlay
            aria-hidden="true"
            initial={false}
            animate={{ x: indicator.x, width: indicator.width }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 34, mass: 0.8 }
            }
            style={{
              x,
              scaleX: shouldReduceMotion ? 1 : scaleX,
              filter: shouldReduceMotion ? "blur(0px)" : filter,
            }}
            className="pointer-events-none absolute inset-y-1 left-0 overflow-hidden rounded-[var(--radius-tab)] bg-[var(--accent)]"
          >
            <m.div
              className="flex w-max justify-center gap-1 pl-1"
              style={{ x: overlayContentX }}
            >
              {tabs.map((tab) => (
                <span key={tab.id}>
                  <Button label={tab.label} variant="overlay" as="span" />
                </span>
              ))}
            </m.div>
          </m.div>
        </div>

        <div
          aria-hidden="true"
          className="w-10 shrink-0 self-stretch min-h-11"
          onPointerEnter={() => previewTab(tabs[tabs.length - 1].id)}
        />
      </div>
    </LazyMotion>
  );
}
