"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

/**
 * A section panel that unfolds from slightly inset to full width the first time it scrolls into view —
 * like a curtain opening. Rendered as a <section>; reduced-motion visitors see it already open.
 */
export function RevealPanel({ children, ...props }: HTMLMotionProps<"section">) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      {...props}
      initial={reduced ? false : { clipPath: "inset(7% 5% 0% 5% round 56px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{ duration: 1.2, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.section>
  );
}
