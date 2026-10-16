import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Annotation } from "@/components/Annotation";
import { pageArrowClass, pageBodyClass, pageLinkClass, pageTitleClass } from "@/components/pageStyle";

type SectionListEntry = {
  href?: string;
  title: string;
  description: string;
};

export function SectionList({ entries }: { entries: readonly SectionListEntry[] }) {
  return (
    <ul className="mt-16 flex max-w-[66ch] flex-col gap-14">
      {entries.map((entry) => (
        <li key={entry.href ?? entry.title} className="flex flex-col items-start gap-1.5">
          <h2 className={pageTitleClass}>
            {entry.href ? (
              <Link href={entry.href} className={pageLinkClass}>
                {entry.title}
                <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
              </Link>
            ) : (
              entry.title
            )}
          </h2>
          <p className={pageBodyClass}>
            <Annotation type="underline" multiline>
              {entry.description}
            </Annotation>
          </p>
        </li>
      ))}
    </ul>
  );
}
