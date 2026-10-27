import type { ReactNode } from "react";

// One abstract white scene per capability, in the same order as `expertise` in src/data/skills.ts.
// Everything is drawn with deterministic geometry (no randomness) so server and browser always agree.

const W = "rgb(255 255 255)";
const line = { stroke: W, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;
const soft = { fill: W, fillOpacity: 0.1, stroke: W, strokeWidth: 4 } as const;
const solid = { fill: W, fillOpacity: 0.55 } as const;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Pipeline columns of deal cards, with one highlighted card travelling along the stages. */
function Crm() {
  const cols = [230, 530, 830, 1130];
  const cards = [4, 3, 2, 1];
  return (
    <>
      {cols.map((x, c) => (
        <g key={x}>
          <rect x={x} y={170} width={250} height={44} rx={22} {...soft} />
          {range(cards[c]).map((r) => (
            <rect key={r} x={x} y={250 + r * 125} width={250} height={100} rx={20} {...soft} fillOpacity={r === 0 && c === 1 ? 0.35 : 0.08} />
          ))}
        </g>
      ))}
      <path d="M355 300 C 430 300, 450 300, 530 300 M655 300 C 730 300, 750 380, 830 380 M955 380 C 1030 380, 1050 300, 1130 300" {...line} strokeDasharray="2 18" className="animate-dash" />
      <circle cx="655" cy="300" r="12" {...solid} />
    </>
  );
}

/** A trigger that branches through a condition and merges again. */
function Workflow() {
  return (
    <>
      <path d="M260 450 H520 M520 450 C 640 450, 640 300, 760 300 H980 M520 450 C 640 450, 640 600, 760 600 H980 M1080 300 C 1200 300, 1200 450, 1320 450 M1080 600 C 1200 600, 1200 450, 1320 450" {...line} strokeDasharray="2 18" className="animate-dash" />
      <circle cx="210" cy="450" r="50" {...soft} />
      <rect x="470" y="400" width="100" height="100" rx="14" transform="rotate(45 520 450)" {...soft} />
      <rect x="760" y="255" width="320" height="90" rx="22" {...soft} />
      <rect x="760" y="555" width="320" height="90" rx="22" {...soft} />
      <circle cx="1370" cy="450" r="50" {...soft} />
      <circle cx="210" cy="450" r="14" {...solid} />
      <circle cx="1370" cy="450" r="14" {...solid} />
    </>
  );
}

/** A voice waveform inside rings. */
function Voice() {
  return (
    <>
      {[130, 230, 340, 460].map((r) => (
        <circle key={r} cx="800" cy="450" r={r} {...line} strokeWidth={3} strokeOpacity={0.5} />
      ))}
      {range(29).map((i) => {
        const h = 40 + Math.abs(Math.sin(i * 0.62) * 230) * Math.sin((i / 28) * Math.PI) ** 0.7;
        return <line key={i} x1={360 + i * 30} x2={360 + i * 30} y1={450 - h} y2={450 + h} {...line} strokeWidth={14} />;
      })}
    </>
  );
}

/** Two systems exchanging data through brackets and packets. */
function Integrations() {
  return (
    <>
      <rect x="170" y="260" width="340" height="380" rx="36" {...soft} />
      <rect x="1090" y="260" width="340" height="380" rx="36" {...soft} />
      {[330, 450, 570].map((y, i) => (
        <g key={y}>
          <path d={`M510 ${y} C 640 ${y}, 660 ${y + (i - 1) * 50}, 800 ${y + (i - 1) * 50} S 960 ${y}, 1090 ${y}`} {...line} strokeDasharray="2 18" className="animate-dash" />
          <circle cx={800} cy={y + (i - 1) * 50} r={16} {...solid} />
        </g>
      ))}
      <path d="M260 340 L215 390 L260 440 M420 340 L465 390 L420 440" {...line} />
      <path d="M1180 340 L1135 390 L1180 440 M1340 340 L1385 390 L1340 440" {...line} />
      <path d="M260 520 H420 M1180 520 H1340" {...line} strokeOpacity={0.6} />
    </>
  );
}

/** A magnifier over a grid of documents, with circuit traces below. */
function Operations() {
  return (
    <>
      {range(4).flatMap((r) =>
        range(7).map((c) => <rect key={`${r}-${c}`} x={250 + c * 160} y={150 + r * 130} width={110} height={90} rx={14} {...soft} fillOpacity={0.07} />),
      )}
      <circle cx="800" cy="400" r="170" {...line} strokeWidth={12} />
      <circle cx="800" cy="400" r="170" fill={W} fillOpacity={0.07} />
      <path d="M925 525 L1080 680" {...line} strokeWidth={26} />
      <path d="M250 800 H560 L610 750 H900 L950 800 H1350" {...line} strokeOpacity={0.6} />
    </>
  );
}

/** Many leads funnelling into a few owners. */
function Leads() {
  return (
    <>
      {range(11).map((i) => {
        const x = 240 + i * 112;
        return (
          <g key={i}>
            <circle cx={x} cy={170} r={16} {...solid} />
            <path d={`M${x} 190 C ${x} 330, 800 300, 800 470`} {...line} strokeOpacity={0.55} strokeWidth={3} />
          </g>
        );
      })}
      <path d="M800 470 V560" {...line} strokeWidth={10} />
      {[480, 800, 1120].map((x) => (
        <g key={x}>
          <path d={`M800 560 C 800 640, ${x} 620, ${x} 700`} {...line} />
          <circle cx={x} cy={750} r={52} {...soft} fillOpacity={0.25} />
        </g>
      ))}
    </>
  );
}

/** A browser window with a sidebar, content blocks and code chevrons. */
function WebApp() {
  return (
    <>
      <rect x="240" y="170" width="1120" height="620" rx="34" {...soft} fillOpacity={0.06} />
      <path d="M240 260 H1360" {...line} strokeOpacity={0.6} />
      {[310, 360, 410].map((x) => (
        <circle key={x} cx={x - 28} cy={215} r={11} {...solid} />
      ))}
      <rect x="280" y="300" width="230" height="450" rx="20" {...soft} />
      <rect x="550" y="300" width="780" height="130" rx="20" {...soft} />
      <rect x="550" y="465" width="370" height="285" rx="20" {...soft} />
      <rect x="960" y="465" width="370" height="285" rx="20" {...soft} />
      <path d="M690 560 L630 610 L690 660 M790 560 L850 610 L790 660 M755 545 L725 675" {...line} strokeWidth={9} />
    </>
  );
}

/** A loop of improvement with steps that rise. */
function Process() {
  return (
    <>
      <path d="M600 250 A 230 230 0 0 1 1000 330" {...line} strokeWidth={9} />
      <path d="M1000 330 L1010 255 M1000 330 L930 320" {...line} strokeWidth={9} />
      <path d="M1000 650 A 230 230 0 0 1 600 570" {...line} strokeWidth={9} />
      <path d="M600 570 L590 645 M600 570 L670 580" {...line} strokeWidth={9} />
      {range(6).map((i) => (
        <rect key={i} x={250 + i * 190} y={760 - (i + 1) * 70} width={130} height={(i + 1) * 70} rx={16} {...soft} fillOpacity={0.06 + i * 0.03} />
      ))}
      <circle cx="800" cy="450" r="60" {...soft} fillOpacity={0.3} />
    </>
  );
}

const scenes: ReactNode[] = [<Crm key="crm" />, <Workflow key="wf" />, <Voice key="voice" />, <Integrations key="api" />, <Operations key="ops" />, <Leads key="leads" />, <WebApp key="web" />, <Process key="proc" />];

// Where the soft glow sits for each scene, as percentages of the section.
const glow: [number, number][] = [
  [30, 40], [70, 35], [50, 45], [60, 55], [35, 60], [65, 30], [45, 40], [55, 65],
];

/**
 * Full-section backdrop for "What I work on": a blurred white scene that cross-fades to match the capability
 * being looked at. It sits behind the content, ignores the pointer, and is hidden from assistive tech.
 */
export function CapabilityBackdrop({ active }: { active: number }) {
  const [gx, gy] = glow[active] ?? glow[0];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-clip [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
    >
      {/* The scene stays centred on screen while you read down the list. */}
      <div className="sticky top-0 h-screen w-full">
        {/* One blur for all scenes keeps this cheap. */}
        <div className="absolute inset-0 blur-[7px]">
          {scenes.map((scene, i) => (
            <svg
              key={i}
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMid slice"
              className={`absolute inset-0 size-full transition-[opacity,transform] duration-1000 ease-premium ${
                i === active ? "scale-100 opacity-[0.4]" : "scale-105 opacity-0"
              }`}
            >
              {scene}
            </svg>
          ))}
        </div>
        <div
          className="absolute size-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_65%)] blur-2xl transition-[left,top] duration-1000 ease-premium"
          style={{ left: `${gx}%`, top: `${gy}%` }}
        />
      </div>
      {/* Darkens the areas behind the text so every line stays easy to read. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.72),rgba(10,10,10,0.25)_45%,rgba(10,10,10,0.78))]" />
    </div>
  );
}
