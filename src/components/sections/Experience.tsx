"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useRef } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education, experience } from "@/data/experience";

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative px-5 pb-8 pt-24 sm:px-8 md:px-10 md:pb-12 md:pt-32">
      <SectionHeading id="experience-title" eyebrow="Career progression" title="Experience" className="mb-16 md:mb-24" />

      <ol ref={ref} className="relative mx-auto max-w-5xl">
        {/* Timeline rail that fills with gold as you scroll. */}
        <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-gold/15 md:left-1/2">
          <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-gradient-to-b from-gold-light via-gold to-gold-deep" />
        </div>

        {experience.map((role, i) => {
          const right = i % 2 === 1;
          return (
            <li key={role.title + role.company} className="relative pb-12 pl-10 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 grid size-[23px] place-items-center rounded-full border border-gold/60 bg-ink md:left-1/2 md:-translate-x-1/2 ${
                  role.current ? "shadow-[0_0_20px_rgba(212,175,55,0.6)]" : ""
                }`}
              >
                <span className={`size-2 rounded-full ${role.current ? "bg-gold-light" : "bg-gold/50"}`} />
              </span>

              <FadeIn
                x={right ? 40 : -40}
                y={0}
                className={`${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
              >
                <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">{role.period}</p>
                <h3 className="mt-2 font-display text-xl font-semibold uppercase leading-tight text-ivory sm:text-2xl">{role.title}</h3>
                <p className="mt-1 text-mist">{role.company}</p>
                <ul className={`mt-4 flex flex-col gap-2 text-sm leading-relaxed text-mist/80 sm:text-[0.95rem] ${right ? "" : "md:items-end"}`}>
                  {role.points.map((point) => (
                    <li key={point} className={`flex gap-3 ${right ? "" : "md:flex-row-reverse"}`}>
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold/70" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {role.partners && (
                  <div className={`mt-5 flex flex-wrap gap-2 ${right ? "" : "md:justify-end"}`}>
                    <span className="w-full text-[0.65rem] uppercase tracking-[0.3em] text-gold/70">Partner organizations</span>
                    {role.partners.map((p) => (
                      <span key={p} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-light">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </FadeIn>
            </li>
          );
        })}
      </ol>

      {/* Centered under the timeline rail, sitting midway between it and the next section. */}
      <FadeIn className="relative mx-auto mt-20 flex max-w-3xl flex-col items-center overflow-hidden rounded-[40px] border border-gold/30 bg-gradient-to-b from-ink-3 to-ink-2 px-8 py-12 text-center shadow-[0_40px_100px_-50px_rgba(212,175,55,0.55)] sm:px-12 md:mt-32 md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.25),transparent_70%)]"
        />
        <span className="relative grid size-16 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold">
          <GraduationCap className="size-8" aria-hidden="true" />
        </span>
        <p className="relative mt-6 font-display text-xs uppercase tracking-[0.4em] text-gold sm:text-sm">Education · {education.period}</p>
        <h3 className="relative mt-3 font-display font-semibold uppercase leading-tight text-ivory [font-size:clamp(1.5rem,3.2vw,2.6rem)]">
          {education.school}
        </h3>
        <p className="relative mt-2 text-mist sm:text-lg">{education.program}</p>
      </FadeIn>
    </section>
  );
}
