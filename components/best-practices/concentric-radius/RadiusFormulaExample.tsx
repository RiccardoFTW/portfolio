"use client";

import { useState } from "react";
import { DemoSurface } from "../article";
import ToggleButton from "../ToggleButton";

const INNER_RADIUS = 12;
const GAP = 8;
const CORRECT_OUTER_RADIUS = INNER_RADIUS + GAP;

export default function RadiusFormulaExample() {
    const [isCorrected, setIsCorrected] = useState(false);
    const outerRadius = isCorrected ? CORRECT_OUTER_RADIUS : INNER_RADIUS;

    return (
        <DemoSurface as="figure" className="px-4 pt-5 pb-8">
            <div className="flex min-h-56 items-center justify-center">
                <div
                    role="img"
                    aria-label={`Contenitore con raggio esterno di ${outerRadius} pixel, spazio di ${GAP} pixel e raggio interno di ${INNER_RADIUS} pixel`}
                    className="size-36 bg-inset p-2 ring-1 ring-demo-edge transition-[border-radius] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
                    style={{ borderRadius: outerRadius }}
                >
                    <div className="size-full rounded-xl bg-surface inset-ring-1 inset-ring-demo-edge" />
                </div>
            </div>
            <div className="flex justify-center pt-4">
                <ToggleButton
                    label="Applica la formula"
                    annotation={{ text: "Applica la formula", side: "right" }}
                    pressed={isCorrected}
                    onPressedChange={setIsCorrected}
                />
            </div>
        </DemoSurface>
    );
}
