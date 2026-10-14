"use client"

import { useEffect, useRef, useState } from "react"
import { TransitionText } from "@/components/TransitionText"

type SaveState = "idle" | "loading" | "success"

const SAVE_DELAY = 900

export function ButtonStateDemo() {
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [isPointerPressed, setIsPointerPressed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleSave() {
    if (saveState !== "idle") return

    setIsPointerPressed(false)
    setSaveState("loading")
    timeoutRef.current = setTimeout(() => {
      setSaveState("success")
      timeoutRef.current = null
    }, SAVE_DELAY)
  }

  function handleReset() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsPointerPressed(false)
    setSaveState("idle")
  }

  const isLoading = saveState === "loading"
  const isSuccess = saveState === "success"
  const label = isLoading ? "Salvataggio…" : isSuccess ? "Modifiche salvate" : "Salva modifiche"
  const announcement = isLoading
    ? "Salvataggio in corso"
    : isSuccess
      ? "Modifiche salvate"
      : ""

  return (
    <section
      aria-labelledby="button-demo-title"
      className="rounded-3xl bg-black/[0.025] p-5 shadow-[0_0_0_1px_color-mix(in_oklab,var(--border),transparent_25%)] sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 id="button-demo-title" className="font-medium text-(--text)">
            Prova la sequenza
          </h3>
          <p className="mt-1 text-sm text-(--text)">
            Un&apos;azione asincrona simulata: l&apos;interfaccia conferma subito cosa sta accadendo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-label={label}
            disabled={isLoading}
            onClick={handleSave}
            onPointerDown={() => setIsPointerPressed(true)}
            onPointerUp={() => setIsPointerPressed(false)}
            onPointerCancel={() => setIsPointerPressed(false)}
            onPointerLeave={() => setIsPointerPressed(false)}
            className={`min-h-11 min-w-44 rounded-full bg-(--accent) px-5 py-2.5 text-sm font-medium text-white outline-none transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas) pointer-fine:hover:brightness-95 disabled:cursor-wait disabled:opacity-70 ${isPointerPressed ? "scale-[0.97]" : "scale-100"}`}
          >
            <TransitionText text={label} />
          </button>

          {isSuccess ? (
            <button
              type="button"
              onClick={handleReset}
              className="min-h-11 rounded-full px-3 text-sm font-medium text-(--accent) underline decoration-1 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas) pointer-fine:hover:text-(--text)"
            >
              Riprova
            </button>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-(--text)">
        {announcement || "Pronto a salvare le modifiche."}
      </p>
    </section>
  )
}
