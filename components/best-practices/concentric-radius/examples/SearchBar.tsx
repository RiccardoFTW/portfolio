'use client'

import { Search } from "lucide-react";
import ToggleButton from "../../ToggleButton";
import ExampleBracket from "../ExampleBracket";
import { useState } from "react";
import { IconSwap } from "@/components/IconSwap";


export default function SearchBar() {
    const [showFinished, setShowFinished] = useState(false)
    const [isCorrected, setIsCorrected] = useState(false)
    const buttonRadius = isCorrected ? "rounded-2xl" : "rounded-lg";
    return (
        <div className="space-y-6">
            <ExampleBracket label="Searchbar" side="left" className="mx-auto w-full max-w-lg">
                <div
                    aria-hidden="true"
                    className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-3xl bg-surface p-2 ring-1 ring-demo-edge shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_0_oklch(0_0_0/0.04)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]"
                >
                    <span className="min-w-0 flex-1 px-3 py-2 text-sm text-text">
                        {showFinished ? "Cerca un progetto..." : (
                            <span className="block h-2 w-36 max-w-full rounded-full bg-demo-edge" />
                        )}
                    </span>

                    <span
                        className={`grid size-10 shrink-0 place-items-center ${buttonRadius} bg-inset inset-ring-1 inset-ring-demo-edge text-foreground transition-[border-radius] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none`}
                    >
                        <IconSwap
                            active={showFinished}
                            first={<span className="block size-4 rounded bg-demo-edge" />}
                            second={<Search strokeWidth={1.5} className="size-4" />}
                        />
                    </span>
                </div>
            </ExampleBracket>
            <div role="group" aria-label="Controlli della searchbar" className="flex flex-col items-center gap-2">
                <ToggleButton
                    label="Componente finito della barra di ricerca"
                    annotation={{ text: "Rifinito", side: "left" }}
                    pressed={showFinished}
                    onPressedChange={setShowFinished}
                />
                <ToggleButton
                    label="Correggi il raggio della barra di ricerca"
                    annotation={{ text: "Corretto", side: "right" }}
                    pressed={isCorrected}
                    onPressedChange={setIsCorrected}
                />
            </div>
        </div>
    );
}
