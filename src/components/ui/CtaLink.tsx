import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "ghost" | "dark";

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
  external?: boolean;
  size?: "md" | "lg";
};

const variants: Record<Variant, string> = {
  gold:
    "gold-sheen text-ink shadow-[0_10px_40px_-10px_rgba(212,175,55,0.65),inset_0_1px_0_rgba(255,255,255,0.5)] hover:[background-position:100%_0] hover:shadow-[0_14px_50px_-8px_rgba(212,175,55,0.8),inset_0_1px_0_rgba(255,255,255,0.5)]",
  ghost:
    "border border-gold/50 text-ivory backdrop-blur-sm hover:border-gold-light hover:bg-gold/10 hover:text-gold-light",
  dark: "bg-ink text-ivory hover:bg-ink-3",
};

const sizes = {
  md: "px-6 py-3 text-xs sm:text-sm",
  lg: "px-7 py-3.5 text-sm sm:px-9 sm:py-4 sm:text-base",
};

export function CtaLink({
  href,
  variant = "gold",
  icon,
  external,
  size = "md",
  className = "",
  children,
  ...rest
}: CtaLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      className={`focus-ring group inline-flex items-center justify-center gap-2.5 rounded-full font-display font-medium uppercase tracking-[0.18em] transition-all duration-500 ease-premium hover:-translate-y-0.5 active:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span>{children}</span>
      {icon && (
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
