export type PistaFrame = {
  /** Projects world x, y, z to viewBox units. */
  P(x: number, y: number, z: number): [number, number];
  straight: number;
  radius: number;
  lanes: number;
  gap: number;
  still: boolean;
};

export type PistaRunners = {
  /** Returns true while it needs another frame. */
  frame(dt: number, frame: PistaFrame): boolean;
  bind(wake: () => void): void;
};

export function createPista(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
  runners?: PistaRunners,
): {
  set(value: number): void;
  destroy(): void;
};
