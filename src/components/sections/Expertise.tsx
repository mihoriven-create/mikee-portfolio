import { FadeIn } from "@/components/ui/FadeIn";
import { RevealPanel } from "@/components/ui/RevealPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expertise, toolGroups } from "@/data/skills";

export function Expertise() {
  return (
    <RevealPanel
      id="expertise"
      aria-labelledby="expertise-title"
      className="relative rounded-t-[40px] bg-ivory px-5 pb-36 pt-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:rounded-t-[60px] md:px-10 md:pb-44 md:pt-32"
    >
      <SectionHeading id="expertise-title" eyebrow="Technical expertise" title="Expertise" tone="ink" className="mb-16 sm:mb-20 md:mb-28" />

      <ol className="mx-auto max-w-6xl">
        {expertise.map((item, i) => (
          <FadeIn
            as="li"
            key={item.name}
            delay={(i % 4) * 0.08}
            className="group relative flex items-start gap-5 overflow-hidden border-t border-ink/15 py-8 last:border-b sm:gap-8 sm:py-10 md:gap-12 md:py-12"
          >
            {/* Gold wash that sweeps in on hover. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-gold/25 via-gold/10 to-transparent transition-transform duration-700 ease-premium group-hover:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="relative font-display font-black leading-none text-ink transition-colors duration-500 group-hover:text-gold-deep [font-size:clamp(2.6rem,9vw,120px)]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative flex flex-1 flex-col gap-3 pt-1 md:flex-row md:items-start md:justify-between md:gap-10 md:pt-3">
              <div className="flex flex-col gap-2 md:max-w-2xl">
                <h3 className="font-display font-medium uppercase [font-size:clamp(1.05rem,2.2vw,2rem)]">{item.name}</h3>
                <p className="font-light leading-relaxed text-ink/65 [font-size:clamp(0.9rem,1.4vw,1.15rem)]">{item.description}</p>
              </div>
              <ul className="flex flex-wrap gap-2 md:max-w-[280px] md:justify-end" aria-label={`Tools for ${item.name}`}>
                {item.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-ink/20 px-3 py-1 text-xs font-medium text-ink/70 transition-colors group-hover:border-gold-deep/50">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </ol>

      <div className="mx-auto mt-20 max-w-6xl md:mt-28">
        <FadeIn>
          <h3 className="mb-8 text-center font-display text-sm font-medium uppercase tracking-[0.4em] text-gold-deep">Toolkit</h3>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolGroups.map((group, i) => (
            <FadeIn
              key={group.label}
              delay={(i % 3) * 0.08}
              className="rounded-3xl border border-ink/10 bg-white/60 p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] transition-shadow duration-500 hover:shadow-[0_20px_50px_-25px_rgba(156,122,43,0.55)]"
            >
              <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink">{group.label}</p>
              <ul className="flex flex-wrap gap-2">
                {group.tools.map((tool) => (
                  <li key={tool} className="rounded-full bg-ink px-3 py-1.5 text-xs text-ivory">
                    {tool}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </RevealPanel>
  );
}
