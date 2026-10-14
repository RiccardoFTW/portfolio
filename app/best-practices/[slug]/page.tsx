import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleNav } from "@/components/ArticleNav";
import { PageFrame } from "@/components/PageFrame";
import { pageArrowClass, pageLinkClass } from "@/components/pageStyle";
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
    <PageFrame>
      <div className="mt-20">
        <Link href="/best-practices" className={pageLinkClass}>
          Best practices
          <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
        </Link>
        <ArticleNav sections={item.sections} />
        <Article />
      </div>
    </PageFrame>
  );
}
