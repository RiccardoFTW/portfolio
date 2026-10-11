import type { ComponentType } from "react";
import ConcentricRadius from "@/components/best-practices/concentric-radius/ConcentricRadius";
import OpticalAlignment from "@/components/best-practices/OpticalAlignment/OpticalAlignment";

export const bestPractices = [
  {
    slug: "concentric-radius",
    title: "Concentric radius",
    description:
      "Come calcolare raggio interno e esterno così che i bordi restino concentrici.",
    sections: [
      { id: "concentric-radius-rule-title", title: "Il problema" },
      { id: "concentric-radius-solution-title", title: "La soluzione" },
      { id: "concentric-radius-why-title", title: "La formula" },
      { id: "concentric-radius-css-title", title: "Il codice" },
      { id: "concentric-radius-examples-title", title: "Esempi pratici" },
      { id: "concentric-radius-sources-title", title: "Per approfondire" },
    ],
    Component: ConcentricRadius,
  },
  {
    slug: "optical-alignment",
    title: "Optical alignment",
    description:
      "Correggere allineamenti che sono geometricamente giusti ma otticamente storti.",
    sections: [
      { id: "optical-alignment-button-title", title: "Il pulsante" },
      { id: "optical-alignment-sidebar-title", title: "La sidebar" },
      { id: "optical-alignment-practice-title", title: "Quando correggere" },
      { id: "optical-alignment-sources-title", title: "Per approfondire" },
    ],
    Component: OpticalAlignment,
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  title: string;
  description: string;
  sections: ReadonlyArray<{ id: string; title: string }>;
  Component: ComponentType;
}>;

export type BestPractice = (typeof bestPractices)[number];
export type BestPracticeSlug = BestPractice["slug"];
export type ArticleSection = BestPractice["sections"][number];

export function findBestPractice(slug: string) {
  return bestPractices.find((item) => item.slug === slug);
}
