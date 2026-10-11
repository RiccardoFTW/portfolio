import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findThought, thoughts } from "@/data/thoughts";

export function generateStaticParams() {
  return thoughts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thought = findThought(slug);

  if (!thought) {
    return {
      title: "Thought non trovato",
    };
  }

  return {
    title: thought.title,
    description: thought.description,
  };
}

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thought = findThought(slug);

  if (!thought) {
    notFound();
  }

  const Article = thought.Component;

  return (
    <main className="bg-(--canvas) text-(--text)">
      <article className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
        <Link
          href="/thoughts"
          className="inline-flex min-h-11 items-center text-sm font-medium text-(--accent) underline decoration-1 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas) pointer-fine:hover:text-(--text)"
        >
          ← Torna alle riflessioni
        </Link>

        <header className="mt-14">
          <p className="text-sm font-medium text-(--accent)">{thought.category}</p>
          <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.9] text-(--accent) text-balance sm:text-6xl">
            {thought.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-pretty">
            {thought.description}
          </p>
          <p className="mt-6 text-sm">
            <time dateTime={thought.publishedAt}>{thought.publishedLabel}</time>
            <span aria-hidden="true"> · </span>
            {thought.readingTime}
          </p>
        </header>

        <Article />
      </article>
    </main>
  );
}
