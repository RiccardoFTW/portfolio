function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        clipRule="evenodd"
        d="M6.75 2.75C6.75 2.06 7.31 1.5 8 1.5C8.69 1.5 9.25 2.06 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23 6.48 0 8 0C9.52 0 10.75 1.23 10.75 2.75V3H12.92H14.25H15V4.5H14.25H13.88L13.18 13.69C13.08 14.99 11.99 16 10.68 16H5.32C4.01 16 2.92 14.99 2.82 13.69L2.12 4.5H1.75H1V3H1.75H3.08H5.25ZM4.32 13.58L3.62 4.5H12.38L11.68 13.58C11.64 14.1 11.21 14.5 10.68 14.5H5.32C4.79 14.5 4.36 14.1 4.32 13.58Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

type ButtonContentProps = {
  className?: string;
};

function ButtonContent({ className }: ButtonContentProps) {
  return (
    <span className={className}>
      <TrashIcon />
      Hold to Delete
    </span>
  );
}

const contentClassName =
  "flex h-10 items-center gap-2 rounded-full px-6 text-sm font-medium";

export function HoldToDeleteButton() {
  return (
    <button
      type="button"
      aria-label="Hold to delete"
      className="hold-to-delete-btn rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--component-surface)]"
    >
      <ButtonContent
        className={`hold-to-delete-overlay ${contentClassName} pointer-events-none absolute inset-0 bg-[#ffdbdc] text-[#e5484d]`}
      />
      <ButtonContent className={`${contentClassName} bg-[#f6f5f5] text-[#21201c]`} />
    </button>
  );
}
