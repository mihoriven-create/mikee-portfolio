"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useMediaQuery } from "./useMediaQuery";

const MAX_TILT = 7; // degrees

/**
 * Tilts its content in 3D toward the cursor with a soft light glare, like turning a print in your hand.
 * Mouse/trackpad only: on touch screens and for reduced-motion visitors it renders flat.
 */
export function TiltPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const springy = { stiffness: 160, damping: 18, mass: 0.4 };
  const rotateX = useSpring(0, springy);
  const rotateY = useSpring(0, springy);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(255, 240, 200, 0.16), transparent 45%)`;

  if (reduced || !finePointer) return <div className={`h-full ${className}`}>{children}</div>;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * MAX_TILT);
    rotateX.set(-(py - 0.5) * 2 * MAX_TILT * 0.8);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={`relative h-full will-change-transform ${className}`}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={{ background: glare, opacity: glareOpacity }}
        className="pointer-events-none absolute inset-0 rounded-[28px] mix-blend-screen sm:rounded-[36px]"
      />
    </motion.div>
  );
}
