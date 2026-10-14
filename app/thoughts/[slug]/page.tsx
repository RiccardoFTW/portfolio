import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { pageArrowClass, pageBodyClass, pageLinkClass, pageTitleClass } from "@/components/pageStyle";
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
    <PageFrame>
      <article className="mt-20">
        <Link href="/thoughts" className={pageLinkClass}>
          Riflessioni personali
          <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
        </Link>

        <header className="mt-4 max-w-[66ch]">
          <p className="text-body">{thought.category}</p>
          <h1 className={`mt-4 text-balance ${pageTitleClass}`}>{thought.title}</h1>
          <p className={`mt-4 text-pretty ${pageBodyClass}`}>{thought.description}</p>
          <p className="mt-4 text-body">
            <time dateTime={thought.publishedAt}>{thought.publishedLabel}</time>
            <span aria-hidden="true"> · </span>
            {thought.readingTime}
          </p>
        </header>

        <Article />
      </article>
    </PageFrame>
  );
}
