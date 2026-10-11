export function createPista(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
): {
  set(value: number): void;
  destroy(): void;
};
