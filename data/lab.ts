import type { ComponentType } from "react";
import { FeedbackComponent } from "@/components/feedback/FeedbackComponent";
import { HoldToDeleteButton } from "@/components/hold-to-delete/HoldToDeleteButton";
import { PanelDemo } from "@/components/panel/PanelDemo";
import { TabsDemo } from "@/components/tabs/TabsDemo";
import { ToastStack } from "@/components/toast/ToastStack";

export const labItems = [
  {
    slug: "feedback",
    title: "Feedback",
    description: "A compact feedback flow with clear interaction states.",
    Demo: FeedbackComponent,
  },
  {
    slug: "toast-stack",
    title: "Toast stack",
    description: "Stacked notifications that communicate temporary feedback.",
    Demo: ToastStack,
  },
  {
    slug: "hold-to-delete",
    title: "Hold to delete",
    description: "A deliberate destructive action with visible progress.",
    Demo: HoldToDeleteButton,
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "A tablist built from the existing Tabs and Button primitives.",
    Demo: TabsDemo,
  },
  {
    slug: "panel",
    title: "Panel",
    description: "A preview panel that reveals on hover and keyboard focus.",
    Demo: PanelDemo,
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  title: string;
  description: string;
  Demo: ComponentType;
}>;

export type LabItem = (typeof labItems)[number];
export type LabSlug = LabItem["slug"];

export function findLabItem(slug: string) {
  return labItems.find((item) => item.slug === slug);
}
