"use client";

import { useEffect, useRef } from "react";
import { createTazzina } from "../hairline/tazzina";
import styles from "../hairline/ChapterIllustration.module.css";
import { createTazzinaLiquid } from "./tazzinaLiquid";

export default function OpticalAlignmentIntro() {
    const stageRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        const svg = svgRef.current;
        const canvas = canvasRef.current;
        if (!stage || !svg || !canvas) return;

        const liquid = createTazzinaLiquid(stage, canvas);
        const figure = createTazzina(stage, svg, liquid ?? undefined);
        return () => {
            figure.destroy();
            liquid?.destroy();
        };
    }, []);

    return (
        <div
            id="optical-alignment-intro"
            ref={stageRef}
            aria-hidden="true"
            data-hairline="tazzina"
            className={`${styles.illustration} relative mx-auto aspect-[5/4] w-full max-w-80`}
        >
            <svg
                ref={svgRef}
                viewBox="0 0 400 320"
                className="absolute inset-0 size-full"
            />
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 size-full"
            />
        </div>
    );
}
