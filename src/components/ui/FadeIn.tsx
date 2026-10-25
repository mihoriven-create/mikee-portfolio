"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  as?: "div" | "section" | "li" | "p" | "span" | "article" | "header";
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
};

const elements = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  article: motion.article,
  header: motion.header,
};

export function FadeIn({ children, as = "div", delay = 0, duration = 0.7, x = 0, y = 30, className }: FadeInProps) {
  const Component = elements[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}
