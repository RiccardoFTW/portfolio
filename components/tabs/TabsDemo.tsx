"use client";

import { useState } from "react";

import { Tabs, type TabId } from "@/components/Tabs";

const tabContent: Record<TabId, string> = {
  about: "A small, accessible tablist. Arrow keys move between tabs and the selected tab remains the only stop in the tab order.",
  components: "The visible blue layer is a motion indicator. The Button primitive is reused twice: once for interaction and once for its visual overlay.",
  blog: "This is intentionally a compact demo: the component owns the navigation behavior, while this wrapper owns the selected content.",
};

export function TabsDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("about");

  return (
    <div className="flex w-full max-w-lg flex-col items-center">
      <Tabs value={activeTab} onValueChange={setActiveTab} panelId="tabs-demo-panel" />
      <section
        id="tabs-demo-panel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-6 w-full text-center text-body"
        role="tabpanel"
        tabIndex={0}
      >
        {tabContent[activeTab]}
      </section>
    </div>
  );
}
