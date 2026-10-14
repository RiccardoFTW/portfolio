import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { pageArrowClass, pageBodyClass, pageLinkClass, pageTitleClass } from "@/components/pageStyle";
import { findLabItem, labItems } from "@/data/lab";

export function generateStaticParams() {
  return labItems.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findLabItem(slug);

  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function LabItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findLabItem(slug);

  if (!item) {
    notFound();
  }

  const Demo = item.Demo;

  return (
    <PageFrame>
      <article className="mt-20">
        <Link href="/lab" className={pageLinkClass}>
          Esperimenti
          <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
        </Link>
        <h1 className={`mt-4 ${pageTitleClass}`}>{item.title}</h1>
        <p className={`mt-4 max-w-[66ch] ${pageBodyClass}`}>{item.description}</p>
        <section className="mt-16 flex w-full justify-center">
          <Demo />
        </section>
      </article>
    </PageFrame>
  );
}
