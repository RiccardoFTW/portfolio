import { AnnotationGroup } from "@/components/AnnotationGroup";
import IconAlignment from "./IconAlignment";
import SidebarAlignment from "./SidebarAlignment";
import OpticalAlignmentIntro from "./OpticalAlignmentIntro";
import { FootnoteRef } from "../FootnoteRef";
import { Highlight } from "../Highlight";
import {
  ArticleHeading,
  ArticleTitle,
  Prose,
  SourceItem,
  SourceList,
} from "../article";

export default function OpticalAlignment() {
  return (
    <section
      id="optical-alignment"
      className="space-y-6"
      aria-labelledby="optical-alignment-title"
    >
      <OpticalAlignmentIntro />
      <ArticleTitle id="optical-alignment-title" readingMinutes={3}>
        Optical alignment
      </ArticleTitle>

      <article className="space-y-6">
        <AnnotationGroup
          className="space-y-6"
          aria-labelledby="optical-alignment-introduction-title"
        >
          <ArticleHeading id="optical-alignment-introduction-title">
            Un centro che sembra spostato
          </ArticleHeading>
          <Prose>
            Nei tool di design e nel codice usiamo griglie e bounding box, i
            rettangoli che racchiudono gli elementi, per decidere dove mettere
            le cose. Le misure possono essere esatte e il risultato sembrare
            comunque storto. In un pulsante con testo e icona, per esempio,{" "}
            <Highlight>
              il contenuto può sembrare decentrato anche quando le distanze
              sono uguali
            </Highlight>
            . L’allineamento ottico serve a correggere questa differenza fra
            posizione misurata e posizione percepita.
          </Prose>
        </AnnotationGroup>

        <section
          className="space-y-6"
          aria-labelledby="optical-alignment-thesis-title"
        >
          <ArticleHeading id="optical-alignment-thesis-title">
            Il peso visivo delle forme
          </ArticleHeading>
          <Prose>
            Per centrare una forma bisogna considerare come è distribuito il
            suo peso visivo. Il caso classico è il triangolo dell’icona play
            dentro un cerchio: centrare il suo bounding box può farlo sembrare
            spostato; allineare il suo baricentro al centro del cerchio corregge
            quella sensazione
            <FootnoteRef href="#optical-alignment-source-1" n={1} />.
          </Prose>

          <AnnotationGroup
            className="space-y-6"
            aria-labelledby="optical-alignment-button-title"
          >
            <ArticleHeading id="optical-alignment-button-title" level={3}>
              Il pulsante
            </ArticleHeading>

            <Prose>
              Nel pulsante dell’esempio testo e freccia formano un solo gruppo. La
              freccia è asimmetrica e pesa di più a destra. Il padding è uguale sui
              due lati, quindi secondo le misure il gruppo è centrato.{" "}
              <Highlight>All’occhio può sembrare spostato</Highlight>.
            </Prose>

            <IconAlignment />

            <Prose>
              Nell’esempio aumentiamo il padding a sinistra e lo riduciamo a
              destra. La somma non cambia, quindi il contenuto si sposta dentro il
              pulsante e la larghezza resta la stessa.{" "}
              <Highlight>
                La misura giusta dipende dalla forma dell’icona, dal testo e dal
                contesto in cui li usi.
              </Highlight>{" "}
              Apple suggerisce lo stesso accorgimento per le icone asimmetriche:
              mettere il padding dentro l’asset, così che centrarlo con le misure
              lo centri anche a occhio. Il suo esempio è l’icona download, che pesa
              di più in basso e, centrata geometricamente, sembra troppo bassa
              <FootnoteRef href="#optical-alignment-source-2" n={2} />.
            </Prose>
          </AnnotationGroup>

          <AnnotationGroup
            className="space-y-6"
            aria-labelledby="optical-alignment-sidebar-title"
          >
            <ArticleHeading id="optical-alignment-sidebar-title" level={3}>
              La sidebar
            </ArticleHeading>

            <Prose>
              In una sidebar le icone hanno bisogno della stessa area e di una
              colonna regolare, e il rapporto con le etichette deve essere chiaro.{" "}
              <Highlight>Le misure sono il punto di partenza</Highlight>.
            </Prose>

            <SidebarAlignment />

            <Prose>
              Attiva le guide per vedere i box di icone e testo. Quando la colonna
              è a posto, guarda le forme una per una: qualcuna può sembrare ancora
              troppo alta, troppo bassa o spostata di lato.{" "}
              In quel caso puoi valutare una correzione ottica.{" "}
              Gli SF Symbols di Apple
              <FootnoteRef href="#optical-alignment-source-3" n={3} /> la portano
              già dentro il simbolo: ogni variante può avere margini sinistro e
              destro propri, anche negativi, che cambiano con il peso e la scala
              <FootnoteRef href="#optical-alignment-source-4" n={4} />.
            </Prose>
          </AnnotationGroup>
        </section>

        <AnnotationGroup
          className="space-y-6"
          aria-labelledby="optical-alignment-practice-title"
        >
          <ArticleHeading id="optical-alignment-practice-title">
            Prima di correggere a occhio
          </ArticleHeading>

          <Prose>
            Prima di spostare un elemento di uno o due pixel, controlla com’è
            costruito il componente: dimensioni coerenti, SVG puliti, viewBox
            corretti, spaziature costanti e allineamento geometrico.{" "}
            Uno spostamento può nascondere un problema in uno di questi punti.
            La correzione ottica ha senso quando la struttura è già coerente e
            una forma continua a sembrare fuori posto.
          </Prose>

          <Prose>
            Marc Edwards, di Bjango
            <FootnoteRef href="#optical-alignment-source-1" n={1} />, sostiene
            che molte correzioni fatte a occhio si possono calcolare. Un cerchio
            largo quanto un quadrato sembra più piccolo; per dargli la stessa
            area va scalato del 112,84%. Per forme con buchi o rientranze, come
            una ciambella o una stella, propone di misurare l’area del loro
            involucro convesso. Un numero aiuta quando la correzione va
            automatizzata o animata; il risultato va comunque valutato nel
            componente.
          </Prose>
        </AnnotationGroup>

        <AnnotationGroup
          className="space-y-6"
          aria-labelledby="optical-alignment-conclusion-title"
        >
          <ArticleHeading id="optical-alignment-conclusion-title">
            Correzioni riutilizzabili
          </ArticleHeading>
          <Prose>
            Parti dall’allineamento geometrico, poi osserva il componente con
            le forme e i testi che userai davvero. Negli esempi puoi attivare le
            guide e confrontare la posizione misurata con quella corretta.
            Se lo stesso spostamento serve in più punti, valuta se incorporarlo
            nell’icona, nel componente o nel design system, come fanno i simboli
            che hanno già margini ottici propri.
          </Prose>
        </AnnotationGroup>

        <section
          className="space-y-6"
          aria-labelledby="optical-alignment-sources-title"
        >
          <ArticleHeading id="optical-alignment-sources-title">
            Per approfondire
          </ArticleHeading>

          <SourceList>
            <SourceItem
              id="optical-alignment-source-1"
              href="https://bjango.com/articles/opticaladjustments/"
              title="Bjango, Formulas for optical adjustments"
            >
              Marc Edwards misura il peso visivo con area, involucro convesso e
              baricentro, partendo dal triangolo nel cerchio.
            </SourceItem>
            <SourceItem
              id="optical-alignment-source-2"
              href="https://developer.apple.com/design/human-interface-guidelines/icons"
              title="Apple Human Interface Guidelines, Icons"
            >
              il padding per centrare otticamente le icone asimmetriche, con
              l’esempio dell’icona download.
            </SourceItem>
            <SourceItem
              id="optical-alignment-source-3"
              href="https://developer.apple.com/design/human-interface-guidelines/sf-symbols"
              title="Apple Human Interface Guidelines, SF Symbols"
            >
              pesi, scale e margini ottici dei simboli.
            </SourceItem>
            <SourceItem
              id="optical-alignment-source-4"
              href="https://developer.apple.com/documentation/technologyoverviews/custom-sf-symbols"
              title="Apple, Creating custom symbols"
            >
              i margini sinistro e destro di ogni variante, anche negativi, per
              l’allineamento orizzontale.
            </SourceItem>
          </SourceList>
        </section>
      </article>
    </section>
  );
}
