import { Highlight } from "@/components/best-practices/Highlight"
import { pageBodyClass, pageLinkClass, pageTitleClass } from "@/components/pageStyle"
import { ButtonStateDemo } from "@/components/thoughts/ButtonStateDemo"

const nativeButtonExample = `<button type="button" onClick={handleSave}>
  Salva modifiche
</button>`

const stateExample = `type SaveState = "idle" | "loading" | "success"

const [saveState, setSaveState] = useState<SaveState>("idle")`

const states = [
  ["Idle", "L’azione è disponibile e l’etichetta dice cosa succederà."],
  ["Hover e focus", "L’hover suggerisce che puoi interagire; il focus visibile indica dove ti trovi quando usi la tastiera."],
  ["Pressed", "Un feedback breve conferma che il sistema ha ricevuto il gesto."],
  ["Loading", "L’azione è partita: evita doppi invii e rendi esplicita l’attesa."],
  ["Success", "La conferma permette di capire se l’operazione è riuscita."],
  ["Disabled", "Usalo solo quando l’azione non è possibile e rendi comprensibile il perché."],
] as const

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className={`mt-5 overflow-x-auto rounded-2xl bg-black/[0.04] p-4 text-left shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)] ${pageBodyClass}`}>
      <code>{children}</code>
    </pre>
  )
}

export function ButtonThought() {
  return (
    <div className={`mt-16 space-y-16 text-pretty ${pageBodyClass}`}>
      <section aria-labelledby="intent-title">
        <h2 id="intent-title" className={`${pageTitleClass} text-balance`}>
          Che cosa deve fare il pulsante
        </h2>
        <p className="mt-4">
          Un pulsante permette di compiere un&apos;azione, come salvare le modifiche o aprire
          un dialog. La sua forma lo rende riconoscibile, ma durante l&apos;uso contano anche
          le risposte a due domande: che cosa succede quando lo premo e come capisco se ha funzionato?
        </p>
        <p className="mt-4">
          Per progettarlo parto da <Highlight>che cosa deve far capire e
          fare</Highlight>. Da lì scelgo il testo, l&apos;enfasi visiva e il feedback che
          accompagna l&apos;operazione, prima di definire colore, bordo e animazione.
        </p>
      </section>

      <section aria-labelledby="button-thesis-title" className="space-y-10">
        <div>
          <h2 id="button-thesis-title" className={`${pageTitleClass} text-balance`}>
            Rendere leggibile lo stato
          </h2>
          <p className="mt-4">
            Un pulsante dovrebbe descrivere l&apos;azione e renderne comprensibile lo stato.
            Nel caso di un salvataggio, il testo iniziale dice cosa verrà salvato;
            durante l&apos;attesa il controllo evita un secondo invio, poi conferma la riuscita.
          </p>
        </div>

        <section aria-labelledby="states-title">
          <h3 id="states-title" className={`${pageTitleClass} text-balance`}>
            Gli stati del pulsante
          </h3>
          <p className="mt-4">
            Il feedback cambia con l&apos;operazione. Durante l&apos;attesa serve sapere che
            il salvataggio è in corso; alla fine serve capire se è riuscito.
          </p>
          <dl className="mt-5 divide-y divide-(--border) border-y border-(--border)">
            {states.map(([name, description]) => (
              <div key={name} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className={pageTitleClass}>{name}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="hierarchy-title">
          <h3 id="hierarchy-title" className={`${pageTitleClass} text-balance`}>
            Gerarchia e testo
          </h3>
          <p className="mt-4">
            In un contesto, una sola azione dovrebbe avere la massima enfasi. Una label breve con un
            verbo, come “Salva modifiche”, rende il risultato prevedibile. “Clicca qui” descrive
            soltanto il gesto. Il target
            deve restare comodo da toccare, anche quando il bottone visivamente è compatto.
          </p>
          <p className="mt-4">
            Durante il loading, mantieni stabile la larghezza del pulsante mentre cambia
            il testo. In questo modo puoi leggere il nuovo stato senza vedere spostarsi
            anche i bordi del controllo.
          </p>
        </section>

        <section aria-labelledby="code-title">
          <h3 id="code-title" className={`${pageTitleClass} text-balance`}>
            Parti dal button nativo
          </h3>
          <p className="mt-4">
            Il tag <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-foreground">&lt;button&gt;</code>{" "}
            porta già con sé tastiera, focus e semantica. Ricostruirli con un <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-foreground">&lt;div onClick&gt;</code>{" "}
            significa assumersi lavoro extra e rischiare di farlo in modo incompleto.
          </p>
          <CodeBlock>{nativeButtonExample}</CodeBlock>
          <p className="mt-5">
            L&apos;informazione da ricordare è lo stato dell&apos;operazione, non ogni dettaglio visivo. Un
            union type rende espliciti gli stati validi e impedisce combinazioni ambigue.
          </p>
          <CodeBlock>{stateExample}</CodeBlock>
        </section>

        <section aria-labelledby="demo-title">
          <h3 id="demo-title" className={`${pageTitleClass} text-balance`}>
            Prova il salvataggio
          </h3>
          <p className="mt-4">
            Qui il salvataggio è simulato, ma la sequenza è reale: un click avvia l&apos;attesa, blocca il
            doppio invio e comunica la riuscita. La label esce in 150ms e quella nuova entra in altri
            150ms. Lo stato dell&apos;azione e il messaggio accessibile cambiano subito.
          </p>
          <div className="mt-6">
            <ButtonStateDemo />
          </div>
        </section>
      </section>

      <section aria-labelledby="button-antithesis-title" className="space-y-10">
        <div>
          <h2 id="button-antithesis-title" className={`${pageTitleClass} text-balance`}>
            Semantica e movimento
          </h2>
          <p className="mt-4">
            La forma di un pulsante non basta a scegliere il comportamento. Un controllo
            che porta a un altro URL deve essere un link, anche se visivamente assomiglia
            al pulsante accanto. Anche il movimento va valutato: la conferma deve restare
            comprensibile usando la tastiera o riducendo le animazioni.
          </p>
        </div>

        <section aria-labelledby="link-or-button-title">
          <h3 id="link-or-button-title" className={`${pageTitleClass} text-balance`}>
            Link o button?
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-black/[0.025] p-5 shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)]">
              <h4 className={pageTitleClass}>Usa un link</h4>
              <p className="mt-2">Quando l&apos;utente naviga verso un URL: “Leggi l&apos;articolo”, “Vai al profilo”.</p>
            </article>
            <article className="rounded-2xl bg-black/[0.025] p-5 shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)]">
              <h4 className={pageTitleClass}>Usa un button</h4>
              <p className="mt-2">Quando l&apos;utente agisce nella UI: “Salva”, “Invia”, “Apri menu”.</p>
            </article>
          </div>
        </section>

        <section aria-labelledby="motion-title">
          <h3 id="motion-title" className={`${pageTitleClass} text-balance`}>
            Quanto movimento serve
          </h3>
          <p className="mt-4">
            La piccola compressione al pointer press dice “ti ho sentito”. Dura 150ms, anima solo
            <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-foreground">transform</code> e
            non viene applicata quando l&apos;azione parte da tastiera. Il testo scorre di pochi pixel
            e sfuma quando cambia stato, mantenendo fermo il contenitore del pulsante.
          </p>
          <p className="mt-4">
            Con reduced motion la label cambia senza transizione e il messaggio di stato
            resta disponibile. Nella demo la compressione del pulsante resta, ma avviene
            senza animazione.
          </p>
        </section>
      </section>

      <section aria-labelledby="checklist-title">
        <h2 id="checklist-title" className={`${pageTitleClass} text-balance`}>
          Provare l’intera operazione
        </h2>
        <p className="mt-4">
          Per verificare il componente, prova l&apos;intera operazione: leggi l&apos;etichetta,
          avvia il salvataggio e aspetta la conferma. Ripeti usando la tastiera e con
          reduced motion. Questi controlli aiutano a capire se il feedback resta chiaro
          anche quando cambia il modo di interagire.
        </p>
        <ul className="mt-5 list-inside list-disc space-y-2 marker:text-text">
          <li>La label descrive l&apos;azione e non il gesto.</li>
          <li>Il markup semantico corrisponde al comportamento: link per navigare, button per agire.</li>
          <li>Focus, stato disabled e loading sono visibili e verificabili da tastiera.</li>
          <li>Il risultato dell&apos;azione viene comunicato anche a chi non vede il cambio di colore.</li>
          <li>Motion e hover non sono l&apos;unico modo per capire che cosa sta succedendo.</li>
        </ul>
      </section>

      <section aria-labelledby="resources-title" className="border-t border-(--border) pt-8">
        <h2 id="resources-title" className={pageTitleClass}>
          Per approfondire
        </h2>
        <ul className="mt-5 space-y-2">
          <li><a className={pageLinkClass} href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button" target="_blank" rel="noreferrer">MDN: l&apos;elemento button</a></li>
          <li><a className={pageLinkClass} href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noreferrer">W3C: Button Pattern</a></li>
          <li><a className={pageLinkClass} href="https://uiplaybook.dev/play/button" target="_blank" rel="noreferrer">UI Playbook: Button</a></li>
        </ul>
      </section>
    </div>
  )
}
