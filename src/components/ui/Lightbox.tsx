"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Screenshot } from "@/data/projects";

type LightboxProps = {
  images: Screenshot[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** Full-screen screenshot viewer: Esc closes, arrow keys browse, focus returns on close. */
export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(((index ?? 0) + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange(((index ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, index, images.length, onClose, onIndexChange]);

  // Only portal while open, so server and first client render agree (both render nothing).
  if (!open) return null;
  const image = images[index];

  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4 text-sm text-mist">
            <span className="font-display uppercase tracking-[0.3em] text-gold">
              {(index ?? 0) + 1} / {images.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close screenshot viewer"
              className="focus-ring grid size-11 place-items-center rounded-full border border-gold/40 text-gold-light transition-colors hover:bg-gold hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative size-full"
            >
              <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onIndexChange(((index ?? 0) - 1 + images.length) % images.length)}
                  aria-label="Previous screenshot"
                  className="focus-ring absolute left-2 grid size-11 place-items-center rounded-full border border-gold/40 bg-ink/80 text-gold-light transition-colors hover:bg-gold hover:text-ink sm:left-4"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onIndexChange(((index ?? 0) + 1) % images.length)}
                  aria-label="Next screenshot"
                  className="focus-ring absolute right-2 grid size-11 place-items-center rounded-full border border-gold/40 bg-ink/80 text-gold-light transition-colors hover:bg-gold hover:text-ink sm:right-4"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>

          <p className="px-5 py-4 text-center text-sm text-mist" onClick={(e) => e.stopPropagation()}>
            {image.alt}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
