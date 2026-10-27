import { Plus } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { education, experience } from "@/data/experience";

const row = "md:grid-cols-[13rem_1fr_16rem_auto]";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="mx-auto w-full max-w-[1680px] px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <SectionTitle id="experience-title" index="03" kicker="Experience" lines={["Career", "progression"]} />

      <ol className="border-b border-gold/20">
        {experience.map((role, i) => (
          <li key={role.title + role.company} className="border-t border-gold/20">
            {/* The latest role starts open; the rest are one tap or Enter away. */}
            <details className="group" open={i === 0}>
              <summary
                className={`focus-ring grid cursor-pointer list-none grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 ${row} [&::-webkit-details-marker]:hidden`}
              >
                <span className="label order-3 col-span-2 tabular-nums md:order-none md:col-span-1">{role.period}</span>
                <span className="font-display text-[clamp(1.1rem,2vw,1.6rem)] font-semibold uppercase tracking-tight text-ivory">
                  {role.title}
                  {role.current && (
                    <span className="ml-3 inline-flex -translate-y-[3px] items-center gap-2 align-middle font-display text-[10px] font-normal uppercase tracking-[0.14em] text-gold">
                      <span className="signal-dot" aria-hidden="true" /> Current
                    </span>
                  )}
                </span>
                <span className="order-4 col-span-2 text-sm text-mist md:order-none md:col-span-1">{role.company}</span>
                <span
                  aria-hidden="true"
                  className="grid size-8 place-items-center rounded-full border border-gold/30 text-mist transition-transform duration-500 group-open:rotate-45"
                >
                  <Plus className="size-4" />
                </span>
              </summary>
              <ul className="grid gap-x-10 gap-y-2 pb-8 text-[0.9375rem] leading-relaxed text-mist md:ml-[13rem] md:grid-cols-2 md:pl-6">
                {role.points.map((point) => (
                  <li key={point} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-gold/70">
                    {point}
                  </li>
                ))}
              </ul>
              {role.partners && (
                <p className="-mt-3 pb-8 text-sm text-mist md:ml-[13rem] md:pl-6">
                  <span className="label mr-3">Partner organizations</span>
                  {role.partners.join(" · ")}
                </p>
              )}
            </details>
          </li>
        ))}

        <li className={`grid grid-cols-1 items-baseline gap-x-6 gap-y-1 border-t border-gold/20 py-6 ${row}`}>
          <span className="label tabular-nums">Education · {education.period}</span>
          <span className="font-display text-[clamp(1.1rem,2vw,1.6rem)] font-semibold uppercase tracking-tight text-ivory">{education.school}</span>
          <span className="text-sm text-mist">{education.program}</span>
          <span />
        </li>
      </ol>
    </section>
  );
}
