import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Highlight } from "@/components/best-practices/Highlight";
import { SectionIndex } from "@/components/SectionIndex";
import { contentPublished } from "@/data/content";
import { labItems } from "@/data/lab";

export const metadata: Metadata = {
  title: "Esperimenti",
  description: "Componenti e interazioni provati da soli, prima di portarli in un’interfaccia.",
};

export default function LabPage() {
  if (!contentPublished) {
    notFound();
  }

  return (
    <SectionIndex
      title="Esperimenti"
      lede={
        <>
          <Highlight>Componenti</Highlight> e <Highlight>interazioni</Highlight> che provo da soli, prima di portarli in un’interfaccia.
        </>
      }
      entries={labItems.map((item) => ({
        href: contentPublished ? `/lab/${item.slug}` : undefined,
        title: item.title,
        description: item.description,
      }))}
    />
  );
}
