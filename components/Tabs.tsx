"use client";

import { type KeyboardEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  LazyMotion,
  animate,
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

const indicatorTransition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.8,
} as const;

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
  const shouldFocusActiveTabRef = useRef(false);
  const animateIndicatorRef = useRef(true);
  const x = useMotionValue(0);
  const widthMv = useMotionValue(0);
  const targetWidth = useMotionValue(0);
  const velocity = useVelocity(x);
  const scaleX = useTransform(velocity, [-1200, 0, 1200], [1.04, 1, 1.04]);
  const blur = useTransform(velocity, [-1200, 0, 1200], [3, 0, 3]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const widthScale = useTransform<number, number>([widthMv, targetWidth], ([current, target]) =>
    target > 0 ? current / target : 1,
  );
  const inverseWidthScale = useTransform(widthScale, (scale) => (scale > 0 ? 1 / scale : 1));
  const contentX = useTransform<number, number>([x, widthScale], ([position, scale]) =>
    scale > 0 ? -position / scale : 0,
  );

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeTabElement = activeTabRef.current;
    const visualTabElement = container?.querySelector<HTMLButtonElement>(
      `#tab-${hoveredTabRef.current ?? value}`,
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
  }, [value]);

  useLayoutEffect(() => {
    targetWidth.set(indicator.width);

    if (shouldReduceMotion || !animateIndicatorRef.current || widthMv.get() === 0) {
      x.jump(indicator.x);
      widthMv.jump(indicator.width);
      return;
    }

    const position = animate(x, indicator.x, indicatorTransition);
    const width = animate(widthMv, indicator.width, indicatorTransition);

    return () => {
      position.stop();
      width.stop();
    };
  }, [indicator.x, indicator.width, shouldReduceMotion, targetWidth, widthMv, x]);

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
      animateIndicatorRef.current = true;
      hoveredTabRef.current = tab;
      updateIndicator();
    }
  }

  function clearPreview() {
    hoveredTabRef.current = null;
    updateIndicator();
  }

  function selectTab(tab: TabId, options?: { focus?: boolean }) {
    animateIndicatorRef.current = !options?.focus;
    hoveredTabRef.current = null;
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
          className="w-10 shrink-0 self-stretch min-h-13"
          onPointerEnter={() => previewTab(tabs[0].id)}
        />

        <div ref={containerRef} data-tabs-root className="relative w-fit shrink-0">
          <ul
            role="tablist"
            aria-label="Portfolio sections"
            onKeyDown={handleKeyDown}
            className="flex justify-center gap-1 rounded-(--radius-tabs) bg-muted p-1 shadow-(--shadow-tabs)"
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
            style={{
              x,
              scaleX: shouldReduceMotion ? 1 : scaleX,
              filter: shouldReduceMotion ? "blur(0px)" : filter,
            }}
            className="pointer-events-none absolute inset-y-1 left-0"
          >
            <m.div
              style={{
                width: indicator.width,
                scaleX: shouldReduceMotion ? 1 : widthScale,
                originX: 0,
              }}
              className="h-full overflow-hidden rounded-(--radius-tab) bg-article-accent"
            >
              <m.div
                className="flex w-max justify-center gap-1 pl-1"
                style={{
                  x: contentX,
                  scaleX: shouldReduceMotion ? 1 : inverseWidthScale,
                  originX: 0,
                }}
              >
                {tabs.map((tab) => (
                  <span key={tab.id}>
                    <Button label={tab.label} variant="overlay" as="span" />
                  </span>
                ))}
              </m.div>
            </m.div>
          </m.div>
        </div>

        <div
          aria-hidden="true"
          className="w-10 shrink-0 self-stretch min-h-13"
          onPointerEnter={() => previewTab(tabs[tabs.length - 1].id)}
        />
      </div>
    </LazyMotion>
  );
}
