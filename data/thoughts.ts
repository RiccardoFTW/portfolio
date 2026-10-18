import type { ComponentType } from "react";

export type Thought = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  publishedLabel: string;
  readingTime: string;
  category: string;
  Component: ComponentType;
};

export const thoughts: readonly Thought[] = [];

export type ThoughtSlug = Thought["slug"];

export function findThought(slug: string) {
  return thoughts.find((thought) => thought.slug === slug);
}
