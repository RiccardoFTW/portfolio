"use client";

import { useEffect, useState } from "react";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";

const easeOut = [0.23, 1, 0.32, 1] as const;

type ArticleNavProps = {
  sections: readonly { id: string; title: string }[];
};

export function ArticleNav({ sections }: ArticleNavProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <LazyMotion features={domAnimation}>
      <m.aside
        className="fixed top-24 left-6 z-10 hidden w-40 xl:block"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut, delay: 0.15 }}
      >
        <nav aria-label="Sezioni dell’articolo">
          <ul className="flex flex-col gap-2.5">
            {sections.map((section) => {
              const isActive = activeId === section.id;

              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`block rounded-sm text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink ${
                      isActive
                        ? "text-accent-ink"
                        : "text-text pointer-fine:hover:text-accent-ink"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {section.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </m.aside>
    </LazyMotion>
  );
}
