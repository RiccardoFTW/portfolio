import type { ReactNode } from "react";

type IconSwapProps = {
  active: boolean;
  first: ReactNode;
  second: ReactNode;
};

export function IconSwap({ active, first, second }: IconSwapProps) {
  return (
    <span aria-hidden="true" className="t-icon-swap" data-state={active ? "b" : "a"}>
      <span className="t-icon" data-icon="a">{first}</span>
      <span className="t-icon" data-icon="b">{second}</span>
    </span>
  );
}
