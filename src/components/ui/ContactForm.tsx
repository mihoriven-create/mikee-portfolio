"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send, TriangleAlert, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { site } from "@/data/site";

const OPEN_EVENT = "open-contact-form";

// Public access key from web3forms.com (it is designed to be visible in the browser; it can only
// deliver mail to the address it was created for). Set it as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in Vercel.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

/** Opens the contact form from anywhere on the page. */
export function openContactForm() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** A server-rendered card (or any markup) that opens the contact form when clicked. */
export function OpenContactFormButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={openContactForm} aria-haspopup="dialog" className={className}>
      {children}
    </button>
  );
}

type Status = "idle" | "sending" | "sent" | "error" | "fallback";
type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const emptyFields: Fields = { name: "", email: "", message: "" };

function validate({ name, email, message }: Fields): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Please tell me your name.";
  if (!email.trim()) errors.email = "Please enter your email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = "That email address doesn’t look right.";
  if (message.trim().length < 10) errors.message = "Please write a short message (at least 10 characters).";
  return errors;
}

/** Opens the visitor's own email app with the message already written — the safety net. */
function mailtoFallback({ name, email, message }: Fields) {
  const subject = `Portfolio message from ${name.trim()}`;
  const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const inputClass =
  "w-full rounded-2xl border bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist/40 transition-colors focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-gold/30";

export function ContactFormDialog() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState(false); // honeypot: real visitors never see or tick it
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const uid = useId();

  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    // After a successful send, start fresh next time; otherwise keep the draft.
    setStatus((s) => {
      if (s === "sent" || s === "fallback") setFields(emptyFields);
      return s === "sending" ? s : "idle";
    });
    setErrors({});
    opener.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => nameRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Keep keyboard focus inside the dialog.
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([tabindex='-1']), textarea")].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const update = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstBad = (["name", "email", "message"] as const).find((k) => found[k]);
      dialogRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    // A bot filled the hidden field: pretend it worked and send nothing.
    if (trap) {
      setStatus("sent");
      return;
    }
    // No mail service configured yet: hand the message to the visitor's own email app instead.
    if (!ACCESS_KEY) {
      mailtoFallback(fields);
      setStatus("fallback");
      return;
    }

    setStatus("sending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${fields.name.trim()}`,
          from_name: "Portfolio contact form",
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          botcheck: "",
        }),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !data?.success) throw new Error("send failed");
      setStatus("sent");
      setFields(emptyFields);
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  if (!open) return null;

  const titleId = `${uid}-title`;
  const field = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    name: key,
    value: fields[key],
    onChange: update(key),
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
    disabled: status === "sending",
  });
  const borderFor = (key: keyof Fields) => (errors[key] ? "border-red-400/70" : "border-gold/25");
  const done = status === "sent" || status === "fallback";

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="contact-dialog"
        data-lenis-prevent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-ink/90 px-4 py-6 backdrop-blur-xl sm:items-center sm:py-10"
        onMouseDown={(e) => e.target === e.currentTarget && close()}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 0.8, 0.2, 1] }}
          className="relative w-full max-w-lg rounded-[32px] border border-gold/30 bg-gradient-to-b from-ink-3 to-ink-2 p-6 shadow-[0_40px_120px_-40px_rgba(212,175,55,0.45)] sm:p-9"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close message form"
            className="focus-ring absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-gold/30 text-gold-light transition-colors hover:bg-gold hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {done ? (
            <div className="flex flex-col items-center py-6 text-center" role="status">
              <span className="grid size-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                {status === "sent" ? <CheckCircle2 className="size-8" aria-hidden="true" /> : <Mail className="size-8" aria-hidden="true" />}
              </span>
              <h2 id={titleId} className="mt-6 font-display text-2xl font-semibold uppercase tracking-tight text-ivory">
                {status === "sent" ? "Message sent" : "One more step"}
              </h2>
              <p className="mt-3 max-w-sm leading-relaxed text-mist">
                {status === "sent"
                  ? "Thank you! Your message is on its way to my inbox, and I’ll reply to the email address you gave."
                  : `Your email app should have opened with your message ready to send. If it didn’t, please write to ${site.email}.`}
              </p>
              <button
                type="button"
                onClick={close}
                className="focus-ring mt-8 rounded-full border border-gold/50 px-7 py-3 font-display text-xs font-medium uppercase tracking-[0.18em] text-gold-light transition-colors hover:bg-gold hover:text-ink"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">Get in touch</p>
              <h2 id={titleId} className="mt-2 pr-12 font-display text-3xl font-black uppercase leading-none tracking-tight text-ivory">
                Send me a message
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">Tell me a little about what you need. It goes straight to my inbox.</p>

              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <label htmlFor={`${uid}-name`} className="mb-2 block font-display text-[0.7rem] uppercase tracking-[0.25em] text-gold/90">
                    Your name
                  </label>
                  <input ref={nameRef} type="text" autoComplete="name" maxLength={100} placeholder="Jane Doe" className={`${inputClass} ${borderFor("name")}`} {...field("name")} />
                  {errors.name && (
                    <p id={`${uid}-name-error`} className="mt-2 flex items-center gap-2 text-sm text-red-300">
                      <TriangleAlert className="size-4 shrink-0" aria-hidden="true" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-email`} className="mb-2 block font-display text-[0.7rem] uppercase tracking-[0.25em] text-gold/90">
                    Your email
                  </label>
                  <input type="email" autoComplete="email" inputMode="email" maxLength={200} placeholder="you@company.com" className={`${inputClass} ${borderFor("email")}`} {...field("email")} />
                  {errors.email && (
                    <p id={`${uid}-email-error`} className="mt-2 flex items-center gap-2 text-sm text-red-300">
                      <TriangleAlert className="size-4 shrink-0" aria-hidden="true" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-message`} className="mb-2 block font-display text-[0.7rem] uppercase tracking-[0.25em] text-gold/90">
                    Message
                  </label>
                  <textarea rows={5} maxLength={4000} placeholder="How can I help?" className={`${inputClass} ${borderFor("message")} resize-y`} {...field("message")} />
                  {errors.message && (
                    <p id={`${uid}-message-error`} className="mt-2 flex items-center gap-2 text-sm text-red-300">
                      <TriangleAlert className="size-4 shrink-0" aria-hidden="true" /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Leave this empty
                    <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" checked={trap} onChange={(e) => setTrap(e.target.checked)} />
                  </label>
                </div>
              </div>

              <div aria-live="polite">
                {status === "error" && (
                  <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm leading-relaxed text-red-200">
                    <p className="flex items-center gap-2 font-medium">
                      <TriangleAlert className="size-4 shrink-0" aria-hidden="true" /> Sorry, the message couldn’t be sent right now.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        mailtoFallback(fields);
                        setStatus("fallback");
                      }}
                      className="focus-ring mt-2 rounded underline underline-offset-4 hover:text-white"
                    >
                      Send it with my email app instead
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="focus-ring gold-sheen mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 font-display text-sm font-medium uppercase tracking-[0.18em] text-ink shadow-[0_10px_40px_-10px_rgba(212,175,55,0.65)] transition-all duration-500 hover:[background-position:100%_0] disabled:cursor-wait disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <Send className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
