"use client";

import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, CircleDot, Hammer } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { useMediaQuery } from "@/components/ui/useMediaQuery";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { ScreenshotGallery } from "@/components/visuals/ScreenshotGallery";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function StatusBadge({ status }: { status: NonNullable<Project["status"]> }) {
  const done = status === "Implemented";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[0.65rem] font-medium uppercase tracking-[0.2em] ${
        done ? "border-gold/50 bg-gold/10 text-gold-light" : "border-mist/30 bg-mist/5 text-mist"
      }`}
    >
      {done ? <CircleDot className="size-3" aria-hidden="true" /> : <Hammer className="size-3" aria-hidden="true" />}
      {status}
    </span>
  );
}

export function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const [tab, setTab] = useState(0);
  const baseId = useId();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  // Cards only stack (sticky + scale) where the whole card fits on screen; elsewhere they flow normally.
  const stacked = useMediaQuery("(min-width: 768px) and (min-height: 760px)");

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (tab + (e.key === "ArrowRight" ? 1 : -1) + project.steps.length) % project.steps.length;
    setTab(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  const step = project.steps[tab];

  return (
    <div className={stacked ? "sticky top-24 flex h-[88vh] items-start lg:top-28" : ""}>
      <motion.article
        aria-labelledby={`${baseId}-title`}
        style={stacked ? { scale, top: `${index * 28}px` } : undefined}
        className="relative w-full origin-top rounded-[32px] border-2 border-gold/40 bg-ink p-4 shadow-[0_-20px_60px_-30px_rgba(212,175,55,0.35)] sm:rounded-[44px] sm:p-6 md:rounded-[56px] md:p-8"
      >
        <header className="flex flex-wrap items-start gap-x-6 gap-y-3 border-b border-gold/15 pb-5 md:flex-nowrap md:items-center md:pb-6">
          <span aria-hidden="true" className="gold-text font-display font-black leading-none [font-size:clamp(2.6rem,7vw,100px)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">{project.category}</span>
              {project.status && <StatusBadge status={project.status} />}
            </div>
            <h3 id={`${baseId}-title`} className="font-display font-semibold uppercase leading-tight text-ivory [font-size:clamp(1.25rem,2.6vw,2.4rem)]">
              {project.name}
            </h3>
          </div>
          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-gold/60 px-6 py-2.5 font-display text-xs font-medium uppercase tracking-widest text-gold-light transition-colors hover:bg-gold/10 sm:text-sm"
            >
              {project.link.label} <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </header>

        <div className="grid gap-5 pt-5 md:grid-cols-[0.95fr_1.05fr] md:gap-8 md:pt-6">
          <div className="flex flex-col gap-5">
            <p className="leading-relaxed text-mist [font-size:clamp(0.95rem,1.25vw,1.1rem)]">{project.summary}</p>

            <div
              role="tablist"
              aria-label={`${project.name} case study`}
              onKeyDown={onKeyDown}
              className={`grid gap-1.5 rounded-3xl border border-gold/15 bg-ink-2 p-1.5 ${
                project.steps.length > 2 ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-2"
              }`}
            >
              {project.steps.map((s, i) => (
                <button
                  key={s.label}
                  id={`${baseId}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === i}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={tab === i ? 0 : -1}
                  onClick={() => setTab(i)}
                  className={`focus-ring relative rounded-full px-3 py-2 font-display text-[0.65rem] font-medium uppercase tracking-[0.15em] transition-colors sm:text-xs ${
                    tab === i ? "text-ink" : "text-mist hover:text-gold-light"
                  }`}
                >
                  {tab === i && (
                    <motion.span
                      layoutId={`${baseId}-pill`}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-light"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${tab}`}
              className="min-h-[7.5rem] rounded-3xl border border-gold/10 bg-ink-2/60 p-5"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={step.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="leading-relaxed text-ivory/90 [font-size:clamp(0.92rem,1.15vw,1.05rem)]"
                >
                  {step.body}
                </motion.p>
              </AnimatePresence>
            </div>

            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {project.stack.map((tech) => (
                <li key={tech} className="rounded-full border border-gold/25 px-3 py-1 text-xs text-mist">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.screenshots?.length ? (
            <ScreenshotGallery images={project.screenshots} label={project.name} />
          ) : (
            <ProjectVisual kind={project.visual} />
          )}
        </div>
      </motion.article>
    </div>
  );
}
