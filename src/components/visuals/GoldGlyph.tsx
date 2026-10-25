type GlyphKind = "ring" | "cube" | "nodes" | "hex";

/** Decorative dimensional gold objects drawn in SVG — light enough to float without WebGL. */
export function GoldGlyph({ kind, className = "" }: { kind: GlyphKind; className?: string }) {
  const id = `g-${kind}`;
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe8ad" />
          <stop offset="0.45" stopColor="#d4af37" />
          <stop offset="1" stopColor="#6e5217" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d98b" />
          <stop offset="1" stopColor="#8c6a22" />
        </linearGradient>
      </defs>
      {kind === "ring" && (
        <g>
          <ellipse cx="100" cy="100" rx="78" ry="78" fill="none" stroke={`url(#${id}-a)`} strokeWidth="26" />
          <ellipse cx="100" cy="100" rx="78" ry="78" fill="none" stroke="#fff6d6" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="60 420" />
        </g>
      )}
      {kind === "cube" && (
        <g>
          <polygon points="100,22 170,60 100,98 30,60" fill="#f7e3a1" />
          <polygon points="30,60 100,98 100,178 30,140" fill={`url(#${id}-a)`} />
          <polygon points="170,60 100,98 100,178 170,140" fill={`url(#${id}-b)`} opacity="0.85" />
        </g>
      )}
      {kind === "nodes" && (
        <g stroke="#d4af37" strokeOpacity="0.6" strokeWidth="3">
          <line x1="100" y1="100" x2="40" y2="50" />
          <line x1="100" y1="100" x2="165" y2="60" />
          <line x1="100" y1="100" x2="60" y2="160" />
          <line x1="100" y1="100" x2="155" y2="150" />
          <circle cx="100" cy="100" r="30" fill={`url(#${id}-a)`} stroke="none" />
          <circle cx="40" cy="50" r="16" fill={`url(#${id}-b)`} stroke="none" />
          <circle cx="165" cy="60" r="12" fill={`url(#${id}-b)`} stroke="none" />
          <circle cx="60" cy="160" r="14" fill={`url(#${id}-b)`} stroke="none" />
          <circle cx="155" cy="150" r="18" fill={`url(#${id}-b)`} stroke="none" />
        </g>
      )}
      {kind === "hex" && (
        <g>
          <polygon points="100,15 174,57 174,143 100,185 26,143 26,57" fill={`url(#${id}-a)`} />
          <polygon points="100,52 142,76 142,124 100,148 58,124 58,76" fill="#0a0a0a" opacity="0.85" />
          <polygon points="100,52 142,76 142,124 100,148 58,124 58,76" fill="none" stroke="#f3d98b" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}
