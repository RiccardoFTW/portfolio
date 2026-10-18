export type TazzinaFrame = {
  /** Projects world x, y, z to viewBox units. */
  P(x: number, y: number, z: number): [number, number];
  /** The cup's slide along the screen's x axis, in world units. */
  offset: number;
  velocity: number;
  saucerZ: number;
  rimZ: number;
  rimR: number;
  innerR: number;
  footR: number;
  plateR: number;
  still: boolean;
};

export type TazzinaLiquid = {
  /** Returns true while it needs another frame. */
  frame(dt: number, frame: TazzinaFrame): boolean;
  bind(wake: () => void): void;
};

export function createTazzina(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
  liquid?: TazzinaLiquid,
): {
  set(value: number): void;
  destroy(): void;
};
