import type { Metadata } from "next";
import { Highlight } from "@/components/best-practices/Highlight";
import { SectionIndex } from "@/components/SectionIndex";
import { bestPractices } from "@/data/best-practices";

export const metadata: Metadata = {
  title: "Best Practices",
  description: "Dettagli che tengono un’interfaccia allineata, leggibile e più piacevole da usare.",
};

export default function BestPracticesPage() {
  return (
    <SectionIndex
      title="Best Practices"
      lede={
        <>
          Qui raccolgo e approfondisco i <Highlight>principi di design</Highlight> e le{" "}
          <Highlight>buone pratiche</Highlight> che imparo lungo il mio percorso, spero siano utili anche a te.
        </>
      }
      entries={bestPractices.map((item) => ({
        href: `/best-practices/${item.slug}`,
        title: item.title,
        description: item.description,
      }))}
    />
  );
}
