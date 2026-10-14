import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { pageTitleClass } from "@/components/pageStyle";

export function PageFrame({
  children,
  home = false,
}: {
  children: ReactNode;
  home?: boolean;
}) {
  const name = "Riccardo Ventura";

  return (
    <>
      <main className="bg-background text-text">
        <section className="mx-auto w-full max-w-(--page-max-width) px-(--page-padding-inline) pt-16 pb-6 tracking-[-0.5]">
          <hgroup className="flex flex-col">
            {home ? (
              <h1 className={pageTitleClass}>{name}</h1>
            ) : (
              <Link
                href="/"
                className={`${pageTitleClass} rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink`}
              >
                {name}
              </Link>
            )}
            <p className="text-body">Design Engineer</p>
          </hgroup>
          {children}
        </section>
      </main>
      <Footer />
    </>
  );
}
