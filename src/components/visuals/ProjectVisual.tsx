import {
  ArrowRight,
  AudioLines,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Cloud,
  FileSignature,
  FileUp,
  GitBranch,
  Lock,
  Mail,
  MessageSquare,
  Server,
  Sheet,
  Timer,
  Users,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ProjectVisualKind } from "@/data/projects";

// Stylised, code-drawn interfaces. They illustrate how each system is shaped and
// deliberately contain no client data, names, or numbers.

function Chip({ icon: Icon, label, accent = false }: { icon: LucideIcon; label: string; accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-wider sm:text-xs ${
        accent ? "border-gold/70 bg-gold/15 text-gold-light" : "border-gold/20 bg-ink-3 text-mist"
      }`}
    >
      <Icon className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function Line({ w }: { w: string }) {
  return <div className="h-2 rounded-full bg-mist/15" style={{ width: w }} />;
}

function Field({ label, file = false }: { label: string; file?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-mist/60">{label}</span>
      <div className={`flex h-8 items-center rounded-lg border px-3 ${file ? "border-dashed border-gold/40 bg-gold/5" : "border-mist/15 bg-ink"}`}>
        {file ? <FileUp className="size-3.5 text-gold" aria-hidden="true" /> : <Line w="55%" />}
      </div>
    </div>
  );
}

function Intake() {
  return (
    <div className="grid h-full grid-cols-[1.4fr_1fr] gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-gold/15 bg-ink-2 p-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-gold/60" />
          <span className="size-2 rounded-full bg-mist/30" />
          <span className="size-2 rounded-full bg-mist/30" />
          <span className="ml-2 h-4 flex-1 rounded-md bg-ink" />
        </div>
        <Field label="Business" />
        <Field label="Deal details" />
        <Field label="Documents" file />
        <div className="mt-auto h-8 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-light" />
      </div>
      <div className="flex flex-col justify-center gap-3">
        <Chip icon={Lock} label="Private storage" />
        <ArrowRight className="mx-auto size-4 rotate-90 text-gold/60" aria-hidden="true" />
        <Chip icon={Users} label="GoHighLevel" accent />
        <div className="mt-2 grid gap-2 lg:grid-cols-2">
          <Chip icon={GitBranch} label="GitHub" />
          <Chip icon={Cloud} label="Vercel" />
        </div>
      </div>
    </div>
  );
}

function WorkflowGraph() {
  const steps: { icon: LucideIcon; label: string; accent?: boolean }[] = [
    { icon: Users, label: "Lead enters", accent: true },
    { icon: MessageSquare, label: "SMS" },
    { icon: Timer, label: "Wait" },
    { icon: Mail, label: "Email" },
    { icon: Workflow, label: "Tag & route" },
    { icon: CalendarCheck, label: "Book call", accent: true },
  ];
  return (
    <div className="relative grid h-full grid-cols-2 content-center gap-x-4 gap-y-4 sm:gap-x-16 sm:px-2">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path
          d="M28 18 L72 18 L72 50 L28 50 L28 82 L72 82"
          fill="none"
          stroke="#d4af37"
          strokeOpacity="0.5"
          strokeWidth="0.6"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
          className="animate-dash"
        />
      </svg>
      {[0, 1, 3, 2, 4, 5].map((i) => (
        <div key={i} className="relative">
          <Chip {...steps[i]} />
        </div>
      ))}
    </div>
  );
}

function Voice() {
  const bars = Array.from({ length: 28 }, (_, i) => 0.3 + Math.abs(Math.sin(i * 1.7)) * 0.7);
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3 rounded-2xl border border-gold/15 bg-ink-2 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
          <AudioLines className="size-5" aria-hidden="true" />
        </span>
        <div className="flex h-10 flex-1 items-center gap-[3px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="animate-wave flex-1 rounded-full bg-gradient-to-t from-gold-deep to-gold-light"
              style={{ height: `${h * 100}%`, animationDelay: `${(i % 7) * -0.15}s` }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 rounded-2xl border border-gold/15 bg-ink-2 p-4">
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-gold">
          <Bot className="size-3.5" aria-hidden="true" /> AI summary
        </div>
        <Line w="92%" />
        <Line w="78%" />
        <Line w="85%" />
        <Line w="60%" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Chip icon={CalendarCheck} label="Booking logic" />
        <Chip icon={Users} label="CRM note" accent />
      </div>
    </div>
  );
}

function Sheets() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-gold/15 bg-ink-2">
        <div className="flex items-center gap-2 border-b border-gold/15 px-3 py-2 font-mono text-[0.65rem] text-gold-light sm:text-xs">
          <Sheet className="size-3.5 text-gold" aria-hidden="true" />
          <span className="text-mist/60">fx</span> =TODAY() − Created
        </div>
        <div className="grid grid-cols-3 text-[0.6rem] uppercase tracking-wider text-mist/70 sm:text-[0.65rem]">
          {["Contact", "Created", "Lead age"].map((h) => (
            <div key={h} className="border-b border-r border-gold/10 px-3 py-2 font-semibold text-gold/80 last:border-r-0">
              {h}
            </div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-b border-r border-gold/10 px-3 py-2.5 last:border-r-0 ${i % 3 === 2 ? "bg-gold/5" : ""}`}>
              <Line w={i % 3 === 2 ? "40%" : "70%"} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 items-center gap-2">
        <Chip icon={Sheet} label="Apps Script" />
        <Chip icon={Webhook} label="Webhook" accent />
        <Chip icon={Users} label="CRM" />
      </div>
    </div>
  );
}

function Calculator() {
  return (
    <div className="mx-auto flex h-full w-full max-w-sm flex-col gap-3 rounded-2xl border border-gold/15 bg-ink-2 p-5">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">DSCR Calculator</p>
      <Field label="Property figures" />
      <Field label="Loan details" />
      <div className="mt-auto flex items-center justify-between rounded-xl border border-gold/50 bg-gold/10 px-4 py-3">
        <span className="font-display text-xs uppercase tracking-[0.25em] text-gold-light">DSCR</span>
        <span className="font-display text-2xl font-semibold text-gold-light" aria-hidden="true">
          —
        </span>
      </div>
    </div>
  );
}

function Infra() {
  const ring: { icon: LucideIcon; label: string }[] = [
    { icon: Users, label: "CRM" },
    { icon: Webhook, label: "APIs" },
    { icon: Mail, label: "Microsoft 365" },
    { icon: FileSignature, label: "Acrobat Sign" },
    { icon: Workflow, label: "Zapier" },
    { icon: Server, label: "Backend" },
  ];
  return (
    <div className="relative grid h-full place-items-center">
      <div aria-hidden="true" className="absolute size-[62%] rounded-full border border-dashed border-gold/25" />
      <div className="relative z-10 grid size-20 place-items-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-deep text-ink shadow-[0_0_60px_rgba(212,175,55,0.45)] sm:size-24">
        <CheckCircle2 className="size-8" aria-hidden="true" />
      </div>
      {ring.map((node, i) => {
        const a = (i / ring.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div
            key={node.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + Math.cos(a) * 36}%`, top: `${50 + Math.sin(a) * 38}%` }}
          >
            <Chip icon={node.icon} label={node.label} accent={i === 0} />
          </div>
        );
      })}
    </div>
  );
}

const visuals: Record<ProjectVisualKind, () => React.JSX.Element> = {
  intake: Intake,
  workflow: WorkflowGraph,
  voice: Voice,
  sheets: Sheets,
  calculator: Calculator,
  infra: Infra,
};

export function ProjectVisual({ kind }: { kind: ProjectVisualKind }) {
  const Visual = visuals[kind];
  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-gold/20 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.14),transparent_60%),linear-gradient(180deg,#151311,#0c0b0a)] p-4 sm:rounded-[36px] sm:p-6">
      <div className="min-h-[240px] flex-1" aria-hidden="true">
        <Visual />
      </div>
      <figcaption className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-mist/45">Illustrative interface</figcaption>
    </figure>
  );
}
