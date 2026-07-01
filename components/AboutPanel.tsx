"use client";

import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";

type PaletteSwatchProps = {
  label: string;
  token: `--palette-${1 | 2 | 3}`;
  value: string;
};

const contactLinks = {
  linkedin: "https://www.linkedin.com/in/riccardo-ventura/",
  x: "https://x.com/RickyyDev",
  github: "https://github.com/RiccardoFTW",
  email: "mailto:r.ventura.dev@gmail.com",
};

const contactLinkClassName =
  "rounded-sm text-[var(--accent)] underline decoration-[0.08em] underline-offset-[0.18em] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]";

const ABOUT_EASE = [0.23, 1, 0.32, 1] as const;

const paragraphContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

function PaletteSwatch({ label, token, value }: PaletteSwatchProps) {
  return (
    <li
      aria-label={`${label}: ${value}`}
      className="group relative inline-flex size-3 rounded-full"
      style={{ backgroundColor: `var(${token})` }}
    >
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-0.5 whitespace-nowrap rounded-2xl bg-(--accent) px-2 py-1 font-mono text-[10px] leading-none font-normal tracking-normal text-white opacity-0 shadow-sm transition-[opacity,transform] duration-125 ease-(--ease-out-cubic) pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
      >
        {value}
      </span>
    </li>
  );
}

export function AboutPanel() {
  const shouldReduceMotion = useReducedMotion();

  const paragraphVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.48,
        ease: ABOUT_EASE,
      },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        aria-label="About Riccardo"
        className="mx-auto w-full max-w-(--width-components) pt-16 pb-16"
      >
        <m.div
          className="space-y-5 text-pretty text-xl leading-[1.45] font-medium tracking-[-0.02em] text-foreground"
          initial="hidden"
          animate="visible"
          variants={paragraphContainerVariants}
        >
          <m.p variants={paragraphVariants}>
            Ciao! I’m <span className="text-(--accent)">Riccardo</span>, and I
            like building things, especially where design and technology meet. I
            enjoy turning rough ideas into clear, thoughtful experiences, moving
            between visual design, interaction, and code.
          </m.p>

          <m.p variants={paragraphVariants}>
            I design and develop interfaces and UI components, paying attention
            to structure, motion, accessibility, and all the small decisions that
            shape how a product feels. I’m particularly interested in that final
            layer of polish, the moment when something stops simply working and
            starts feeling right. I’m drawn to practical design and use animation
            deliberately, only when it clarifies an interaction, communicates
            change, or improves the experience.
          </m.p>

          <m.p variants={paragraphVariants}>
            This portfolio is a little different: an evolving puzzle of
            components, experiments, and small ideas that I use to explore how
            interfaces can look, feel, and behave.
          </m.p>

          <m.div
            variants={paragraphVariants}
            className="text-pretty text-xl leading-[1.45] font-medium tracking-[-0.02em] text-foreground"
          >
            As you may have noticed, my favorite color palette is{" "}
            <ul
              aria-label="Favorite color palette"
              className="ml-1 inline-flex list-none items-center gap-2 p-0 align-middle"
            >
              <PaletteSwatch
                label="Palette color one"
                token="--palette-1"
                value="oklch(0.277 0 0)"
              />
              <PaletteSwatch
                label="Palette color two"
                token="--palette-2"
                value="oklch(0.613 0 0)"
              />
              <PaletteSwatch
                label="Palette color three"
                token="--palette-3"
                value="oklch(0.656 0.19 250.834)"
              />
            </ul>
            .
          </m.div>

          <m.p variants={paragraphVariants}>
            Thanks for making it all the way to my little corner of the internet.
            You can also find me on{" "}
            <a
              href={contactLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className={contactLinkClassName}
            >
              LinkedIn
            </a>
            ,{" "}
            <a
              href={contactLinks.x}
              target="_blank"
              rel="noreferrer"
              className={contactLinkClassName}
            >
              X
            </a>
            , and{" "}
            <a
              href={contactLinks.github}
              target="_blank"
              rel="noreferrer"
              className={contactLinkClassName}
            >
              GitHub
            </a>
            , or send me an{" "}
            <a href={contactLinks.email} className={contactLinkClassName}>
              email
            </a>
            .
          </m.p>
        </m.div>
      </section>
    </LazyMotion>
  );
}
