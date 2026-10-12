import type { Metadata } from "next";
import { Highlight } from "@/components/best-practices/Highlight";
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
      lede={
        <>
          Note su <Highlight>quello che imparo</Highlight> mentre <Highlight>progetto e sviluppo interfacce</Highlight>.
        </>
      }
      entries={thoughts.map((thought) => ({
        href: `/thoughts/${thought.slug}`,
        title: thought.title,
        description: thought.description,
      }))}
    />
  );
}
