"use client";

import { useState } from "react";
import { Bookmark, House, Search, Settings } from "lucide-react";
import ToggleButton from "../ToggleButton";
import { DemoSurface } from "../article";

const navigationItems = [
    { label: "Home", Icon: House, offsetX: 1 },
    { label: "Cerca", Icon: Search, offsetX: -1 },
    { label: "Salvati", Icon: Bookmark, offsetX: -1 },
    { label: "Impostazioni", Icon: Settings, offsetX: -1 },
] as const;

const unrefinedYOffset = 2;
const unrefinedLabelYOffset = 4;

export default function SidebarAlignment() {
    const [isRefined, setIsRefined] = useState(false);
    const [showGuides, setShowGuides] = useState(false);
    const guideVisibility = showGuides ? "opacity-100" : "opacity-0";
    const guideBoxClass = showGuides
        ? "bg-article-accent-tint inset-ring-1 inset-ring-article-accent"
        : "bg-transparent inset-ring-1 inset-ring-transparent";

    return (
        <figure className="mb-16">
            <DemoSurface className="relative">
                <div aria-hidden="true" className="relative h-[340px] overflow-hidden rounded-t-2xl sm:h-[380px]">
                    <div className="absolute left-[42%] top-8 h-full w-[calc(100%+8rem)] rounded-[32px] bg-surface shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_0_oklch(0_0_0/0.04)] sm:left-[41%] sm:top-12 sm:w-[calc(100%+10rem)] dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]">
                        <div className="w-52 pl-4 pt-8 sm:w-72 sm:pl-8 sm:pt-9">
                            <div className="relative grid gap-2">
                                {navigationItems.map(({ label, Icon, offsetX }) => (
                                    <div
                                        key={label}
                                        className="relative grid min-h-11 grid-cols-[20px_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 font-sans text-lg leading-6 font-medium text-foreground"
                                    >
                                        <span
                                            className={`relative grid size-5 place-items-center [transition:transform_200ms_cubic-bezier(0.77,0,0.175,1),background-color_150ms_ease,box-shadow_150ms_ease] motion-reduce:[transition:background-color_150ms_ease,box-shadow_150ms_ease] ${guideBoxClass}`}
                                            style={{
                                                transform: isRefined
                                                    ? "translate(0, 0)"
                                                    : `translate(${offsetX}px, ${unrefinedYOffset}px)`,
                                            }}
                                        >
                                            <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
                                        </span>
                                        <span
                                            className={`relative flex h-5 w-fit max-w-full items-center truncate leading-5 [transition:transform_200ms_cubic-bezier(0.77,0,0.175,1),background-color_150ms_ease,box-shadow_150ms_ease] motion-reduce:[transition:background-color_150ms_ease,box-shadow_150ms_ease] ${guideBoxClass}`}
                                            style={{ transform: isRefined ? "translateY(0)" : `translateY(${unrefinedLabelYOffset}px)` }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`pointer-events-none absolute inset-x-0 top-[64px] z-10 grid gap-2 [transition:opacity_150ms_cubic-bezier(0.23,1,0.32,1)] sm:top-[84px] ${guideVisibility}`}>
                        {navigationItems.map(({ label }) => (
                            <div key={label} className="relative h-11">
                                <span className="absolute inset-x-0 top-3 h-5 border-y border-accent-ink" />
                            </div>
                        ))}
                    </div>
                    <div
                        className={`pointer-events-none absolute inset-y-0 left-[42%] z-20 w-0 [transition:opacity_150ms_cubic-bezier(0.23,1,0.32,1)] sm:left-[41%] ${guideVisibility}`}
                    >
                        <span className="absolute inset-y-0 left-[28px] w-px bg-accent-ink sm:left-[44px]" />
                        <span className="absolute inset-y-0 left-[38px] w-px bg-accent-ink sm:left-[54px]" />
                        <span className="absolute inset-y-0 left-[48px] w-px bg-accent-ink sm:left-[64px]" />
                        <span className="absolute inset-y-0 left-[60px] w-px bg-accent-ink sm:left-[76px]" />
                    </div>
                </div>
                <div role="group" aria-label="Controlli della sidebar" className="flex flex-col items-center gap-6 pb-11 pt-4">
                    <ToggleButton
                        label="Rifinisci l’allineamento della sidebar"
                        annotation={{ text: "Allineato", side: "left" }}
                        pressed={isRefined}
                        onPressedChange={setIsRefined}
                    />
                    <ToggleButton
                        label="Guide della sidebar"
                        annotation={{ text: "Guide", side: "right" }}
                        pressed={showGuides}
                        onPressedChange={setShowGuides}
                    />
                </div>
            </DemoSurface>
            <figcaption className="sr-only" aria-live="polite">
                {isRefined
                    ? "Le quattro icone condividono la stessa colonna e icone ed etichette sono centrate nelle rispettive righe."
                    : "Le icone sono leggermente basse e sfalsate lateralmente; anche le etichette sono più in basso rispetto al centro delle righe."}
                {showGuides && " Le guide delimitano i box di icone ed etichette, entrambi alti 20 pixel, e segnano la colonna delle icone."}
            </figcaption>
        </figure>
    );
}
