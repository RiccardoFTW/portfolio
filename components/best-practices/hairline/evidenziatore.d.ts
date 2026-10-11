export type EvidenziatoreFigure = {
  set(value: number): void;
  destroy(): void;
  /** ViewBox point of the chisel at the current pitch. */
  nib(): [number, number];
};

export function createEvidenziatore(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
): EvidenziatoreFigure;
