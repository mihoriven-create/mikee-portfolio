import { ArrowUp, ArrowUpRight, CalendarDays, Mail, MapPin, MessageCircle } from "lucide-react";
import { OpenContactFormButton } from "@/components/ui/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealPanel } from "@/components/ui/RevealPanel";
import { navLinks, site } from "@/data/site";

const cardClass =
  "focus-ring group relative flex h-full w-full flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-gold/25 bg-ink p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-[0_30px_60px_-30px_rgba(212,175,55,0.6)] sm:p-8";

// The email card opens the message form (no href); the others are links.
const channels = [
  { label: "Email Me", detail: site.email, href: undefined, icon: Mail, external: false },
  { label: "WhatsApp Me", detail: site.phoneDisplay, href: site.whatsapp, icon: MessageCircle, external: true },
  { label: "Book a Call", detail: "30-minute call on Calendly", href: site.calendly, icon: CalendarDays, external: true },
];

export function Contact() {
  return (
    <RevealPanel
      id="contact"
      aria-labelledby="contact-title"
      className="grain relative overflow-hidden rounded-t-[40px] border-t border-gold/20 bg-gradient-to-b from-ink-2/60 to-ink/50 px-5 pb-10 pt-24 sm:rounded-t-[50px] sm:px-8 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.22),transparent_65%)]" />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="text-center font-display text-xs font-medium uppercase tracking-[0.4em] text-gold sm:text-sm">Let&apos;s connect</p>
        </FadeIn>
        <FadeIn y={40}>
          <h2 id="contact-title" className="mt-4 text-center font-display font-black uppercase leading-[0.9] tracking-tight [font-size:clamp(2.6rem,9vw,130px)]">
            <span className="text-ivory">Let&apos;s build</span>
            <br />
            <span className="gold-text">better systems</span>
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center leading-relaxed text-mist [font-size:clamp(1rem,1.4vw,1.15rem)]">
            Need help with CRM management, workflow automation, AI implementation, or backend operations? Reach out through any channel below.
          </p>
        </FadeIn>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {channels.map(({ label, detail, href, icon: Icon, external }, i) => (
            <FadeIn as="li" key={label} delay={i * 0.1}>
              {href ? (
                <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cardClass}>
                <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-gradient-to-t from-gold/20 to-transparent transition-transform duration-700 ease-premium group-hover:translate-y-0" />
                <span className="relative flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-5 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
                <span className="relative">
                  <span className="block font-display text-2xl font-semibold uppercase tracking-tight text-ivory">{label}</span>
                  <span className="mt-1 block break-all text-sm text-mist">{detail}</span>
                </span>
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              ) : (
                <OpenContactFormButton className={cardClass}>
                <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-gradient-to-t from-gold/20 to-transparent transition-transform duration-700 ease-premium group-hover:translate-y-0" />
                <span className="relative flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-5 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
                <span className="relative">
                  <span className="block font-display text-2xl font-semibold uppercase tracking-tight text-ivory">{label}</span>
                  <span className="mt-1 block break-all text-sm text-mist">{detail}</span>
                </span>
                  <span className="sr-only">(opens a message form)</span>
                </OpenContactFormButton>
              )}
            </FadeIn>
          ))}
        </ul>

        <FadeIn className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2 text-sm text-mist/80">
            <Mail className="size-4 text-gold" aria-hidden="true" /> {site.email}
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-mist/80">
            <MapPin className="size-4 text-gold" aria-hidden="true" /> {site.location}
          </span>
        </FadeIn>

        <footer className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-gold/15 pt-8 text-sm text-mist/70 md:flex-row">
          <p>
            © {site.name} · {site.title}
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="focus-ring rounded transition-colors hover:text-gold-light">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#top" className="focus-ring inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 transition-colors hover:border-gold hover:text-gold-light">
            Back to top <ArrowUp className="size-4" aria-hidden="true" />
          </a>
        </footer>
      </div>
    </RevealPanel>
  );
}
