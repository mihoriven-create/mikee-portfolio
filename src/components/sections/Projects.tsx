"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-4 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <SectionHeading id="projects-title" eyebrow="Featured case studies" title="Projects" className="mb-14 sm:mb-20" />
      <div ref={ref} className="mx-auto flex max-w-7xl flex-col gap-6 md:gap-0">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
