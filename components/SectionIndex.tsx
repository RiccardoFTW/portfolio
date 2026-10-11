import Link from "next/link";

type SectionEntry = {
  href: string;
  title: string;
  description: string;
};

export function SectionIndex({
  title,
  lede,
  entries,
}: {
  title: string;
  lede: string;
  entries: readonly SectionEntry[];
}) {
  return (
    <main className="bg-background text-text">
      <section className="mx-auto w-full max-w-(--page-max-width) px-(--page-padding-inline) pt-16 pb-20">
        <hgroup className="flex flex-col tracking-[-0.5]">
          <Link
            href="/"
            className="font-sans text-lg leading-6 text-zinc-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Riccardo Ventura
          </Link>
          <p className="text-body">Design Engineer</p>
        </hgroup>

        <h1 className="mt-20 font-sans text-lg leading-6 text-foreground">{title}</h1>
        <p className="mt-4 max-w-[66ch] font-sans leading-6 text-pretty">{lede}</p>

        <ul className="mt-12 max-w-[66ch] border-b border-border">
          {entries.map((entry) => (
            <li key={entry.href} className="border-t border-border">
              <Link
                href={entry.href}
                className="group block py-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="block text-foreground transition-colors duration-150 pointer-fine:group-hover:text-accent">
                  {entry.title}
                </span>
                <span className="mt-1 block leading-6">{entry.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
