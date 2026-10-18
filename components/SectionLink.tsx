"use client";

import Link from "next/link";
import type { ReactNode, SyntheticEvent } from "react";
import { contentPublished } from "@/data/content";
import { pageLinkClass } from "./pageStyle";

function preventNavigation(event: SyntheticEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  const className = `font-italic text-[19px]/6 ${pageLinkClass}`;

  if (!contentPublished) {
    return (
      <a
        href={href}
        aria-disabled="true"
        tabIndex={-1}
        draggable={false}
        onClick={preventNavigation}
        onAuxClick={preventNavigation}
        onContextMenu={preventNavigation}
        className={`${className} hover:opacity-100`}
      >
        {children}
      </a>
    );
  }

  return <Link href={href} className={className}>{children}</Link>;
}
