import type { ComponentType } from "react";
import { ButtonThought } from "@/components/thoughts/ButtonThought";

export const thoughts = [
  {
    slug: "button",
    title: "Un button non è solo un rettangolo che puoi cliccare",
    description:
      "Una mini guida per progettare un’azione chiara, gestirne gli stati e scrivere codice accessibile.",
    publishedAt: "2026-08-08",
    publishedLabel: "8 agosto 2026",
    readingTime: "4 min di lettura",
    category: "Componenti",
    Component: ButtonThought,
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  publishedLabel: string;
  readingTime: string;
  category: string;
  Component: ComponentType;
}>;

export type Thought = (typeof thoughts)[number];
export type ThoughtSlug = Thought["slug"];

export function findThought(slug: string) {
  return thoughts.find((thought) => thought.slug === slug);
}
