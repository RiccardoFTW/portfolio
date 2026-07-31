import { notFound } from "next/navigation"
import { labItems } from "@/data/lab"
import { FeedbackComponent } from "@/components/feedback/FeedbackComponent"

export default async function LabItemPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const item = labItems.find((item) => item.slug === slug)

    if (!item) {
        notFound()
    }

    return (
        <main className="min-h-dvh bg-(--canvas) text-(--text)">
            <article className="mx-auto w-full max-w-xl px-6 pt-10 pb-20">
                <h1 className="font-display text-display text-(--accent)">
                    {item.title}
                </h1>
                <p className="text-body">{item.description}</p>
                {item.slug === "feedback" ? (
                    <section className="mt-20">
                        <FeedbackComponent />
                    </section>
                ) : null}
            </article>
        </main>
    )
}