"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, CalendarDays, Download } from "lucide-react";
import { useRef } from "react";
import { HeroVisual } from "@/components/three/HeroVisual";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/data/site";

const ease = [0.25, 0.1, 0.25, 1] as const;

type SplitLettersProps = { text: string; delay: number; className?: string; letterClassName?: string };

// Pure-CSS letter rise: it plays as soon as the HTML paints, without waiting for JavaScript,
// so the name (the page's largest element) appears immediately.
function SplitLetters({ text, delay, className, letterClassName = "" }: SplitLettersProps) {
  return (
    <span aria-hidden="true" className={`flex justify-center overflow-hidden ${className ?? ""}`}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          // Gradient text must sit on each letter because the letters are transformed individually.
          className={`hero-letter inline-block ${letterClassName}`}
          style={{ animationDelay: `${delay + i * 0.04}s` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.8]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      aria-label="Introduction"
      className="grain relative flex h-svh min-h-[720px] flex-col overflow-x-clip pt-24 sm:pt-28"
    >
      {/* Ambient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[55%] h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.14)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <motion.div style={{ y: headingY, opacity: fade }} className="pointer-events-none relative z-10 px-3 sm:px-6">
        <div className="hero-fade" style={{ animationDelay: "0.1s" }}>
          <p className="mb-2 text-center font-display text-xs font-medium uppercase tracking-[0.45em] text-gold sm:text-sm">
            {site.title}
          </p>
        </div>
        <h1 className="font-display uppercase leading-[0.85] tracking-tight">
          <span className="sr-only">{site.name}</span>
          <SplitLetters
            text="Michael John"
            delay={0.15}
            className="font-semibold text-ivory [font-size:clamp(2.2rem,7.4vw,8.5rem)]"
          />
          <SplitLetters
            text="Buencamino"
            delay={0.35}
            className="whitespace-nowrap font-black [font-size:clamp(3rem,14vw,16rem)]"
            letterClassName="gold-text"
          />
        </h1>
      </motion.div>

      {/* 3D scene covers the whole hero so its effects (gold dust, shockwaves) use the full screen.
          Text layers above it ignore the pointer; only their links and buttons take clicks. */}
      <motion.div
        style={{ scale: visualScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
        className="absolute inset-0 z-0"
      >
        <HeroVisual />
      </motion.div>

      {/* Spacer that keeps the actions at the bottom; the orb is centered in this space. */}
      <div className="min-h-[260px] flex-1" aria-hidden="true" />

      <div className="pointer-events-none relative z-20 flex flex-col gap-6 px-5 pb-7 sm:px-8 sm:pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10 [&_a]:pointer-events-auto">
        <div className="hero-fade max-w-[300px] md:max-w-[340px]" style={{ animationDelay: "0.35s" }}>
          <p className="font-display font-light uppercase leading-snug tracking-wide text-mist [font-size:clamp(0.8rem,1.25vw,1.15rem)]">
            Building reliable CRM systems, automations, and integrations for US-based businesses.
          </p>
          <a
            href="#projects"
            className="focus-ring mt-5 hidden items-center gap-2 rounded-full font-display text-xs uppercase tracking-[0.3em] text-gold transition-colors hover:text-gold-light md:inline-flex"
          >
            <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" /> Scroll
          </a>
        </div>

        <div className="hero-fade flex flex-wrap gap-3 md:justify-end" style={{ animationDelay: "0.5s" }}>
          <Magnetic>
            <CtaLink href="#projects" icon={<ArrowUpRight className="size-4" />}>
              View Projects
            </CtaLink>
          </Magnetic>
          <Magnetic>
            <CtaLink href={site.resume} download={site.resumeFileName} variant="ghost" icon={<Download className="size-4" />}>
              Download Résumé
            </CtaLink>
          </Magnetic>
          <Magnetic>
            <CtaLink href={site.calendly} external variant="ghost" icon={<CalendarDays className="size-4" />}>
              Book a Call
            </CtaLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
