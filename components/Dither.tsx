"use client";

import { Dithering } from "@paper-design/shaders-react";

const AVATAR_SIZE = 56;

export function Dither() {
  return (
    <div
      className="size-14 shrink-0 overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <Dithering
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        colorBack="#ffffff"
        colorFront="#0095ff"
        shape="sphere"
        type="8x8"
        size={1}
        speed={0.88}
        scale={0.58}
        fit="contain"
      />
    </div>
  );
}
