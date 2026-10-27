"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { projects } from "@/data/projects";
import { type Expertise, expertise, toolGroups } from "@/data/skills";

// Which case studies show each capability (project slugs, in the order they appear in Projects).
const caseCapabilities: Record<string, string[]> = {
  "afs-deal-intake": ["Custom Web Applications", "API & Webhook Integrations"],
  "ghl-workflows": ["CRM Administration & Configuration", "Workflow Automation", "Lead Management & Distribution"],
  "ai-voice": ["AI Voice & Conversation AI"],
  "sheets-integrations": ["API & Webhook Integrations", "Workflow Automation"],
  "dscr-calculator": ["Backend Operations & Troubleshooting", "Business Process Optimization"],
  "crm-infrastructure": [
    "CRM Administration & Configuration",
    "Backend Operations & Troubleshooting",
    "Business Process Optimization",
    "Lead Management & Distribution",
  ],
};

const pad = (n: number) => String(n).padStart(2, "0");

function Detail({ item }: { item: Expertise }) {
  const cases = projects
    .map((project, i) => ({ project, number: pad(i + 1) }))
    .filter(({ project }) => caseCapabilities[project.slug]?.includes(item.name));

  return (
    <div key={item.name} className="animate-[fade-up_0.5s_var(--ease-premium)]">
      <p className="text-lg leading-relaxed text-ivory md:text-xl">{item.description}</p>
      <p className="label mt-8">Tools</p>
      <p className="mt-2 text-mist">{item.tools.join(" · ")}</p>
      {cases.length > 0 && (
        <>
          <p className="label mt-8">Seen in</p>
          <ul className="mt-2 space-y-1">
            {cases.map(({ project, number }) => (
              <li key={project.slug}>
                <a href={`#${project.slug}`} className="group focus-ring inline-flex items-baseline gap-3 py-1 text-mist hover:text-ivory">
                  <span className="font-display text-[11px] text-gold">{number}</span>
                  <span className="link-u">{project.name}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 translate-y-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function Capabilities() {
  const [active, setActive] = useState(0);
  const current = expertise[active];

  return (
    <section id="expertise" aria-labelledby="cap-title" className="relative isolate">
      <div className="mx-auto w-full max-w-[1680px] px-5 py-24 sm:px-8 md:px-10 md:py-36">
        <SectionTitle
          id="cap-title"
          index="02"
          kicker="Technical capabilities"
          lines={["What I", "work on"]}
          aside={<p>Eight areas of day-to-day work, each tied back to the case studies where you can see it in practice.</p>}
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <ul className="lg:col-span-7">
            {expertise.map((item, i) => {
              const on = i === active;
              const panelId = `cap-panel-${i}`;
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="group focus-ring flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                  >
                    <span className={`font-display text-xs transition-colors duration-300 ${on ? "text-gold" : "text-mist/80"}`}>
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`font-display font-medium uppercase leading-[1.05] tracking-tight transition-[color,transform] duration-500 ease-premium [font-size:clamp(1.2rem,2.4vw,2.2rem)] ${
                        on ? "translate-x-2 text-gold-light" : "text-mist group-hover:text-ivory"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                  {/* Inline detail on small screens; on desktop the sticky panel shows it. */}
                  <div id={panelId} className={`pb-8 pl-9 lg:hidden ${on ? "" : "hidden"}`}>
                    {on ? <Detail item={item} /> : null}
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block" aria-live="polite">
            <div className="sticky top-28 border-t border-gold/60 pt-6">
              <p className="label mb-6 text-mist">
                {pad(active + 1)} — {current.name}
              </p>
              <Detail item={current} />
            </div>
          </aside>
        </div>

        <div className="mt-24 md:mt-32">
          <div className="mb-10 flex items-center gap-4">
            <h3 className="label text-mist">Toolkit</h3>
            <span className="rule flex-1" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
            {toolGroups.map((group) => (
              <div key={group.label}>
                <h4 className="label">{group.label}</h4>
                <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-mist">
                  {group.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
