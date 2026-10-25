"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail, MessageCircle, MessageSquareText, Phone, Send } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { openContactForm } from "./ContactForm";
import { mailto, site } from "@/data/site";

const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`;

const item =
  "focus-ring flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-ivory transition-colors hover:bg-gold/10 hover:text-gold-light";

function useCopy(value: string = site.email) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); select-and-copy fallback.
      const input = document.createElement("input");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

/** Section label + value shown above each group of options. */
export function ContactHeading({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 pb-2 pt-3">
      <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold">{label}</p>
      <p className="mt-1 select-all break-all font-display text-base text-ivory">{value}</p>
    </div>
  );
}

/** WhatsApp chat, a direct call, or copying the number; shared by the navbar popover and the mobile menu. */
export function WhatsAppOptions({ onDone }: { onDone?: () => void }) {
  const { copied, copy } = useCopy(site.phoneDisplay);
  return (
    <div className="flex flex-col gap-1">
      <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" onClick={onDone} className={item}>
        <MessageCircle className="size-4 text-gold" aria-hidden="true" /> Chat on WhatsApp
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <a href={`tel:${site.phoneTel}`} onClick={onDone} className={item}>
        <Phone className="size-4 text-gold" aria-hidden="true" /> Call {site.phoneDisplay}
      </a>
      <button type="button" onClick={copy} className={item}>
        {copied ? <Check className="size-4 text-gold" aria-hidden="true" /> : <Copy className="size-4 text-gold" aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Number copied!" : "Copy phone number"}</span>
      </button>
    </div>
  );
}

/** The three ways to reach the inbox; shared by the navbar popover and the mobile menu. */
export function EmailOptions({ onDone }: { onDone?: () => void }) {
  const { copied, copy } = useCopy();
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => {
          onDone?.();
          openContactForm();
        }}
        aria-haspopup="dialog"
        className={item}
      >
        <MessageSquareText className="size-4 text-gold" aria-hidden="true" /> Send me a message
      </button>
      <button type="button" onClick={copy} className={item}>
        {copied ? <Check className="size-4 text-gold" aria-hidden="true" /> : <Copy className="size-4 text-gold" aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Email copied!" : "Copy email address"}</span>
      </button>
      <a href={gmailCompose} target="_blank" rel="noopener noreferrer" onClick={onDone} className={item}>
        <Send className="size-4 text-gold" aria-hidden="true" /> Write in Gmail
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <a href={mailto} onClick={onDone} className={item}>
        <Mail className="size-4 text-gold" aria-hidden="true" /> Open my email app
      </a>
    </div>
  );
}

/** Navbar "Let's Connect" button with an email popover. */
export function LetsConnect() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="focus-ring inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 font-display text-xs font-medium uppercase tracking-[0.18em] text-gold-light transition-colors hover:bg-gold hover:text-ink"
      >
        <Mail className="size-4" aria-hidden="true" />
        Let&apos;s Connect
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-[calc(100%+10px)] max-h-[calc(100vh-90px)] w-[300px] origin-top-right overflow-y-auto rounded-3xl border border-gold/30 bg-ink-2/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <ContactHeading label="Email me at" value={site.email} />
            <EmailOptions onDone={() => setOpen(false)} />
            <div className="mx-2 my-2 h-px bg-gold/15" />
            <ContactHeading label="WhatsApp / Call" value={site.phoneDisplay} />
            <WhatsAppOptions onDone={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Inline email address with a copy button (used in the Contact section). */
export function CopyEmail() {
  const { copied, copy } = useCopy();
  return (
    <span className="inline-flex items-center gap-2 text-sm text-mist/80">
      <Mail className="size-4 text-gold" aria-hidden="true" />
      <span className="select-all">{site.email}</span>
      <button
        type="button"
        onClick={copy}
        className="focus-ring inline-flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-1 text-xs text-gold-light transition-colors hover:bg-gold hover:text-ink"
      >
        {copied ? <Check className="size-3" aria-hidden="true" /> : <Copy className="size-3" aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </span>
  );
}
