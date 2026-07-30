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
      </section>
    </main>
  )
}
