"use client";

import type { ReactNode } from "react";
import { domAnimation, LazyMotion, m } from "motion/react";
import { pageAccentClass } from "@/components/pageStyle";

const easeOut = [0.23, 1, 0.32, 1] as const;
const ARROW_DURATION = 0.55;
const TIP_DELAY = 0.35;
const TIP_DURATION = 0.3;
const ASIDE_DELAY = TIP_DELAY + TIP_DURATION + 0.02;

type CalloutArrowProps = {
  children: ReactNode;
};

export function CalloutArrow({ children }: CalloutArrowProps) {
  return (
    <LazyMotion features={domAnimation}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 64 24"
        fill="none"
        className="pointer-events-none absolute left-full top-36 ml-8 hidden h-6 w-16 text-article-accent xl:block"
      >
        <m.path
          d="M 0 12 C 20 4, 42 20, 62 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 80px 0px 0px" }}
          transition={{
            pathLength: { duration: ARROW_DURATION, ease: easeOut },
            opacity: { duration: 0.2, ease: easeOut },
          }}
        />
        <m.path
          d="M 54 6 L 62 12 L 54 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 80px 0px 0px" }}
          transition={{
            pathLength: {
              duration: TIP_DURATION,
              ease: easeOut,
              delay: TIP_DELAY,
            },
            opacity: {
              duration: 0.15,
              ease: easeOut,
              delay: TIP_DELAY,
            },
          }}
        />
      </svg>

      <m.aside
        className={`mt-6 hidden xl:absolute xl:top-36 xl:left-full xl:ml-26 xl:mt-0 xl:block xl:w-48 ${pageAccentClass}`}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "0px 80px 0px 0px" }}
        transition={{
          duration: 0.4,
          ease: easeOut,
          delay: ASIDE_DELAY,
        }}
      >
        {children}
      </m.aside>
    </LazyMotion>
  );
}
