import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleNav } from "@/components/ArticleNav";
import {
  bestPractices,
  findBestPractice,
} from "@/data/best-practices";

export function generateStaticParams() {
  return bestPractices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findBestPractice(slug);

  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function BestPracticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findBestPractice(slug);

  if (!item) {
    notFound();
  }

  const Article = item.Component;

  return (
    <main className="relative bg-background text-foreground">
      <div className="relative mx-auto flex w-full max-w-(--page-max-width) flex-col px-(--page-padding-inline) pt-10 pb-20">
        <Link
          href="/#best-practices"
          aria-label="Torna alla home"
          className="mb-2 inline-flex size-10 items-center justify-center text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent xl:fixed xl:top-8 xl:left-6 xl:z-10 xl:mb-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="size-6"
            aria-hidden="true"
          >
            <path d="M11 8.5H10.5V4.7C10.5 4.31 10.19 4 9.8 4C9.61 4 9.43 4.08 9.29 4.22L3.34 10.63C3.12 10.87 3 11.18 3 11.5C3 11.82 3.12 12.13 3.34 12.37L9.29 18.78C9.43 18.92 9.61 19 9.8 19C10.19 19 10.5 18.69 10.5 18.3V14.5C16.05 14.5 19.05 18.52 19.81 19.68C19.93 19.88 20.14 20 20.37 20C20.72 20 21 19.72 21 19.37V18.5C21 12.98 16.52 8.5 11 8.5Z" />
          </svg>
        </Link>

        <ArticleNav sections={item.sections} />
        <Article />
      </div>
    </main>
  );
}
