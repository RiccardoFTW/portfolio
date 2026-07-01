import type { Ref } from "react";

type ButtonProps = {
  id?: string;
  controls?: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "base" | "overlay";
  as?: "button" | "span";
  buttonRef?: Ref<HTMLButtonElement>;
};

export function Button({
  id,
  controls,
  label,
  isActive = false,
  onClick,
  variant = "base",
  as = "button",
  buttonRef,
}: ButtonProps) {
  const color = variant === "overlay" ? "text-white" : "text-[var(--text-secondary)]";
  const className = `flex h-9 items-center rounded-[var(--radius-tab)] px-3 text-[13px] font-medium ${color}`;

  if (as === "span") {
    return <span className={className}>{label}</span>;
  }

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      aria-controls={controls}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className={`${className} relative outline-none before:absolute before:top-1/2 before:left-1/2 before:h-11 before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-hover)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] pointer-fine:hover:text-[var(--text-primary)]`}
    >
      {label}
    </button>
  );
}
