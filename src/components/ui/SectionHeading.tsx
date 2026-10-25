import { FadeIn } from "./FadeIn";
import { RevealHeading } from "./RevealHeading";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  tone?: "gold" | "ink";
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, tone = "gold", className = "" }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <FadeIn y={20}>
          <p
            className={`mb-4 font-display text-xs font-medium uppercase tracking-[0.4em] sm:text-sm ${
              tone === "gold" ? "text-gold" : "text-gold-deep"
            }`}
          >
            {eyebrow}
          </p>
        </FadeIn>
      )}
      <RevealHeading
        id={id}
        text={title}
        className={`font-display font-black uppercase leading-none tracking-tight ${tone === "ink" ? "text-ink" : ""}`}
        letterClassName={tone === "gold" ? "gold-text" : ""}
        style={{ fontSize: "clamp(3rem, 11vw, 150px)" }}
      />
    </div>
  );
}
