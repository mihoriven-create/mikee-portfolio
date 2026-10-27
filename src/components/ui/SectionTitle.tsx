import type { ReactNode } from "react";

type SectionTitleProps = {
  id: string;
  index: string;
  kicker: string;
  lines: string[];
  aside?: ReactNode;
};

/** Left-aligned section header: numbered kicker with a hairline, a large gold headline, and an optional aside. */
export function SectionTitle({ id, index, kicker, lines, aside }: SectionTitleProps) {
  return (
    <header className="mb-14 md:mb-24">
      <div className="flex items-center gap-4">
        <span className="label text-mist">({index})</span>
        <span className="label">{kicker}</span>
        <span className="rule flex-1" aria-hidden="true" />
      </div>
      <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
        <h2
          id={id}
          className="font-display font-black uppercase leading-[0.92] tracking-tight md:col-span-8 [font-size:clamp(2.75rem,8.4vw,8rem)]"
        >
          {lines.map((line) => (
            <span key={line} className="gold-text block">
              {line}
            </span>
          ))}
        </h2>
        {aside ? <div className="max-w-md text-mist md:col-span-4 md:justify-self-end">{aside}</div> : null}
      </div>
    </header>
  );
}
