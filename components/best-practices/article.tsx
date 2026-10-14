import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Annotation } from "@/components/Annotation";
import { pageBodyClass, pageTitleClass } from "@/components/pageStyle";

const surface =
  "bg-black/[0.03] shadow-[0_0_0_1px_oklch(0_0_0/0.06)] dark:bg-white/[0.03] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]";

const headingClass = `relative ${pageTitleClass}`;

const proseClass = `relative ${pageBodyClass}`;

const sourceLinkClass =
  "rounded-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Measure({ children }: { children: ReactNode }) {
  return (
    <code className="font-sans text-lg leading-6 font-medium tabular-nums text-foreground">
      {children}
    </code>
  );
}

export function Symbol({ children }: { children: ReactNode }) {
  return (
    <strong className="font-medium text-foreground">
      {children}
    </strong>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cx(proseClass, className)}>{children}</p>;
}

export function ArticleTitle({
  id,
  readingMinutes,
  children,
}: {
  id: string;
  readingMinutes: number;
  children: ReactNode;
}) {
  const label = `${readingMinutes}'`;

  return (
    <div className="flex items-baseline justify-between pt-16">
      <h1 id={id} className={headingClass}>
        {children}
      </h1>
      <p className="flex items-center gap-1.5 font-sans text-lg leading-6 tabular-nums text-text">
        <span className="grid place-items-center">
          <span className="invisible col-start-1 row-start-1" aria-hidden="true">
            {label}
          </span>
          <span
            className="invisible col-start-1 row-start-1 size-3.75"
            aria-hidden="true"
          />
          <span className="col-start-1 row-start-1">{label}</span>
        </span>
        <span className="grid place-items-center">
          <span className="invisible col-start-1 row-start-1" aria-hidden="true">
            {label}
          </span>
          <span
            className="invisible col-start-1 row-start-1 size-3.75"
            aria-hidden="true"
          />
          <svg
            aria-hidden="true"
            className="col-start-1 row-start-1 size-3.75 shrink-0"
            viewBox="0 0 15 15"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.49998 0.5C5.49998 0.223858 5.72383 0 5.99998 0H7.49998H8.99998C9.27612 0 9.49998 0.223858 9.49998 0.5C9.49998 0.776142 9.27612 1 8.99998 1H7.99998V2.11922C9.09832 2.20409 10.119 2.56622 10.992 3.13572C11.0116 3.10851 11.0336 3.08252 11.058 3.05806L11.858 2.25806C12.1021 2.01398 12.4978 2.01398 12.7419 2.25806C12.986 2.50214 12.986 2.89786 12.7419 3.14194L11.967 3.91682C13.1595 5.07925 13.9 6.70314 13.9 8.49998C13.9 12.0346 11.0346 14.9 7.49998 14.9C3.96535 14.9 1.09998 12.0346 1.09998 8.49998C1.09998 5.13362 3.69904 2.3743 6.99998 2.11922V1H5.99998C5.72383 1 5.49998 0.776142 5.49998 0.5ZM2.09998 8.49998C2.09998 5.51764 4.51764 3.09998 7.49998 3.09998C10.4823 3.09998 12.9 5.51764 12.9 8.49998C12.9 11.4823 10.4823 13.9 7.49998 13.9C4.51764 13.9 2.09998 11.4823 2.09998 8.49998ZM7.99998 4.5C7.99998 4.22386 7.77612 4 7.49998 4C7.22383 4 6.99998 4.22386 6.99998 4.5V9.5C6.99998 9.77614 7.22383 10 7.49998 10C7.77612 10 7.99998 9.77614 7.99998 9.5V4.5Z"
            />
          </svg>
        </span>
      </p>
    </div>
  );
}

export function ArticleHeading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className={cx(headingClass, "scroll-mt-24 pb-2 pt-16")}>
      <Annotation animationDuration={250}>{children}</Annotation>
    </h2>
  );
}

export function FormulaCallout({ children }: { children: ReactNode }) {
  return (
    <p className={`relative p-6 text-center ${pageTitleClass}`}>
      <Annotation type="box" padding={6} animationDuration={350}>
        {children}
      </Annotation>
    </p>
  );
}

type DemoSurfaceProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function DemoSurface<T extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: DemoSurfaceProps<T>) {
  const Tag = as ?? "div";
  return (
    <Tag className={cx("rounded-2xl", surface, className)} {...props}>
      {children}
    </Tag>
  );
}

export function DemoStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("rounded-[40px] px-4 pt-11.5 pb-11", surface, className)}>
      {children}
    </div>
  );
}

export function SourceList({ children }: { children: ReactNode }) {
  return (
    <ol className={`list-decimal space-y-6 pl-6 marker:font-medium marker:text-text ${pageBodyClass}`}>
      {children}
    </ol>
  );
}

export function SourceItem({
  id,
  href,
  title,
  children,
}: {
  id: string;
  href: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <li id={id} className="scroll-mt-24 pl-1">
      <a
        className={sourceLinkClass}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {title}
      </a>
      : {children}
    </li>
  );
}
