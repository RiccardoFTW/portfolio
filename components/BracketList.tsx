"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { Annotation } from "@/components/Annotation";
import { pageArrowClass, pageBodyClass, pageLinkClass, pageTitleClass } from "@/components/pageStyle";

const SM_QUERY = "(min-width: 40rem)";

function subscribeToSm(onChange: () => void) {
  const query = window.matchMedia(SM_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsSm() {
  return useSyncExternalStore(
    subscribeToSm,
    () => window.matchMedia(SM_QUERY).matches,
    () => true,
  );
}

type BracketEntry = {
  href: string;
  title: string;
  description: string;
};

export function BracketList({ entries }: { entries: readonly BracketEntry[] }) {
  const isSm = useIsSm();

  return (
    <ul className="mt-16 flex max-w-[66ch] flex-col gap-14">
      {entries.map((entry) => (
        <li key={entry.href} className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Annotation
            type="bracket"
            as="div"
            brackets={isSm ? "right" : "top"}
            padding={8}
            className="shrink-0 sm:max-w-[28ch]"
          >
            <Link href={entry.href} className={`${pageLinkClass} ${pageTitleClass} px-1`}>
              {entry.title}
              <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
            </Link>
          </Annotation>
          <p className={`order-first sm:order-none sm:max-w-[24ch] ${pageBodyClass}`}>
            {entry.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
