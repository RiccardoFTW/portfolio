"use client";

import { useId, useState } from "react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { DemoSurface } from "../article";

const easeOut = [0.23, 1, 0.32, 1] as const;
const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
};
const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

function getArcMotion(reduceMotion: boolean) {
    if (reduceMotion) {
        return {
            initial: false as const,
            outerArc: { duration: 0, delay: 0, ease: easeOut },
            outerLabel: { duration: 0, delay: 0 },
            innerArc: { duration: 0, delay: 0, ease: easeOut },
            innerLabel: { duration: 0, delay: 0 },
            gap: { duration: 0, delay: 0, ease: easeOut },
            gapLabel: { duration: 0, delay: 0 },
        };
    }

    return {
        initial: "hidden" as const,
        outerArc: { duration: 0.9, delay: 0.1, ease: easeOut },
        outerLabel: { duration: 0.2, delay: 0.85 },
        innerArc: { duration: 0.9, delay: 0.85, ease: easeOut },
        innerLabel: { duration: 0.2, delay: 1.6 },
        gap: { duration: 0.55, delay: 1.7, ease: easeOut },
        gapLabel: { duration: 0.2, delay: 2.1 },
    };
}

function ArcGuides() {
    return (
        <>
            <path
                d="M64 232V56"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
                strokeDasharray="4 5"
            />
            <path
                d="M64 232H240"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
                strokeDasharray="4 5"
            />
            <circle cx="64" cy="232" r="4" fill="var(--foreground)" />
            <text x="76" y="255" fill="var(--text)" fontSize="24">
                centro
            </text>
        </>
    );
}

export default function ConcentricArcs() {
    const [replayKey] = useState(0);
    const reduceMotion = Boolean(useReducedMotion());
    const titleId = useId();
    const descriptionId = useId();
    const motion = getArcMotion(reduceMotion);

    return (
        <LazyMotion features={domAnimation}>
            <DemoSurface as="figure" className="px-4 py-5">
                <m.svg
                    key={replayKey}
                    role="img"
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    viewBox="0 0 320 288"
                    className="mx-auto block h-auto w-full max-w-[340px] font-handwriting"
                    initial={motion.initial}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <title id={titleId}>Due quarti di cerchio con lo stesso centro</title>
                    <desc id={descriptionId}>
                        I raggi R e r hanno lo stesso centro. Il segmento blu g, sull&apos;asse verticale e su quello orizzontale, mostra la loro differenza: R meno r.
                    </desc>

                    <ArcGuides />

                    <m.path
                        d="M64 56A176 176 0 0 1 240 232"
                        fill="none"
                        stroke="var(--accent-ink)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        variants={draw}
                        transition={motion.outerArc}
                    />
                    <m.text
                        x="250"
                        y="234"
                        fill="var(--accent-ink)"
                        fontSize="24"
                        fontWeight="600"
                        variants={fade}
                        transition={motion.outerLabel}
                    >
                        R
                    </m.text>

                    <m.path
                        d="M64 112A120 120 0 0 1 184 232"
                        fill="none"
                        stroke="var(--foreground)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        variants={draw}
                        transition={motion.innerArc}
                    />
                    <m.text
                        x="194"
                        y="214"
                        fill="var(--foreground)"
                        fontSize="24"
                        fontWeight="600"
                        variants={fade}
                        transition={motion.innerLabel}
                    >
                        r
                    </m.text>

                    <m.path
                        d="M64 112V56"
                        fill="none"
                        stroke="var(--accent-ink)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        variants={draw}
                        transition={motion.gap}
                    />
                    <m.path
                        d="M184 232H240"
                        fill="none"
                        stroke="var(--accent-ink)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        variants={draw}
                        transition={motion.gap}
                    />
                    <m.text
                        x="77"
                        y="89"
                        fill="var(--accent-ink)"
                        fontSize="24"
                        fontWeight="600"
                        variants={fade}
                        transition={motion.gapLabel}
                    >
                        g
                    </m.text>
                </m.svg>
            </DemoSurface>
        </LazyMotion>
    );
}
