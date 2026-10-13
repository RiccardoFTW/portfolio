'use client'

import ToggleButton from "../ToggleButton"
import { DemoSurface } from "../article"
import { useState } from "react"

export default function IconAlignment() {
    const [isRefined, setIsRefined] = useState(false)
    const [showGuides, setShowGuides] = useState(false)

    const leftPadding = isRefined ? 30 : 26
    const rightPadding = isRefined ? 22 : 26

    const padding = isRefined ? "pl-[30px] pr-[22px]" : "px-[26px]"
    return (
        <figure className="mb-16">
            <DemoSurface>
                <div className="px-4 pt-11.5 pb-11">
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex min-h-60 flex-col items-center justify-center gap-5 p-5">
                            <div className="relative w-fit">
                                <span className="absolute right-full top-1/2 mr-4 -translate-y-1/2 whitespace-nowrap font-mono text-[20px] font-medium leading-none tabular-nums tracking-[-0.01em] text-accent-ink">
                                    {leftPadding}<span className="ml-1 text-[11px] font-medium text-stone-500 dark:text-stone-400">px</span>
                                </span>

                                <span className="absolute left-full top-1/2 ml-4 -translate-y-1/2 whitespace-nowrap font-mono text-[20px] font-medium leading-none tabular-nums tracking-[-0.01em] text-accent-ink">
                                    {rightPadding}<span className="ml-1 text-[11px] font-medium text-stone-500 dark:text-stone-400">px</span>
                                </span>
                                <div
                                    role="img"
                                    aria-label={
                                        `Pulsante Publish con ${isRefined
                                            ? "padding ottico: 30 pixel a sinistra e 22 a destra"
                                            : "padding simmetrico di 26 pixel per lato"}`
                                    }
                                    className={`relative flex min-h-17 w-full max-w-72 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-stone-900 ${padding} py-4.5 text-white [transition:padding_200ms_cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none dark:bg-stone-100 dark:text-stone-900`}
                                >
                                    <div
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute top-4.5 bottom-4.5 left-0 [transition:width_200ms_cubic-bezier(0.77,0,0.175,1),opacity_150ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transition:opacity_150ms_cubic-bezier(0.23,1,0.32,1)] ${showGuides ? "opacity-100" : "opacity-0"}`}
                                        style={{
                                            width: isRefined ? "30px" : "26px",
                                            backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
                                        }}
                                    />
                                    <div
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute top-[18px] bottom-[18px] right-0 [transition:width_200ms_cubic-bezier(0.77,0,0.175,1),opacity_150ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transition:opacity_150ms_cubic-bezier(0.23,1,0.32,1)] ${showGuides ? "opacity-100" : "opacity-0"}`}
                                        style={{
                                            width: isRefined ? "22px" : "26px",
                                            backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
                                        }}
                                    />
                                    <span className="text-2xl font-medium">Publish</span>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-6 shrink-0"
                                    >
                                        <path d="M3.11363 6.1782C2.44868 4.07252 4.64057 2.20178 6.61562 3.18931L19.7647 9.76383C21.6073 10.6851 21.6073 13.3147 19.7647 14.236L6.61562 20.8105C4.64056 21.798 2.44868 19.9273 3.11363 17.8216L4.63624 13H9.00076C9.55304 13 10.0008 12.5523 10.0008 12C10.0008 11.4477 9.55304 11 9.00076 11H4.63631L3.11363 6.1782Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="group" aria-label="Controlli del pulsante Publish" className="flex flex-col items-center gap-6 pt-1.5">
                        <ToggleButton
                            label="Rifinisci l’allineamento del pulsante Publish"
                            annotation={{ text: "Allineato", side: "left" }}
                            pressed={isRefined}
                            onPressedChange={setIsRefined}
                        />
                        <ToggleButton
                            label="Guide del padding del pulsante Publish"
                            annotation={{ text: "Guide", side: "right" }}
                            pressed={showGuides}
                            onPressedChange={setShowGuides}
                        />
                    </div>
                </div>
            </DemoSurface>
            <figcaption className="sr-only" aria-live="polite">
                Pulsante Publish. Il padding è {isRefined ? "30 pixel a sinistra e 22 a destra" : "26 pixel per lato"}.
                {showGuides && " Le guide mostrano le due fasce di padding."}
            </figcaption>
        </figure>
    )
}
