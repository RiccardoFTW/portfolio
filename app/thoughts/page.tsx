import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Highlight } from "@/components/best-practices/Highlight";
import { SectionIndex } from "@/components/SectionIndex";
import { contentPublished } from "@/data/content";
import { thoughts } from "@/data/thoughts";

export const metadata: Metadata = {
  title: "Riflessioni personali",
  description: "Note su quello che imparo mentre progetto e sviluppo interfacce.",
};

export default function ThoughtsPage() {
  if (!contentPublished) {
    notFound();
  }

  return (
    <SectionIndex
      title="Riflessioni personali"
      lede={
        <>
          Note su <Highlight>quello che imparo</Highlight> mentre <Highlight>progetto e sviluppo interfacce</Highlight>.
        </>
      }
      entries={thoughts.map((thought) => ({
        href: contentPublished ? `/thoughts/${thought.slug}` : undefined,
        title: thought.title,
        description: thought.description,
      }))}
    />
  );
}
