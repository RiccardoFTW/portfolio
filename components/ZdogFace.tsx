"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "motion/react";
import Zdog from "zdog";

const LEFT_EYE = { x: -18, y: -12 };
const RIGHT_EYE = { x: 18, y: -12 };
const SMILE = { x: 0, y: 9 };
const MAX_EYE_OFFSET = 7;
const TRACKING_DISTANCE = 180;

export function ZdogFace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const eyeX = useSpring(targetX, {
    stiffness: 180,
    damping: 20,
    mass: 0.3,
  });
  const eyeY = useSpring(targetY, {
    stiffness: 180,
    damping: 20,
    mass: 0.3,
  });

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;
    const svgElement = svg;

    svgElement.replaceChildren();

    const illustration = new Zdog.Illustration({
      element: svgElement,
      zoom: 1.15,
      rotate: { x: -0.08, y: -0.12 },
    });

    const face = new Zdog.Anchor({ addTo: illustration });

    new Zdog.Shape({
      addTo: face,
      stroke: 88,
      color: "oklch(0.656 0.19 250.834)",
    });

    const leftEye = new Zdog.Shape({
      addTo: face,
      translate: { ...LEFT_EYE, z: 45 },
      stroke: 9,
      color: "var(--text-primary)",
    });

    const rightEye = new Zdog.Shape({
      addTo: face,
      translate: { ...RIGHT_EYE, z: 45 },
      stroke: 9,
      color: "var(--text-primary)",
    });

    const smile = new Zdog.Shape({
      addTo: face,
      translate: { ...SMILE, z: 46 },
      path: [
        { x: -18, y: 0 },
        { arc: [{ x: 0, y: 18 }, { x: 18, y: 0 }] },
      ],
      closed: false,
      stroke: 6,
      color: "var(--text-primary)",
    });

    illustration.updateRenderGraph();

    let animationFrame: number | null = null;
    let isTracking = false;
    let faceCenter = { x: 0, y: 0 };

    function renderExpression() {
      animationFrame = null;

      const offsetX = eyeX.get();
      const offsetY = eyeY.get();

      leftEye.translate.x = LEFT_EYE.x + offsetX;
      leftEye.translate.y = LEFT_EYE.y + offsetY;
      rightEye.translate.x = RIGHT_EYE.x + offsetX;
      rightEye.translate.y = RIGHT_EYE.y + offsetY;
      smile.translate.x = SMILE.x + offsetX;
      smile.translate.y = SMILE.y + offsetY;
      illustration.updateRenderGraph();
    }

    function scheduleRender() {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(renderExpression);
    }

    function resetEyes() {
      targetX.set(0);
      targetY.set(0);
    }

    function updateFaceCenter() {
      const bounds = svgElement.getBoundingClientRect();
      faceCenter = {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      };
    }

    function handlePointerMove(event: PointerEvent) {
      const deltaX = event.clientX - faceCenter.x;
      const deltaY = event.clientY - faceCenter.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance === 0) {
        resetEyes();
        return;
      }

      const strength = Math.min(distance / TRACKING_DISTANCE, 1);
      targetX.set((deltaX / distance) * strength * MAX_EYE_OFFSET);
      targetY.set((deltaY / distance) * strength * MAX_EYE_OFFSET);
    }

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    function syncTracking() {
      const shouldTrack = hoverQuery.matches && !reducedMotionQuery.matches;

      if (shouldTrack === isTracking) return;
      isTracking = shouldTrack;

      if (isTracking) {
        updateFaceCenter();
        window.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        window.addEventListener("resize", updateFaceCenter);
        window.addEventListener("blur", resetEyes);
        document.documentElement.addEventListener("pointerleave", resetEyes);
        return;
      }

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", updateFaceCenter);
      window.removeEventListener("blur", resetEyes);
      document.documentElement.removeEventListener("pointerleave", resetEyes);
      resetEyes();
    }

    const unsubscribeX = eyeX.on("change", scheduleRender);
    const unsubscribeY = eyeY.on("change", scheduleRender);

    hoverQuery.addEventListener("change", syncTracking);
    reducedMotionQuery.addEventListener("change", syncTracking);
    syncTracking();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", updateFaceCenter);
      window.removeEventListener("blur", resetEyes);
      document.documentElement.removeEventListener("pointerleave", resetEyes);
      hoverQuery.removeEventListener("change", syncTracking);
      reducedMotionQuery.removeEventListener("change", syncTracking);
      unsubscribeX();
      unsubscribeY();

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      svgElement.replaceChildren();
    };
  }, [eyeX, eyeY, targetX, targetY]);

  return (
    <svg
      ref={svgRef}
      width="144"
      height="144"
      className="size-full overflow-visible"
      viewBox="0 0 144 144"
      aria-hidden="true"
    />
  );
}
