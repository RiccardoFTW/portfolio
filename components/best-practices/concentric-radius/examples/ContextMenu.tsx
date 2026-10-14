"use client"

import { Activity, PcCase, FolderGit2, GitCommitHorizontal } from "lucide-react";
import ToggleButton from "../../ToggleButton";
import ExampleBracket from "../ExampleBracket";
import { useState } from "react";
import { IconSwap } from "@/components/IconSwap";
import { pageBodyClass } from "@/components/pageStyle";


const actions = [
    { label: "Attività", icon: Activity, preview: true, wireframeWidth: "w-16" },
    { label: "Locale", icon: PcCase, preview: false, wireframeWidth: "w-14" },
    { label: "main", icon: FolderGit2, preview: false, wireframeWidth: "w-12" },
    { label: "Esegui commit o push", icon: GitCommitHorizontal, preview: false, wireframeWidth: "w-28" },
];

export default function ContextMenu() {
    const [showFinished, setShowFinished] = useState(false);
    const [isCorrected, setIsCorrected] = useState(false);
    const itemRadius = isCorrected ? "rounded-2xl" : "rounded-lg";
    return (
        <div className="mx-auto w-full max-w-xs space-y-6">
            <ExampleBracket label="Context menu" side="right">
                <div aria-hidden="true" className="flex flex-col gap-1 rounded-3xl bg-surface p-2 ring-1 ring-demo-edge shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_0_oklch(0_0_0/0.04)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]">
                    {actions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <div
                                key={action.label}
                                className={`flex min-h-10 w-full items-center gap-3 px-3 py-2.5 ${pageBodyClass} text-foreground [transition:background-color_150ms_ease,border-radius_200ms_cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-[background-color] ${itemRadius} ${action.preview
                                    ? "bg-inset inset-ring-1 inset-ring-demo-edge"
                                    : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-inset"
                                    }`}
                            >
                                <IconSwap
                                    active={showFinished}
                                    first={<span className="block size-4 rounded bg-demo-edge" />}
                                    second={<Icon strokeWidth={1.5} className="size-4" />}
                                />
                                {showFinished ? (
                                    <span>{action.label}</span>
                                ) : (
                                    <span className={`h-2 rounded-full bg-demo-edge ${action.wireframeWidth}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </ExampleBracket>

            <div role="group" aria-label="Controlli del context menu" className="flex flex-col items-center gap-2">
                <ToggleButton
                    label="Componente finito del menu"
                    annotation={{ text: "Rifinito", side: "right" }}
                    pressed={showFinished}
                    onPressedChange={setShowFinished}
                />
                <ToggleButton
                    label="Correggi il raggio del menu"
                    annotation={{ text: "Corretto", side: "left" }}
                    pressed={isCorrected}
                    onPressedChange={setIsCorrected}
                />
            </div>
        </div>
    );
}
