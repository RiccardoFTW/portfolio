# Revisione User Interface Wiki — interventi mantenuti

Su richiesta, rimangono soltanto questi tre interventi della revisione:

| Prima | Dopo | Motivo | Riferimento |
| --- | --- | --- | --- |
| Controlli da 24 px | 32 × 32 px | Bersagli più facili da premere | `components/theme.tsx:23` |
| Deformazione delle tab fino a 1.8 | Massimo 1.04; cambio immediato da tastiera | Movimento più controllato, spring conservata per il puntatore | `components/Tabs.tsx:47` |
| Feedback da 600 ms e timer persistenti | 260 ms, focus sul campo e ritorno al trigger, timer annullati alla chiusura | Interazione più rapida e bozza conservata dopo l'annullamento | `components/feedback/FeedbackComponent.tsx:11`, `components/feedback/FeedbackPopover.tsx:26` |

Gli altri interventi della revisione sono stati ripristinati: ingresso della pagina, audio, tipografia, aspetto delle tab, panel, toast, callout e superfici. Le modifiche già presenti prima della revisione sono conservate.
