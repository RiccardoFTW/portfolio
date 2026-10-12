"use client";

import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import { Annotation } from "@/components/Annotation";

function mix(seed: string, salt: number) {
  let hash = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function markerStyle(seed: string): CSSProperties {
  const top = 0.12 + mix(seed, 2) * 0.1;
  const right = 0.2 + mix(seed, 3) * 0.14;
  const bottom = 0.1 + mix(seed, 4) * 0.08;
  const left = 0.16 + mix(seed, 5) * 0.14;
  const radiusA = 0.35 + mix(seed, 6) * 0.25;
  const radiusB = 0.2 + mix(seed, 7) * 0.25;
  const angle = 82 + mix(seed, 1) * 12;

  return {
    "--color": "var(--annotation-highlight)",
    "--marker-margin": `-${top}em -${right}em -${bottom}em -${left}em`,
    "--marker-padding": `${top}em ${right}em ${bottom}em ${left}em`,
    "--marker-radius": `${radiusA}em ${radiusB}em`,
    "--marker-image": `linear-gradient(${angle}deg, color-mix(in srgb, var(--color), transparent 40%), color-mix(in srgb, var(--color), transparent 62%) 6%, color-mix(in srgb, var(--color), transparent 48%) 94%, color-mix(in srgb, var(--color), transparent 22%))`,
  } as CSSProperties;
}

export function Highlight({ children }: { children: ReactNode }) {
  const id = useId();
  const style = useMemo(() => markerStyle(id), [id]);

  return (
    <Annotation
      type="highlight"
      color="var(--annotation-highlight)"
      className="ink-marker"
      style={style}
      multiline
      animationDuration={350}
    >
      {children}
    </Annotation>
  );
}
