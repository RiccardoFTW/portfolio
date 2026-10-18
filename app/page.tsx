import { ArrowUpRight } from "lucide-react";
import { Annotation } from "@/components/Annotation";
import { Highlight } from "@/components/best-practices/Highlight";
import { PageFrame } from "@/components/PageFrame";
import { SectionLink } from "@/components/SectionLink";
import { pageArrowClass, pageBodyClass } from "@/components/pageStyle";

export default function HomePage() {
  return (
    <PageFrame home>
      <section className={`animate-enter [--stagger:1] mt-20 max-w-[66ch] ${pageBodyClass}`}>
        <p className="text-pretty">
          Ciao!<br /> Sono un{" "}
          <Annotation type="circle" padding={7} className="whitespace-nowrap">
            designer
          </Annotation>
          , che cerca di dare vita alle proprie idee attraverso il{" "}codice. <br />
          Ricerco la <Highlight>bellezza nel software</Highlight>, convinto che spesso si nasconda nei dettagli più piccoli. Un
          po&apos; come la felicità, che troviamo nelle piccole cose.<br />
          Mi piace progettare e sviluppare <Highlight>componenti UI</Highlight> e <Highlight>interfacce</Highlight>, esplorando il punto d&apos;incontro tra design e tecnologia. Dedico particolare attenzione alle <Annotation type="circle" padding={7} className="whitespace-nowrap">micro-interazioni</Annotation>, all&apos;<Annotation type="circle" padding={7} className="whitespace-nowrap">accessibilità</Annotation> e a tutti quei piccoli accorgimenti che rendono un&apos;interfaccia intuitiva e piacevole da utilizzare.<br />
          In questo spazio condivido i miei {" "}
          <Annotation iterations={2} className="whitespace-nowrap">
            <SectionLink href="/lab">
              esperimenti
              <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
            </SectionLink>
          </Annotation>
          , ciò che imparo lungo il percorso,{" "}
          <Annotation iterations={2} className="whitespace-nowrap">
            <SectionLink href="/best-practices">
              best practices
              <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
            </SectionLink>
          </Annotation>{" "}
          e {" "}
          <Annotation iterations={2} className="whitespace-nowrap">
            <SectionLink href="/thoughts">
              riflessioni personali.
              <ArrowUpRight aria-hidden="true" className={pageArrowClass} />
            </SectionLink>
          </Annotation>{" "}
        </p>
      </section>
    </PageFrame>
  );
}
