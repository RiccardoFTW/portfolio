"use client"

import Image from "next/image"
import { useState } from "react";
import ToggleButton from "../../ToggleButton";
import ExampleBracket from "../ExampleBracket";

export default function ConcentricCard() {
    const [showFinished, setShowFinished] = useState(false)
    const [isCorrected, setIsCorrected] = useState(false)

    const imageRadius = isCorrected ? "rounded-2xl" : "rounded-lg";

    return (
        <div className="space-y-6">
            <ExampleBracket label="Card" side="left" className="mx-auto w-full max-w-lg">
                <article
                    aria-label={showFinished ? undefined : "Wireframe di una card con immagine e testo"}
                    className="mx-auto grid w-full max-w-lg grid-cols-[minmax(98px,0.9fr)_minmax(0,1.1fr)] gap-2 rounded-3xl bg-surface p-2 ring-1 ring-demo-edge shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_0_oklch(0_0_0/0.04)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]"
                >
                    <div className={`relative aspect-4/3 overflow-hidden bg-inset inset-ring-1 inset-ring-demo-edge transition-[border-radius] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ${imageRadius} ${showFinished ? "outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10" : ""}`}>
                        {showFinished && (
                            <Image
                                src="/img/ship.webp"
                                alt="Nave in un mare in tempesta"
                                fill
                                sizes="(max-width: 448px) calc(100vw - 64px), 384px"
                                className="object-cover"
                            />
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-end px-2">
                        {showFinished ? (
                            <>
                                <h4 className="mt-2 text-xl font-medium text-foreground">
                                    Ship on Stormy Seas
                                </h4>

                                <p className="mt-0.5 text-sm leading-6 text-text">
                                    Ivan Aivazovsky
                                </p>
                            </>
                        ) : (
                            <div aria-hidden="true" className="flex flex-col gap-2 pb-1">
                                <span className="h-2 w-4/5 rounded-full bg-demo-edge" />
                                <span className="h-2 w-3/5 rounded-full bg-demo-edge" />
                            </div>
                        )}
                    </div>
                </article>
            </ExampleBracket>
            <div role="group" aria-label="Controlli della card" className="mx-auto flex w-full max-w-lg flex-col items-center gap-2">
                <ToggleButton
                    label="Componente finito della card"
                    annotation={{ text: "Rifinito", side: "left" }}
                    pressed={showFinished}
                    onPressedChange={setShowFinished}
                />
                <ToggleButton
                    label="Correggi il raggio della card"
                    annotation={{ text: "Corretto", side: "right" }}
                    pressed={isCorrected}
                    onPressedChange={setIsCorrected}
                />
            </div>
        </div>
    )
}
