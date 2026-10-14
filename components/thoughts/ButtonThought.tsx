import { Annotation } from "@/components/Annotation"
import { ButtonStateDemo } from "@/components/thoughts/ButtonStateDemo"

const nativeButtonExample = `<button type="button" onClick={handleSave}>
  Salva modifiche
</button>`

const stateExample = `type SaveState = "idle" | "loading" | "success"

const [saveState, setSaveState] = useState<SaveState>("idle")`

const states = [
  ["Idle", "L’azione è disponibile e la sua label dice cosa succederà."],
  ["Hover e focus", "Hover suggerisce interattività; focus visibile mantiene la tastiera orientata."],
  ["Pressed", "Un feedback breve conferma che il sistema ha ricevuto il gesto."],
  ["Loading", "L’azione è partita: evita doppi invii e rendi esplicita l’attesa."],
  ["Success", "Il risultato chiude il loop: l’utente non deve indovinare se ha funzionato."],
  ["Disabled", "Usalo solo quando l’azione non è possibile e rendi comprensibile il perché."],
] as const

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-5 overflow-x-auto rounded-2xl bg-black/[0.04] p-4 text-left text-sm leading-6 text-(--text) shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)]">
      <code>{children}</code>
    </pre>
  )
}

export function ButtonThought() {
  return (
    <div className="mt-16 space-y-16 text-pretty">
      <section aria-labelledby="intent-title">
        <h2 id="intent-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Prima dell&apos;estetica, l&apos;intenzione
        </h2>
        <p className="mt-4">
          Un button non esiste per decorare una pagina: permette di compiere un&apos;azione. Salvare,
          inviare, aprire un dialog o confermare qualcosa cambia lo stato dell&apos;interfaccia. Questa
          intenzione arriva prima del colore, del bordo e dell&apos;animazione.
        </p>
        <p className="mt-4">
          La domanda utile non è “come lo rendo bello?”, ma “<Annotation type="underline">che cosa
          deve far capire e fare?</Annotation>”. Quando la risposta è chiara, anche gerarchia,
          label e feedback diventano decisioni più semplici.
        </p>
      </section>

      <section aria-labelledby="link-or-button-title">
        <h2 id="link-or-button-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Link o button?
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl bg-black/[0.025] p-5 shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)]">
            <h3 className="font-medium text-(--text)">Usa un link</h3>
            <p className="mt-2 text-sm">Quando l&apos;utente naviga verso un URL: “Leggi l&apos;articolo”, “Vai al profilo”.</p>
          </article>
          <article className="rounded-2xl bg-black/[0.025] p-5 shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)]">
            <h3 className="font-medium text-(--text)">Usa un button</h3>
            <p className="mt-2 text-sm">Quando l&apos;utente agisce nella UI: “Salva”, “Invia”, “Apri menu”.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="states-title">
        <h2 id="states-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Gli stati non sono decorazione
        </h2>
        <p className="mt-4">
          Ogni stato è un messaggio. Se ne manca uno, non stai solo perdendo polish: stai lasciando
          una domanda senza risposta.
        </p>
        <dl className="mt-5 divide-y divide-(--border) border-y border-(--border)">
          {states.map(([name, description]) => (
            <div key={name} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="font-medium text-(--text)">{name}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="hierarchy-title">
        <h2 id="hierarchy-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Progetta la gerarchia, non solo la forma
        </h2>
        <p className="mt-4">
          In un contesto, una sola azione dovrebbe avere la massima enfasi. Una label breve con un
          verbo — “Salva modifiche”, non “Clicca qui” — rende il risultato prevedibile. Il target
          deve restare comodo da toccare, anche quando il bottone visivamente è compatto.
        </p>
        <p className="mt-4">
          Per lo stato loading, conserva uno spazio stabile: un bottone che cambia larghezza mentre
          lo stai guardando sembra meno affidabile del tempo di attesa che sta comunicando.
        </p>
      </section>

      <section aria-labelledby="code-title">
        <h2 id="code-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Parti dal button nativo
        </h2>
        <p className="mt-4">
          Il tag <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-sm text-(--text)">&lt;button&gt;</code>{" "}
          porta già con sé tastiera, focus e semantica. Ricostruirli con un <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-sm text-(--text)">&lt;div onClick&gt;</code>{" "}
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
        <h2 id="demo-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Il feedback chiude il loop
        </h2>
        <p className="mt-4">
          Qui il salvataggio è simulato, ma la sequenza è reale: un click avvia l&apos;attesa, blocca il
          doppio invio e comunica la riuscita. La label esce in 150ms e quella nuova entra in altri
          150ms. Lo stato dell&apos;azione e il messaggio accessibile cambiano subito.
        </p>
        <div className="mt-6">
          <ButtonStateDemo />
        </div>
      </section>

      <section aria-labelledby="motion-title">
        <h2 id="motion-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          La decisione di motion
        </h2>
        <p className="mt-4">
          La piccola compressione al pointer press dice “ti ho sentito”. Dura 150ms, anima solo
          <code className="rounded bg-black/[0.04] px-1.5 py-0.5 text-sm text-(--text)">transform</code> e
          non viene applicata quando l&apos;azione parte da tastiera. Il testo scorre di pochi pixel
          e sfuma quando cambia stato, mantenendo fermo il contenitore del pulsante.
        </p>
        <p className="mt-4">
          Con reduced motion il feedback di scala scompare e la label cambia senza transizione,
          mentre il messaggio di stato resta: riduciamo il movimento, non la chiarezza.
        </p>
      </section>

      <section aria-labelledby="checklist-title">
        <h2 id="checklist-title" className="font-display text-4xl leading-none text-(--accent) text-balance">
          Checklist prima di pubblicare
        </h2>
        <ul className="mt-5 list-inside list-disc space-y-2 marker:text-(--accent)">
          <li>La label descrive l&apos;azione e non il gesto.</li>
          <li>Il markup semantico corrisponde al comportamento: link per navigare, button per agire.</li>
          <li>Focus, stato disabled e loading sono visibili e verificabili da tastiera.</li>
          <li>Il risultato dell&apos;azione viene comunicato anche a chi non vede il cambio di colore.</li>
          <li>Motion e hover non sono l&apos;unico modo per capire che cosa sta succedendo.</li>
        </ul>
      </section>

      <section aria-labelledby="resources-title" className="border-t border-(--border) pt-8">
        <h2 id="resources-title" className="font-display text-4xl leading-none text-(--accent)">
          Per approfondire
        </h2>
        <ul className="mt-5 space-y-2">
          <li><a className="underline decoration-1 underline-offset-4 pointer-fine:hover:text-(--accent)" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button" target="_blank" rel="noreferrer">MDN: l&apos;elemento button</a></li>
          <li><a className="underline decoration-1 underline-offset-4 pointer-fine:hover:text-(--accent)" href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noreferrer">W3C: Button Pattern</a></li>
          <li><a className="underline decoration-1 underline-offset-4 pointer-fine:hover:text-(--accent)" href="https://uiplaybook.dev/play/button" target="_blank" rel="noreferrer">UI Playbook: Button</a></li>
        </ul>
      </section>
    </div>
  )
}
