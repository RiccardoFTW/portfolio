export type PortapenneFigure = {
  set(value: number): void;
  destroy(): void;
  /** Raise one tool and ignore the pointer, or `null` to settle back and listen again. */
  lift(name: string | null): void;
  /** Screen position of a tool's tip at its current height. */
  tip(name: string): { x: number; y: number } | null;
  /** Hide a tool while its tip is away drawing, then show it on the way back. */
  hide(name: string, hidden: boolean): void;
};

export function createPortapenne(
  stage: HTMLDivElement,
  svg: SVGSVGElement,
): PortapenneFigure;
