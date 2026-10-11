import type { Metadata } from "next";
import { SectionIndex } from "@/components/SectionIndex";
import { labItems } from "@/data/lab";

export const metadata: Metadata = {
  title: "Esperimenti",
  description: "Componenti e interazioni provati da soli, prima di portarli in un’interfaccia.",
};

export default function LabPage() {
  return (
    <SectionIndex
      title="Esperimenti"
      lede="Componenti e interazioni che provo da soli, prima di portarli in un’interfaccia."
      entries={labItems.map((item) => ({
        href: `/lab/${item.slug}`,
        title: item.title,
        description: item.description,
      }))}
    />
  );
}
