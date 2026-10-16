export type StilograficaFigure = {
  set(value: number): void;
  destroy(): void;
  /** ViewBox point of the tail, used to align the tool when docking. */
  base(): [number, number];
  /** ViewBox point of the nib at the current pitch. */
  nib(): [number, number];
};

export function createStilografica(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
): StilograficaFigure;
