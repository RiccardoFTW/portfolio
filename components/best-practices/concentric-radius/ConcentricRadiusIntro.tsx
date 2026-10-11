"use client";

import { useEffect, useRef } from "react";
import { createPista } from "../hairline/pista";
import styles from "../hairline/ChapterIllustration.module.css";

export default function ConcentricRadiusIntro() {
    const stageRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        const svg = svgRef.current;
        if (!stage || !svg) return;

        const figure = createPista(stage, svg);
        return () => figure.destroy();
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
        </div>
    );
}
