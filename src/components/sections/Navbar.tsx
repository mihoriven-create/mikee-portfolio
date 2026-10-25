"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ContactHeading, EmailOptions, LetsConnect, WhatsAppOptions } from "@/components/ui/EmailConnect";
import { navLinks, site } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  // Reading progress for the thin gold line under the navbar.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link for whichever section is crossing the middle of the viewport.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={`nav-fade fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-gold/15 bg-ink/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-8 md:px-10">
        {/* The link's accessible name comes from its own text, so it always matches what is shown. */}
        <a href="#top" className="focus-ring group flex items-center gap-3 rounded-full">
          <span className="grid size-10 place-items-center rounded-full border border-gold/60 font-display text-sm font-semibold tracking-wider text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
            MJB
          </span>
          <span className="font-display text-[0.66rem] font-medium uppercase tracking-[0.08em] text-ivory min-[420px]:text-[0.8rem] min-[420px]:tracking-[0.18em] min-[1100px]:text-[0.72rem] min-[1100px]:tracking-[0.12em] xl:text-[0.8rem] xl:tracking-[0.18em]">
            <span className="sr-only"> </span>Michael John Buencamino
          </span>
          <span className="sr-only">, back to top</span>
        </a>

        <ul className="hidden items-center gap-0.5 min-[1100px]:flex xl:gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={`focus-ring relative rounded-full px-2.5 py-2 font-display text-[0.8rem] font-medium uppercase tracking-wider xl:px-4 xl:text-sm transition-colors duration-200 hover:text-gold-light ${
                  active === link.href ? "text-gold-light" : "text-mist"
                }`}
              >
                {link.label}
                {active === link.href && (
                  <motion.span layoutId="nav-dot" className="absolute inset-x-2.5 -bottom-0.5 h-px bg-gold xl:inset-x-4" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LetsConnect />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring grid size-11 place-items-center rounded-full border border-gold/40 text-gold-light min-[1100px]:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-gold-deep via-gold-light to-gold"
      />
    </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-ink/95 pb-10 backdrop-blur-xl min-[1100px]:hidden"
          >
            <ul className="flex flex-col gap-2 px-6 pt-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring block border-b border-gold/15 py-4 font-display text-3xl font-semibold uppercase tracking-tight text-ivory"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-6">
                <div className="rounded-3xl border border-gold/30 bg-ink-2 p-2">
                  <ContactHeading label="Email me at" value={site.email} />
                  <EmailOptions onDone={() => setOpen(false)} />
                  <div className="mx-2 my-2 h-px bg-gold/15" />
                  <ContactHeading label="WhatsApp / Call" value={site.phoneDisplay} />
                  <WhatsAppOptions onDone={() => setOpen(false)} />
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
