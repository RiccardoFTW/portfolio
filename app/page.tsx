import Link from "next/link"
import { labItems } from "@/data/lab"
import './globals.css'

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-(--canvas) text-(--text)">
      <section className="mx-auto w-full max-w-xl px-6 py-6 pt-10 pb-20">
        <hgroup className='flex flex-col'>
          <h1 className='font-display text-display text-(--accent)'>Riccardo Ventura</h1>
          <p className='text-body'>Design Engineer</p>
        </hgroup>
        <section className="mt-20">
          <h2 className="font-display text-display text-(--accent)">
            Who am I?
          </h2>
          <p className='text-pretty'>I tend to think like a designer, but I enjoy bringing ideas to life through code. I create UI components and interfaces, taking care of every stage of the process: from the initial idea to design, all the way through development. I’m interested in details, micro-interactions, and that level of polish that turns a simple interface into an experience that feels truly enjoyable to use.
          </p>
        </section>
        <section className='mt-20'>
          <h2 className='font-display text-display text-(--accent)'>
            Lab
          </h2>
          <ul className="space-y-4">
            {labItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/lab/${item.slug}`}
                  className="underline underline-offset-4"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-body">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-20">
          <h2 className="font-display text-display text-(--accent)">
            Connect
          </h2>

          <p className="text-body">
            Reach me via{" "}
            <a href="mailto:la-tua-email@example.com">email</a>, or find me on{" "}
            <a
              href="https://github.com/tuo-username"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{" "}
            and{" "}
            <a
              href="https://linkedin.com/in/tuo-profilo"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            .
          </p>
        </section>
      </section>
    </main>
  )
}
