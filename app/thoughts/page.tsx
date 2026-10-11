import type { Metadata } from "next";
import { SectionIndex } from "@/components/SectionIndex";
import { thoughts } from "@/data/thoughts";

export const metadata: Metadata = {
  title: "Riflessioni personali",
  description: "Note su quello che imparo mentre progetto e sviluppo interfacce.",
};

export default function ThoughtsPage() {
  return (
    <SectionIndex
      title="Riflessioni personali"
      lede="Note su quello che imparo mentre progetto e sviluppo interfacce."
      entries={thoughts.map((thought) => ({
        href: `/thoughts/${thought.slug}`,
        title: thought.title,
        description: thought.description,
      }))}
    />
  );
}
