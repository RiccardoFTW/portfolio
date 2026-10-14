"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Panel } from "@/components/Panel";
import { pageBodyClass, pageTitleClass } from "@/components/pageStyle";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PanelDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <button
        type="button"
        aria-describedby="panel-demo-hint"
        className={`flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-(--border) bg-white outline-none transition-colors focus-visible:border-article-accent focus-visible:text-article-accent pointer-fine:hover:border-article-accent pointer-fine:hover:text-article-accent ${pageTitleClass}`}
        onPointerEnter={() => setIsOpen(true)}
        onPointerLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        Hover or focus
      </button>
      <p id="panel-demo-hint" className={`text-center ${pageBodyClass}`}>
        The panel slides into the viewport from the bottom.
      </p>

      {isMounted
        ? createPortal(
            <div
              aria-hidden={!isOpen}
              className="pointer-events-none fixed inset-x-0 bottom-0 z-50 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4"
            >
              <Panel
                open={isOpen}
                title="Panel reveal"
                description="The panel enters the viewport without changing the page layout."
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
