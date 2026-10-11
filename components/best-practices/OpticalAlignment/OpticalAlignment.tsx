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
        <Prose>
          Nei tool di design e nel codice ragioniamo per griglie, bounding box e
          coordinate. Le misure possono essere esatte e il risultato sembrare
          comunque storto, perché l’occhio legge forme e pesi, non i rettangoli
          che le contengono. In un pulsante con testo e icona{" "}
          <Highlight>
            il contenuto può sembrare decentrato anche quando le distanze sono
            uguali
          </Highlight>
          . L’allineamento ottico corregge questa differenza. L’esempio classico
          è un triangolo dentro un cerchio, come l’icona play: se lo allinei con
          il bounding box sembra spostato, se allinei il suo baricentro al centro
          del cerchio sembra a posto
          <FootnoteRef href="#optical-alignment-source-1" n={1} />.
        </Prose>

        <AnnotationGroup
          className="space-y-6"
          aria-labelledby="optical-alignment-button-title"
        >
          <ArticleHeading id="optical-alignment-button-title">
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
            Apple suggerisce lo stesso trucco per le icone asimmetriche: mettere
            il padding dentro l’asset, così che centrarlo con le misure lo centri
            anche a occhio. Il suo esempio è l’icona download, che pesa di più in
            basso e, centrata geometricamente, sembra troppo bassa
            <FootnoteRef href="#optical-alignment-source-2" n={2} />.
          </Prose>
        </AnnotationGroup>

        <AnnotationGroup
          className="space-y-6"
          aria-labelledby="optical-alignment-sidebar-title"
        >
          <ArticleHeading id="optical-alignment-sidebar-title">
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
            <Highlight>Lì ha senso valutare una correzione ottica.</Highlight>{" "}
            Gli SF Symbols di Apple
            <FootnoteRef href="#optical-alignment-source-3" n={3} /> la portano
            già dentro il simbolo: ogni variante può avere margini sinistro e
            destro propri, anche negativi, che cambiano con il peso e la scala
            <FootnoteRef href="#optical-alignment-source-4" n={4} />.
          </Prose>
        </AnnotationGroup>

        <AnnotationGroup
          className="space-y-6"
          aria-labelledby="optical-alignment-practice-title"
        >
          <ArticleHeading id="optical-alignment-practice-title">
            Quando correggere
          </ArticleHeading>

          <Prose>
            Prima di spostare un elemento di uno o due pixel, controlla com’è
            costruito il componente: dimensioni coerenti, SVG puliti, viewBox
            corretti, spaziature costanti e allineamento geometrico.{" "}
            <Highlight>
              Se qualcosa sembra ancora fuori posto, prova una correzione ottica.
            </Highlight>{" "}
            Se ripeti lo stesso spostamento in più punti, chiediti se quella
            regola appartiene al componente, all’icona o al design system.
          </Prose>

          <Prose>
            Marc Edwards, di Bjango
            <FootnoteRef href="#optical-alignment-source-1" n={1} />, sostiene
            che molte correzioni fatte a occhio si possono calcolare. Un cerchio
            largo quanto un quadrato sembra più piccolo; per dargli la stessa
            area va scalato del 112,84%. Per forme con buchi o rientranze, come
            una ciambella o una stella, propone di misurare l’area del loro
            involucro convesso. Il giudizio resta tuo, ma un numero aiuta quando
            la correzione va automatizzata o animata.
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
