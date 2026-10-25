"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import type { Screenshot } from "@/data/projects";

const AUTO_ADVANCE_MS = 4500;

/** Real work screenshots: auto-advances while visible, thumbnails to jump, click to enlarge. */
export function ScreenshotGallery({ images, label }: { images: Screenshot[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [viewer, setViewer] = useState<number | null>(null);
  const multiple = images.length > 1;

  useEffect(() => {
    if (!multiple || !inView || paused || reduced || viewer !== null) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % images.length), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [index, multiple, inView, paused, reduced, viewer, images.length]);

  // Keep the active thumbnail in view without scrolling the page.
  useEffect(() => {
    const strip = thumbs.current;
    const active = strip?.children[index] as HTMLElement | undefined;
    if (strip && active) strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const image = images[index];

  return (
    <figure
      ref={ref}
      aria-label={`${label} screenshots`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative flex h-full flex-col gap-3 overflow-hidden rounded-[28px] border border-gold/20 bg-[linear-gradient(180deg,#151311,#0c0b0a)] p-3 sm:rounded-[36px] sm:p-4"
    >
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-ink-3 sm:rounded-[26px]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.button
            key={image.src}
            type="button"
            onClick={() => setViewer(index)}
            aria-label={`Enlarge screenshot: ${image.alt}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="focus-ring absolute inset-0 cursor-zoom-in"
          >
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
          </motion.button>
        </AnimatePresence>

        <span className="pointer-events-none absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/80 text-gold-light opacity-0 transition-opacity group-hover:opacity-100">
          <Expand className="size-4" aria-hidden="true" />
        </span>

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screenshot"
              className="focus-ring absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/85 text-gold-light transition hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screenshot"
              className="focus-ring absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/85 text-gold-light transition hover:bg-gold hover:text-ink"
            >
              <ChevronRight className="size-4" />
            </button>
            {/* Progress bar for the auto-advance timer. */}
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-gold/15">
              {!paused && !reduced && inView && viewer === null && (
                <motion.span
                  key={index}
                  className="block h-full origin-left bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                />
              )}
            </span>
          </>
        )}
      </div>

      <figcaption className="flex items-start justify-between gap-3 px-1 text-xs leading-relaxed text-mist/80">
        <span aria-live="polite">{image.alt}</span>
        <span className="shrink-0 font-display uppercase tracking-[0.25em] text-gold">
          {index + 1}/{images.length}
        </span>
      </figcaption>

      {multiple && (
        <div ref={thumbs} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`focus-ring relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition ${
                i === index ? "border-gold opacity-100" : "border-gold/15 opacity-50 hover:opacity-90"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      <Lightbox images={images} index={viewer} onClose={() => setViewer(null)} onIndexChange={setViewer} />
    </figure>
  );
}
