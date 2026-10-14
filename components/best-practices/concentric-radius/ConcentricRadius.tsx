import CodeExamples, { type CodeExample } from "../CodeExamples";
import { Highlight } from "../Highlight";
import {
  ArticleHeading,
  ArticleTitle,
  DemoStage,
  DemoSurface,
  FormulaCallout,
  Measure,
  Prose,
  SourceItem,
  SourceList,
  Symbol,
} from "../article";
import ConcentricCard from "./examples/ConcentricCard";
import ContextMenu from "./examples/ContextMenu";
import RadiusFormulaExample from "./RadiusFormulaExample";
import SearchBar from "./examples/SearchBar";
import { Annotation } from "@/components/Annotation";
import { AnnotationGroup } from "@/components/AnnotationGroup";
import { pageAccentClass, pageBodyClass } from "@/components/pageStyle";
import ConcentricArcs from "./ConcentricArcs";
import ConcentricRadiusIntro from "./ConcentricRadiusIntro";
import { FootnoteRef } from "../FootnoteRef";

const CONCENTRIC_RADIUS_EXAMPLES: readonly CodeExample[] = [
  {
    label: "Tailwind",
    code: `<div className="rounded-[32px] border-4 border-solid border-current p-3">
  <div className="rounded-2xl">Contenuto</div>
</div>`,
  },
  {
    label: "CSS",
    code: `.parent {
  border: 4px solid currentColor;
  padding: 12px;
  border-radius: 32px;
}

.child {
  border-radius: 16px;
}`,
  },
];

function ConcentricRadiusProblem() {
  return (
    <AnnotationGroup
      className="space-y-6"
      aria-labelledby="concentric-radius-rule-title"
    >
      <ArticleHeading id="concentric-radius-rule-title">
        Il problema
      </ArticleHeading>
      <Prose>
        Quando si lavora in fretta capita di dare{" "}
        <Highlight>lo stesso border-radius</Highlight> al contenitore e
        all&apos;elemento interno. Il componente funziona e a prima vista il
        difetto passa. Negli angoli, però, le due curve non hanno lo stesso
        centro
        <FootnoteRef href="#concentric-radius-source-1" n={1} />.
      </Prose>
      <figure>
        <DemoSurface className="px-4 py-5">
          <div className="grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2">
            <div className="flex min-h-64 flex-col items-center justify-center gap-6 p-6">
              <div
                aria-hidden="true"
                className="size-36 rounded-xl bg-inset p-2 ring-1 ring-demo-edge"
              >
                <div className="size-full rounded-xl bg-surface inset-ring-1 inset-ring-demo-edge" />
              </div>
              <p className="font-sans text-lg leading-6 font-medium text-danger-ink">Sbagliato</p>
            </div>

            <div className="flex min-h-64 flex-col items-center justify-center gap-6 p-6">
              <div
                aria-hidden="true"
                className="size-36 rounded-[20px] bg-inset p-2 ring-1 ring-demo-edge"
              >
                <div className="size-full rounded-xl bg-surface inset-ring-1 inset-ring-demo-edge" />
              </div>
              <p className="font-sans text-lg leading-6 font-medium text-success-ink">Giusto</p>
            </div>
          </div>
        </DemoSurface>
      </figure>
      <Prose>
        Nell&apos;esempio Sbagliato lo spazio fra le curve{" "}
        <Highlight>si allarga negli angoli</Highlight>. Paul Hebert, di Cloud
        Four
        <FootnoteRef href="#concentric-radius-source-2" n={2} />, se n&apos;è
        accorto così: aveva usato lo stesso valore per entrambi gli elementi e
        il risultato sembrava comunque storto. Di solito si vede che la forma
        non torna prima di capire il perché.
      </Prose>
    </AnnotationGroup>
  );
}

function ConcentricRadiusSolution() {
  return (
    <AnnotationGroup
      className="space-y-6"
      aria-labelledby="concentric-radius-solution-title"
    >
      <ArticleHeading id="concentric-radius-solution-title">
        La soluzione
      </ArticleHeading>
      <Prose>
        In Figma o in Paper puoi usare un offset per tenere coerenti le curve
        degli elementi annidati. Nel codice la relazione si scrive così:
      </Prose>
      <FormulaCallout>
        raggio interno = raggio esterno − spazio
      </FormulaCallout>
      <RadiusFormulaExample />
    </AnnotationGroup>
  );
}

function ConcentricRadiusFormula() {
  return (
    <AnnotationGroup
      className="space-y-6"
      aria-labelledby="concentric-radius-why-title"
    >
      <ArticleHeading id="concentric-radius-why-title">
        La formula
      </ArticleHeading>
      <Prose>
        Hebert propone di pensare a ogni angolo come a un piccolo cerchio:{" "}
        <Measure>border-radius</Measure> ne imposta il raggio. Ora immagina
        due quarti di cerchio con <Highlight>lo stesso centro</Highlight>, uno
        dentro l&apos;altro. La differenza fra i raggi è la distanza fra le
        curve, ed è per questo che lo spazio resta uguale lungo tutto
        l&apos;angolo.
      </Prose>

      <ConcentricArcs />

      <FormulaCallout>r = max(R − g, 0)</FormulaCallout>

      <Prose>
        Qui <Symbol>R</Symbol> è il raggio esterno, <Symbol>r</Symbol> quello
        interno e <Symbol>g</Symbol> la distanza fra i due bordi. Letta al
        contrario, la relazione diventa <Measure>R = r + g</Measure>. Se il
        contenitore non ha un bordo, <Symbol>g</Symbol>{" "}coincide con il
        padding; se ce l&apos;ha, <Symbol>g</Symbol> comprende anche il suo
        spessore. Il <Measure>max(…, 0)</Measure> viene dalla specifica CSS
        <FootnoteRef href="#concentric-radius-source-3" n={3} />: quando la
        sottrazione darebbe un valore negativo, il browser usa zero e
        l&apos;angolo interno diventa vivo.
      </Prose>

      <DemoSurface
        as="dl"
        className="divide-y divide-black/8 dark:divide-white/8"
      >
        <div className="grid grid-cols-[2.75rem_1fr] items-center gap-3 px-4 py-3">
          <dt className={pageAccentClass}>
            <strong>R</strong>
          </dt>
          <dd className={pageBodyClass}>
            raggio del bordo esterno
          </dd>
        </div>

        <div className="grid grid-cols-[2.75rem_1fr] items-center gap-3 px-4 py-3">
          <dt className={pageAccentClass}>
            <strong>r</strong>
          </dt>
          <dd className={pageBodyClass}>
            raggio del bordo interno
          </dd>
        </div>

        <div className="grid grid-cols-[2.75rem_1fr] items-center gap-3 px-4 py-3">
          <dt className={pageAccentClass}>
            <Annotation
              type="circle"
              color="var(--article-accent)"
              padding={4}
              animationDuration={350}
            >
              <strong>g</strong>
            </Annotation>
          </dt>
          <dd className={pageBodyClass}>
            distanza tra i due bordi
          </dd>
        </div>
      </DemoSurface>

      <DemoSurface className="grid grid-cols-3 divide-x divide-black/8 dark:divide-white/8">
        <p className="px-4 py-3">
          <span className={`block ${pageAccentClass}`}>
            R
          </span>
          <span className="mt-1 block font-sans text-lg leading-6 tabular-nums text-foreground">
            32
            <span className="ml-1 text-text">
              px
            </span>
          </span>
        </p>
        <p className="px-4 py-3">
          <span className={`block ${pageAccentClass}`}>
            g
          </span>
          <span className="mt-1 block font-sans text-lg leading-6 tabular-nums text-foreground">
            12
            <span className="ml-1 text-text">
              px
            </span>
          </span>
        </p>
        <p className="px-4 py-3">
          <span className={`block ${pageAccentClass}`}>
            r
          </span>
          <span className="mt-1 block font-sans text-lg leading-6 tabular-nums text-foreground">
            20
            <span className="ml-1 text-text">
              px
            </span>
          </span>
        </p>
      </DemoSurface>

      <Prose>
        La distanza fra le due curve resta <Measure>12px</Measure> anche
        nell&apos;angolo.
      </Prose>
    </AnnotationGroup>
  );
}

function ConcentricRadiusCode() {
  return (
    <AnnotationGroup
      className="space-y-6"
      aria-labelledby="concentric-radius-css-title"
    >
      <ArticleHeading id="concentric-radius-css-title">
        Il codice
      </ArticleHeading>

      <Prose>
        Nel codice conta tutta la distanza fra le due curve. Il{" "}
        <Measure>border-radius</Measure> del contenitore definisce il raggio
        esterno
        <FootnoteRef href="#concentric-radius-source-4" n={4} />. Per trovare
        quello dell&apos;elemento interno{" "}
        <Highlight>
          togli lo spessore del bordo, se c&apos;è, e poi il padding
        </Highlight>
        . È lo stesso ordine della specifica W3C
        <FootnoteRef href="#concentric-radius-source-3" n={3} />: prima il
        bordo, poi il padding.
      </Prose>

      <CodeExamples
        examples={CONCENTRIC_RADIUS_EXAMPLES}
        ariaLabel="Esempi per i raggi interni, Tailwind e CSS puro"
      />

      <Prose>
        Qui il raggio esterno è <Measure>32px</Measure>. Il bordo è spesso{" "}
        <Measure>4px</Measure>, quindi sulla sua curva interna il raggio
        scende a <Measure>28px</Measure>. Togli i <Measure>12px</Measure> di
        padding e il figlio usa{" "}
        <Highlight>
          <Measure>16px</Measure>
        </Highlight>
        .
      </Prose>
    </AnnotationGroup>
  );
}

function ConcentricRadiusExamples() {
  return (
    <AnnotationGroup
      className="space-y-6"
      aria-labelledby="concentric-radius-examples-title"
    >
      <ArticleHeading id="concentric-radius-examples-title">
        Esempi pratici
      </ArticleHeading>
      <Prose>
        Card, menu e barra di ricerca hanno tutti un raggio esterno di{" "}
        <Measure>24px</Measure> e <Measure>8px</Measure> di padding, quindi
        l&apos;interno corretto è <Measure>16px</Measure>
        <FootnoteRef href="#concentric-radius-source-5" n={5} />. Attiva
        Corretto per confrontarlo con lo stesso componente a{" "}
        <Measure>8px</Measure>.
      </Prose>
      <DemoStage>
        <ConcentricCard />
      </DemoStage>
      <DemoStage>
        <ContextMenu />
      </DemoStage>
      <DemoStage>
        <SearchBar />
      </DemoStage>
    </AnnotationGroup>
  );
}

function ConcentricRadiusSources() {
  return (
    <section
      className="space-y-6"
      aria-labelledby="concentric-radius-sources-title"
    >
      <ArticleHeading id="concentric-radius-sources-title">
        Per approfondire
      </ArticleHeading>
      <SourceList>
        <SourceItem
          id="concentric-radius-source-1"
          href="https://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/"
          title="CSS-Tricks, Careful With Your Nested Border-Radii"
        >
          le due curve devono avere lo stesso centro. Con un bordo di{" "}
          <Measure>5px</Measure> e un raggio esterno di <Measure>25px</Measure>
          , l&apos;interno scende a <Measure>20px</Measure>.
        </SourceItem>
        <SourceItem
          id="concentric-radius-source-2"
          href="https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/"
          title="Cloud Four, The Math Behind Nesting Rounded Corners"
        >
          Paul Hebert ricava la formula pensando agli angoli come a cerchi e
          la traduce in <Measure>calc()</Measure>.
        </SourceItem>
        <SourceItem
          id="concentric-radius-source-3"
          href="https://www.w3.org/TR/css-backgrounds-3/#corners"
          title="W3C, CSS Backgrounds and Borders, Rounded Corners"
        >
          il raggio interno del bordo è quello esterno meno lo spessore,
          quello del contenuto toglie anche il padding, e un risultato
          negativo diventa zero.
        </SourceItem>
        <SourceItem
          id="concentric-radius-source-4"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-radius"
          title="MDN, border-radius"
        >
          la sintassi, i valori per i singoli angoli e i raggi ellittici.
        </SourceItem>
        <SourceItem
          id="concentric-radius-source-5"
          href="https://www.30secondsofcode.org/css/s/nested-border-radius/"
          title="30 seconds of code, Perfect nested border radius in CSS"
        >
          lo stesso caso degli esempi pratici, <Measure>24px</Measure> fuori e{" "}
          <Measure>8px</Measure> di padding, scritto con variabili CSS.
        </SourceItem>
      </SourceList>
    </section>
  );
}

export default function ConcentricRadius() {
  return (
    <section
      id="concentric-radius"
      className="space-y-6"
      aria-labelledby="concentric-radius-title"
    >
      <ConcentricRadiusIntro />
      <ArticleTitle id="concentric-radius-title" readingMinutes={5}>
        Concentric radius
      </ArticleTitle>

      <article className="space-y-6">
        <Prose>
          Card, menu e campi di ricerca contengono spesso un elemento
          arrotondato. Lì <Highlight>la distanza fra i due bordi</Highlight> conta
          anche negli angoli, e il concentric radius serve a tenerla uguale lungo
          tutta la curva.
        </Prose>
        <ConcentricRadiusProblem />
        <ConcentricRadiusSolution />
        <ConcentricRadiusFormula />
        <ConcentricRadiusCode />
        <ConcentricRadiusExamples />
        <ConcentricRadiusSources />
      </article>
    </section>
  );
}
