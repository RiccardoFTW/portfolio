"use client";

import { useEffect, useRef } from "react";
import { createTazzina } from "../hairline/tazzina";
import styles from "../hairline/ChapterIllustration.module.css";

export default function OpticalAlignmentIntro() {
    const stageRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        const svg = svgRef.current;
        if (!stage || !svg) return;

        const figure = createTazzina(stage, svg);
        return () => figure.destroy();
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
        </div>
    );
}
