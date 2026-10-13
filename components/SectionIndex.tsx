import Link from "next/link";
import type { ReactNode } from "react";
import { BracketList } from "@/components/BracketList";

type SectionEntry = {
  href: string;
  title: string;
  description: string;
};

export function SectionIndex({
  title,
  lede,
  entries,
}: {
  title: string;
  lede: ReactNode;
  entries: readonly SectionEntry[];
}) {
  return (
    <main className="bg-background text-text">
      <section className="mx-auto w-full max-w-(--page-max-width) px-(--page-padding-inline) pt-16 pb-20">
        <hgroup className="flex flex-col tracking-[-0.5]">
          <Link
            href="/"
            className="font-sans text-lg leading-6 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
          >
            Riccardo Ventura
          </Link>
          <p className="text-body">Design Engineer</p>
        </hgroup>

        <h1 className="mt-20 font-sans text-lg leading-6 text-foreground">{title}</h1>
        <p className="mt-4 max-w-[66ch] font-sans leading-6 text-pretty">{lede}</p>

        <BracketList entries={entries} />
      </section>
    </main>
  );
}
