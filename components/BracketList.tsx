"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Annotation } from "@/components/Annotation";

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
            <Link
              href={entry.href}
              className="inline-block px-1 font-sans text-lg leading-6 text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {entry.title}
            </Link>
          </Annotation>
          <p className="order-first font-handwriting text-lg leading-6 text-accent sm:order-none sm:max-w-[24ch]">
            {entry.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
