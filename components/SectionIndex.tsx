import type { ReactNode } from "react";
import { SectionList } from "@/components/SectionList";
import { PageFrame } from "@/components/PageFrame";
import { pageBodyClass, pageTitleClass } from "@/components/pageStyle";

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
    <PageFrame>
      <h1 className={`mt-20 ${pageTitleClass}`}>{title}</h1>
      <p className={`mt-4 max-w-[66ch] text-pretty ${pageBodyClass}`}>{lede}</p>
      <SectionList entries={entries} />
    </PageFrame>
  );
}
