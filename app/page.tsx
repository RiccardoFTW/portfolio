import { Annotation } from "@/components/Annotation";
import { Highlight } from "@/components/best-practices/Highlight";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <main className="bg-background text-text">
        <section className="mx-auto w-full max-w-(--page-max-width) px-(--page-padding-inline) pt-16 pb-6">
          <hgroup className="flex flex-col">
            <h1 className="font-sans tracking-[-1px] text-lg text-zinc-300 leading-6">
              Riccardo Ventura
            </h1>
            <p className="text-body">Design Engineer</p>
          </hgroup>

          <section className="mt-20 max-w-[66ch] font-sans leading-6">
            <p className="text-pretty">
              Ciao! Sono un{" "}
              <Annotation type="box" padding={5}>
                designer
              </Annotation>
              , che cerca di dare vita alle proprie idee attraverso il{" "}codice. <br />
              Ricerco la <Highlight>bellezza nel software</Highlight>, convinto che spesso si nasconda nei dettagli più piccoli. Un
              po&apos; come la felicità, che troviamo nelle piccole cose.<br />
              Mi piace progettare e sviluppare <Highlight>componenti UI</Highlight> e <Highlight>interfacce</Highlight>, esplorando il punto d&apos;incontro tra design e tecnologia. Dedico particolare attenzione alle <Annotation type="circle" padding={7}>micro-interazioni</Annotation>, all&apos;<Annotation type="circle" padding={7}>accessibilità</Annotation> e a tutti quei piccoli accorgimenti che rendono un&apos;interfaccia intuitiva e piacevole da utilizzare.<br />
              Nel mio piccolo, cerco di contribuire a rendere Internet un posto migliore.<br />
              In questo spazio condivido i miei <Annotation iterations={2}>esperimenti</Annotation>, ciò che imparo lungo il percorso, <Annotation iterations={2}>buone pratiche</Annotation> e <Annotation iterations={2}>riflessioni personali</Annotation> sul mondo del design e dello sviluppo.
            </p>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
