export function createTazzina(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
): {
  set(value: number): void;
  destroy(): void;
};
