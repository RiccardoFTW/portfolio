"use client";

import { useEffect, useRef } from "react";
import { createPista } from "../hairline/pista";
import styles from "../hairline/ChapterIllustration.module.css";
import { createPistaRunners } from "./pistaRunners";

export default function ConcentricRadiusIntro() {
    const stageRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        const svg = svgRef.current;
        const canvas = canvasRef.current;
        if (!stage || !svg || !canvas) return;

        const runners = createPistaRunners(stage, canvas);
        const figure = createPista(stage, svg, runners ?? undefined);
        return () => {
            figure.destroy();
            runners?.destroy();
        };
    }, []);

    return (
        <div
            id="concentric-radius-intro"
            ref={stageRef}
            aria-hidden="true"
            data-hairline="pista"
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
