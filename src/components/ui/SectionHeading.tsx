import { FadeIn } from "./FadeIn";

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
      <FadeIn y={40}>
        <h2
          id={id}
          className={`font-display font-black uppercase leading-none tracking-tight ${
            tone === "gold" ? "gold-text" : "text-ink"
          }`}
          style={{ fontSize: "clamp(3rem, 11vw, 150px)" }}
        >
          {title}
        </h2>
      </FadeIn>
    </div>
  );
}
