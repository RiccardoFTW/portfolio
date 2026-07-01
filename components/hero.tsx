"use client";

import { useState } from "react";

import { AboutPanel } from "@/components/AboutPanel";
import { BlogPanel } from "@/components/BlogPanel";
import { ComponentsPanel } from "@/components/ComponentsPanel";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { Tabs, type TabId } from "@/components/Tabs";
import { ZdogFace } from "@/components/ZdogFace";

const tabTitles: Record<TabId, string> = {
  about: "About",
  components: "Components",
  blog: "Blog",
};

export function Hero() {
  const [activeTab, setActiveTab] = useState<TabId>("about");

  return (
    <main className="h-dvh min-h-dvh bg-background p-3 sm:p-6">
      <section
        className="mx-auto flex h-full w-full max-w-[692px] flex-col overflow-hidden rounded-(--radius-panel) bg-(--panel) shadow-(--shadow-panel)"
        aria-labelledby="portfolio-title"
      >
        <h1 id="portfolio-title" className="sr-only">
          Riccardo Ventura — Design Engineer
        </h1>

        <header className="flex shrink-0 items-center justify-between p-4">
          <div className="size-14" aria-hidden="true">
            <ZdogFace />
          </div>

          <h2 className="text-sm font-medium tracking-[-0.01em] text-foreground">
            {tabTitles[activeTab]}
          </h2>
        </header>

        <div className="relative min-h-0 flex-1">
          <div
            id="portfolio-tabpanel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="h-full overflow-y-auto overscroll-contain px-6 py-6 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            <div
              className={activeTab === "about" ? undefined : "hidden"}
              aria-hidden={activeTab !== "about"}
            >
              <AboutPanel />
            </div>
            {activeTab === "components" ? <ComponentsPanel /> : null}
            {activeTab === "blog" ? <BlogPanel /> : null}
          </div>

          <ProgressiveBlur edge="top" />
          <ProgressiveBlur edge="bottom" />
        </div>

        <footer className="flex shrink-0 justify-center px-6 pt-4 pb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            panelId="portfolio-tabpanel"
          />
        </footer>
      </section>
    </main>
  );
}
