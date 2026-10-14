export function FootnoteRef({ href, n }: { href: string; n: number }) {
    return (
        <sup className="relative -top-[0.5em] align-baseline text-[11px] font-semibold leading-none tabular-nums">
            <a
                href={href}
                aria-label={`Fonte ${n}`}
                className="rounded-sm px-px text-article-accent transition-[background-color,box-shadow] duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-article-accent/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-article-accent"
            >
                {n}
            </a>
        </sup>
    );
}
