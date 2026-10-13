"use client";

import { useId, useState } from "react";

type RadiusControlProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
};

function RadiusControl({ label, value, min, max, onChange }: RadiusControlProps) {
    const id = useId();

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm text-text">
                <label htmlFor={id}>{label}</label>
                <output htmlFor={id} className="font-mono text-xs tabular-nums text-foreground">
                    {value}px
                </output>
            </div>
            <input
                id={id}
                className="w-full accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(event) => onChange(Number(event.currentTarget.value))}
            />
        </div>
    );
}

export default function RadiusPlayground() {
    const [outerRadius, setOuterRadius] = useState(32);
    const [innerRadius, setInnerRadius] = useState(20);
    const [inset, setInset] = useState(12);
    const expectedInnerRadius = Math.max(outerRadius - inset, 0);
    const isConcentric = innerRadius === expectedInnerRadius;

    return (
        <figure className="space-y-6 rounded-3xl bg-surface p-4 shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06),0_2px_4px_0_oklch(0_0_0/0.04)] sm:p-5 dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div className="flex min-h-56 items-center justify-center px-2 py-5">
                    <div
                        aria-hidden="true"
                        className="h-52 w-full max-w-72 bg-accent-tint ring-1 ring-border"
                        style={{ borderRadius: outerRadius, padding: inset }}
                    >
                        <div
                            className="h-full min-h-36 w-full bg-surface ring-1 ring-border"
                            style={{ borderRadius: innerRadius }}
                        />
                    </div>
                </div>

                <fieldset className="min-w-0 space-y-6 border-0 p-0">
                    <legend className="text-sm font-medium text-heading">
                        Regola i tre valori
                    </legend>
                    <div className="grid gap-6">
                        <RadiusControl
                            label="Raggio esterno"
                            value={outerRadius}
                            min={0}
                            max={48}
                            onChange={setOuterRadius}
                        />
                        <RadiusControl
                            label="Raggio interno"
                            value={innerRadius}
                            min={0}
                            max={48}
                            onChange={setInnerRadius}
                        />
                        <RadiusControl
                            label="Padding"
                            value={inset}
                            min={0}
                            max={28}
                            onChange={setInset}
                        />
                    </div>
                    <p role="status" className={`text-sm leading-6 ${isConcentric ? "text-success" : "text-danger"}`}>
                        {isConcentric
                            ? "Le curve sono concentriche."
                            : `Per renderle concentriche, imposta il raggio interno a ${expectedInnerRadius}px.`}
                    </p>
                </fieldset>
            </div>

            <figcaption className="border-t border-border pt-6 text-sm leading-6 text-text">
                <span className="font-medium text-foreground">r = max(R − p, 0).</span> Qui il contenitore non ha un bordo, quindi il padding coincide con lo spazio tra gli elementi.
            </figcaption>
        </figure>
    );
}
