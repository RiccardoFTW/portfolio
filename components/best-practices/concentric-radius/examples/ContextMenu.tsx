"use client"

import { Activity, PcCase, FolderGit2, GitCommitHorizontal } from "lucide-react";
import ToggleButton from "../../ToggleButton";
import ExampleBracket from "../ExampleBracket";
import { useState } from "react";


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
                <div aria-hidden="true" className="flex flex-col gap-1 rounded-3xl bg-surface p-2 shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_0_oklch(0_0_0/0.04)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        const iconMotion = "col-start-1 row-start-1 size-4 transition-[opacity,filter,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-[opacity] motion-reduce:duration-200";
                        const enterDelay = showFinished ? `${index * 40}ms` : "0ms";

                        return (
                            <div
                                key={action.label}
                                className={`flex min-h-10 w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground [transition:background-color_150ms_ease,border-radius_200ms_cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-[background-color] ${itemRadius} ${action.preview
                                    ? "bg-inset"
                                    : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-inset"
                                    }`}
                            >
                                <span className="grid size-4 shrink-0 place-items-center">
                                    <Icon
                                        aria-hidden="true"
                                        strokeWidth={1.5}
                                        style={{ transitionDelay: enterDelay }}
                                        className={`${iconMotion} ${showFinished ? "scale-100 opacity-100 blur-none" : "scale-[0.95] opacity-0 blur-[2px]"}`}
                                    />
                                    <span
                                        style={{ transitionDelay: enterDelay }}
                                        className={`${iconMotion} rounded bg-border-strong ${showFinished ? "scale-[0.95] opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-none"}`}
                                    />
                                </span>
                                {showFinished ? (
                                    <span>{action.label}</span>
                                ) : (
                                    <span className={`h-2 rounded-full bg-border-strong ${action.wireframeWidth}`} />
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
