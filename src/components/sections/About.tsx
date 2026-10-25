import Image from "next/image";
import { Briefcase, Layers, MapPin, Wrench } from "lucide-react";
import { CtaLink } from "@/components/ui/CtaLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { GoldGlyph } from "@/components/visuals/GoldGlyph";
import { site } from "@/data/site";

const about =
  "I support US-based businesses by managing CRM systems, workflow automations, and backend operations. I build and improve CRM workflows, automate processes, troubleshoot system issues, and help teams work more efficiently through reliable tools and organized systems.";

// Every fact here comes straight from the résumé.
const facts = [
  { icon: Briefcase, label: "Current role", value: "CRM & Technical Operations Specialist, American Financial Services, LLC" },
  { icon: Layers, label: "Core platforms", value: "GoHighLevel, Zoho CRM, ClickUp, Monday.com, Notion" },
  { icon: Wrench, label: "Technical roots", value: "Field service IT technician since 2018" },
  { icon: MapPin, label: "Based in", value: site.location },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip px-5 py-24 sm:px-8 md:px-10"
    >
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute left-[1%] top-[4%] sm:left-[2%] md:left-[4%]">
        <GoldGlyph kind="ring" className="animate-float w-[90px] opacity-80 [--r:-12deg] sm:w-[130px] md:w-[170px]" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[6%] left-[3%] sm:left-[6%] md:left-[8%]">
        <GoldGlyph kind="cube" className="animate-float w-[80px] opacity-80 [--r:8deg] [animation-delay:-2s] sm:w-[110px] md:w-[150px]" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute right-[1%] top-[4%] sm:right-[2%] md:right-[4%]">
        <GoldGlyph kind="nodes" className="animate-float w-[90px] opacity-80 [animation-delay:-4s] sm:w-[130px] md:w-[170px]" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[6%] right-[3%] sm:right-[6%] md:right-[8%]">
        <GoldGlyph kind="hex" className="animate-float w-[90px] opacity-80 [--r:14deg] [animation-delay:-1s] sm:w-[120px] md:w-[160px]" />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-14 sm:gap-16 md:gap-20">
        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <FadeIn y={30}>
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-2 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-deep opacity-90" />
              <Image
                src="/images/michael-john-buencamino.png"
                alt="Portrait of Michael John Buencamino"
                width={216}
                height={229}
                className="relative size-28 rounded-full object-cover object-top ring-4 ring-ink sm:size-32"
                priority={false}
              />
            </div>
          </FadeIn>
          <FadeIn y={40}>
            <h2
              id="about-title"
              className="gold-text text-center font-display font-black uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              About me
            </h2>
          </FadeIn>
          <FadeIn y={20}>
            <p className="max-w-[620px] text-center font-display font-medium leading-relaxed text-white [font-size:clamp(1.05rem,2vw,1.4rem)]">
              {about}
            </p>
          </FadeIn>
        </div>

        <ul className="grid w-full max-w-4xl gap-3 sm:grid-cols-2">
          {facts.map(({ icon: Icon, label, value }, i) => (
            <FadeIn as="li" key={label} delay={i * 0.08} className="flex gap-4 rounded-2xl border border-gold/15 bg-ink-2/80 p-5 backdrop-blur">
              <Icon className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <p className="font-display text-[0.7rem] uppercase tracking-[0.3em] text-gold/80">{label}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist sm:text-base">{value}</p>
              </div>
            </FadeIn>
          ))}
        </ul>

        <FadeIn className="flex flex-wrap justify-center gap-3">
          <CtaLink href="#contact" size="lg">
            Contact Me
          </CtaLink>
          <CtaLink href="#experience" variant="ghost" size="lg">
            See Experience
          </CtaLink>
        </FadeIn>
      </div>
    </section>
  );
}
