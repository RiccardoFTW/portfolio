import type { ReactNode } from "react";
import { Annotation } from "@/components/Annotation";

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <Annotation
      type="highlight"
      color="var(--annotation-highlight)"
      className="px-0.5 transition-colors duration-[var(--annotation-duration)] delay-[var(--annotation-delay)] ease-[cubic-bezier(0.23,1,0.32,1)] data-[annotated=true]:text-stone-900 dark:data-[annotated=true]:text-stone-950 [&_code]:text-inherit"
      multiline
      animationDuration={350}
    >
      {children}
    </Annotation>
  );
}
