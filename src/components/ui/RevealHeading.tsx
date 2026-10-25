"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type RevealHeadingProps = {
  id?: string;
  text: string;
  className?: string;
  // Applied to every letter — gradient text must sit on each letter because each one moves on its own.
  letterClassName?: string;
  style?: CSSProperties;
};

/**
 * A section title whose letters rise into place the first time it scrolls into view.
 * The animation is plain CSS (see .reveal-letter in globals.css) toggled by one IntersectionObserver,
 * so it adds no per-frame JavaScript. Screen readers get the plain title.
 */
export function RevealHeading({ id, text, className = "", letterClassName = "", style }: RevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  // The reveal is pure CSS keyed off data-revealed, so set the attribute directly — no re-render needed.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => el.setAttribute("data-revealed", "true");
    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Each word's starting letter index across the whole title, used to stagger the letters.
  const split = text.split(" ");
  const words = split.map((word, wi) => ({
    word,
    start: split.slice(0, wi).reduce((sum, w) => sum + w.length, 0),
  }));

  return (
    <h2 ref={ref} id={id} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map(({ word, start }, wi) => (
          <span key={wi}>
            <span className="reveal-word">
              {word.split("").map((ch, ci) => (
                <span key={ci} className={`reveal-letter ${letterClassName}`} style={{ "--i": start + ci } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </h2>
  );
}
