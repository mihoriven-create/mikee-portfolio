import Image from "next/image";
import { toolLogoRows, type ToolLogo } from "@/data/skills";

function Tile({ tool, hidden }: { tool: ToolLogo; hidden: boolean }) {
  // Square-ish marks get more height so they carry the same visual weight as wide wordmarks.
  const compact = tool.width / tool.height < 1.6;
  return (
    <li
      aria-hidden={hidden || undefined}
      className="group relative mr-3 grid h-[104px] w-[200px] shrink-0 place-items-center overflow-hidden rounded-2xl border border-gold/15 bg-[#050505] px-7 transition-colors duration-500 hover:border-gold/60 sm:h-[124px] sm:w-[240px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-10 h-16 rounded-full bg-gold/0 blur-2xl transition-colors duration-500 group-hover:bg-gold/20"
      />
      <Image
        src={tool.logo}
        alt={hidden ? "" : tool.name}
        width={tool.width}
        height={tool.height}
        sizes="170px"
        className={`relative w-auto max-w-[140px] object-contain opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100 sm:max-w-[170px] ${
          compact ? "max-h-[68px] sm:max-h-[84px]" : "max-h-[48px] sm:max-h-[58px]"
        }`}
      />
    </li>
  );
}

function Row({ tools, duration, direction }: { tools: ToolLogo[]; duration: number; direction: "left" | "right" }) {
  // Three identical copies; the track slides exactly one copy's width, so the loop is seamless.
  // Tiles use a right margin (not flex gap) so each copy is precisely a third of the track.
  // Only the first copy is announced to screen readers.
  const tripled = [0, 1, 2].flatMap((copy) => tools.map((tool) => ({ tool, copy })));
  return (
    <ul className="marquee-track flex w-max" data-direction={direction} style={{ animationDuration: `${duration}s` }}>
      {tripled.map(({ tool, copy }, i) => (
        <Tile key={i} tool={tool} hidden={copy > 0} />
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <section aria-label="Platforms and tools I work with" className="marquee overflow-x-clip pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <Row tools={toolLogoRows[0]} duration={45} direction="left" />
        <Row tools={toolLogoRows[1]} duration={45} direction="right" />
      </div>
    </section>
  );
}
