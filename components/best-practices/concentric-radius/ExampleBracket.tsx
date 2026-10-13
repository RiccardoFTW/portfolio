import type { ReactNode } from "react";
import { Annotation } from "@/components/Annotation";

export default function ExampleBracket({
    children,
    label,
    side,
    className = "",
}: {
    children: ReactNode;
    label: string;
    side: "left" | "right";
    className?: string;
}) {
    return (
        <figure className={`relative ${className}`}>
            <figcaption
                className={`absolute bottom-full mb-3 whitespace-nowrap font-handwriting text-2xl leading-tight text-accent-ink lg:bottom-auto lg:top-1/2 lg:mb-0 lg:-translate-y-1/2 ${side === "left"
                    ? "left-0 lg:left-auto lg:right-full lg:mr-8"
                    : "right-0 lg:right-auto lg:left-full lg:ml-8"
                    }`}
            >
                {label}
            </figcaption>
            <Annotation as="div" type="bracket" brackets={side} color="var(--accent)" padding={5} animationDuration={350}>
                {children}
            </Annotation>
        </figure>
    );
}
