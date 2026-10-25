"use client";

import { Expand, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Lightbox } from "@/components/ui/Lightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { clients, workSamples } from "@/data/testimonials";

const sampleImages = workSamples.map((s) => s.screenshot);

export function Testimonials() {
  const [viewer, setViewer] = useState<number | null>(null);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative overflow-x-clip px-5 py-24 sm:px-8 md:px-10 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.09),transparent_60%)]"
      />
      <SectionHeading id="testimonials-title" title="Professional Feedback" className="mb-14 md:mb-20" />

      <div className="relative mx-auto max-w-6xl">
        <ul className="grid gap-5 md:grid-cols-3">
          {clients.map((c, i) => (
            <FadeIn as="li" key={c.author} delay={i * 0.1}>
              <figure
                className={`group relative flex h-full flex-col items-center overflow-hidden rounded-[32px] border bg-gradient-to-b from-ink-3 to-ink p-8 text-center transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold/60 ${
                  c.quote ? "border-gold/40 shadow-[0_30px_80px_-40px_rgba(212,175,55,0.5)]" : "border-gold/20"
                }`}
              >
                <span className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-gold/40">
                  <Image src={c.logo} alt={`${c.company} logo`} width={64} height={64} className="size-full object-contain" />
                </span>
                <figcaption className="mt-5">
                  <span className="block font-display text-xl font-semibold uppercase tracking-wider text-gold-light">{c.author}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-mist/70">
                    {c.role && `${c.role} · `}
                    {c.company}
                  </span>
                  {c.current && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold-light">
                      <span className="size-1.5 rounded-full bg-gold-light" aria-hidden="true" /> Current client
                    </span>
                  )}
                </figcaption>
                {c.quote ? (
                  <>
                    <Quote aria-hidden="true" className="mt-6 size-8 text-gold/80" />
                    <blockquote className="mt-4 font-display font-light leading-relaxed text-ivory [font-size:clamp(0.95rem,1.2vw,1.05rem)]">
                      “{c.quote}”
                    </blockquote>
                  </>
                ) : (
                  <div className="mt-6 flex flex-1 flex-col items-center">
                    {c.scope && (
                      <>
                        <span className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold/80">Scope of work</span>
                        <p className="mt-3 leading-relaxed text-ivory/85 [font-size:clamp(0.95rem,1.3vw,1.05rem)]">{c.scope}</p>
                      </>
                    )}
                    <p className="mt-auto pt-6 text-xs italic text-mist/60">Testimonial coming soon</p>
                  </div>
                )}
              </figure>
            </FadeIn>
          ))}
        </ul>

        <FadeIn>
          <div className="mx-auto mb-10 mt-20 max-w-2xl text-center md:mt-28">
            <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-ivory sm:text-3xl">Work samples &amp; feedback</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
              Messages, project updates, and troubleshooting discussions with clients, partners, and team members across CRM, automation, and operations work.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-2">
          {workSamples.map((sample, i) => (
            <FadeIn key={sample.author} delay={(i % 2) * 0.12}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-gold/20 bg-gradient-to-b from-ink-3 to-ink transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold/50">
                <button
                  type="button"
                  onClick={() => setViewer(i)}
                  aria-label={`Enlarge screenshot: ${sample.screenshot.alt}`}
                  className="focus-ring relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-[#1a1d21]"
                >
                  <Image
                    src={sample.screenshot.src}
                    alt={sample.screenshot.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-3 transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/80 text-gold-light opacity-0 transition-opacity group-hover:opacity-100">
                    <Expand className="size-4" aria-hidden="true" />
                  </span>
                </button>
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                  <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">{sample.title}</p>
                  {sample.quote && (
                    <blockquote className="font-display font-light leading-relaxed text-ivory [font-size:clamp(1rem,1.5vw,1.2rem)]">“{sample.quote}”</blockquote>
                  )}
                  <p className="mt-auto flex items-center gap-3 font-display font-semibold uppercase tracking-wider text-gold-light">
                    <span className="h-px w-8 bg-gold" aria-hidden="true" />
                    {sample.author}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>

      <Lightbox images={sampleImages} index={viewer} onClose={() => setViewer(null)} onIndexChange={setViewer} />
    </section>
  );
}
