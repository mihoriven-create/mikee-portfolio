// The shared scroll-progress controller behind the gold storytelling background.
// The approach follows the Kage landing page (threeui.com): each chapter is anchored at the middle of its
// section, the page's scroll position becomes one continuous "progress" number, and that number is damped
// per frame so the whole environment eases toward wherever the visitor is. Everything on screen (camera,
// light, dust, trails) is derived from that single number, so scrolling back up simply plays it in reverse.

/** The existing sections the journey runs through, in page order: About Me → Contact. */
export const JOURNEY_SECTIONS = ["about", "expertise", "projects", "experience", "testimonials", "contact"] as const;

export type Waypoint = {
  /** Camera position and look-at target. The camera flies along a smooth curve through these. */
  p: [number, number, number];
  t: [number, number, number];
  /** Overall brightness, light shafts, dust, light trails, depth frames (all 0–1). */
  light: number;
  rays: number;
  dust: number;
  trail: number;
  frames: number;
  /** Speed of ambient motion: 1 is normal, lower settles toward stillness. */
  calm: number;
  /** Where the warm pool of light sits, in screen units from the centre. */
  pool: [number, number];
};

// One waypoint per section. The scenes in the brief map onto them like this:
//   about → Scene 1 (dark, subtle golden illumination)        expertise + experience → Scene 2 (light trails, depth)
//   projects → Scene 3 (immersive, layered parallax)           testimonials → the hand-over      contact → Scene 4 (settles)
export const WAYPOINTS: Waypoint[] = [
  { p: [0, 0.2, 8], t: [0, 0, -20], light: 0.7, rays: 0.45, dust: 0.75, trail: 0.12, frames: 0.55, calm: 1, pool: [0.18, 0.12] },
  { p: [1.2, 0.4, -12], t: [-0.5, 0, -40], light: 0.78, rays: 0.55, dust: 0.85, trail: 0.4, frames: 0.65, calm: 1, pool: [-0.2, 0.05] },
  { p: [-1.2, -0.1, -36], t: [0.5, 0.3, -64], light: 1, rays: 0.7, dust: 1, trail: 0.75, frames: 1.1, calm: 1, pool: [0.2, -0.05] },
  { p: [1, 0.5, -60], t: [0, 0, -88], light: 0.8, rays: 0.5, dust: 0.8, trail: 0.35, frames: 0.65, calm: 0.85, pool: [-0.15, 0.1] },
  { p: [-0.5, 0.1, -80], t: [0, 0, -106], light: 0.72, rays: 0.45, dust: 0.65, trail: 0.3, frames: 0.55, calm: 0.6, pool: [0.1, 0.05] },
  { p: [0, 0, -94], t: [0, 0.1, -120], light: 0.78, rays: 0.55, dust: 0.6, trail: 0.05, frames: 0.4, calm: 0.3, pool: [0, 0.08] },
];

export type SceneParams = Omit<Waypoint, "p" | "t" | "pool"> & { poolX: number; poolY: number };

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
/** Frame-rate independent easing toward a target (same as Kage's `damp`). */
export const damp = (cur: number, to: number, rate: number, dt: number) => lerp(cur, to, 1 - Math.exp(-rate * dt));

/** Live state shared by the page (writers: stage and driver) and the scene (reader). */
export const journey = {
  anchors: [] as number[],
  prog: 0,
  smooth: 0,
  /** Pointer position (-1…1) and its eased value, for a gentle hand-held parallax. */
  tmx: 0,
  tmy: 0,
  mx: 0,
  my: 0,
};

/** Works out the scroll position at which each chapter is centred. Call again whenever the layout changes. */
export function measureJourney() {
  const vh = window.innerHeight;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
  const anchors: number[] = [];
  for (const id of JOURNEY_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) {
      journey.anchors = [];
      return;
    }
    const rect = el.getBoundingClientRect();
    anchors.push(clamp(rect.top + window.scrollY + rect.height / 2 - vh / 2, 0, maxScroll));
  }
  // The last chapter is the end of the page, so the final scene is fully settled when the visitor arrives.
  anchors[anchors.length - 1] = maxScroll;
  for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
  journey.anchors = anchors;
}

/** Scroll position → chapter progress (0 = About centred … 5 = end of page), piecewise linear between anchors. */
export function progressFor(y: number) {
  const a = journey.anchors;
  if (a.length === 0 || y <= a[0]) return 0;
  for (let i = 0; i < a.length - 1; i++) {
    if (y <= a[i + 1]) return i + (y - a[i]) / (a[i + 1] - a[i]);
  }
  return a.length - 1;
}

/** Blends the waypoint settings around chapter progress `s`, easing between neighbouring chapters. */
export function sampleScene(s: number, out: SceneParams) {
  const n = WAYPOINTS.length - 1;
  const i = clamp(Math.floor(s), 0, n - 1);
  const f = smoothstep(0, 1, clamp(s - i, 0, 1));
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  out.light = lerp(a.light, b.light, f);
  out.rays = lerp(a.rays, b.rays, f);
  out.dust = lerp(a.dust, b.dust, f);
  out.trail = lerp(a.trail, b.trail, f);
  out.frames = lerp(a.frames, b.frames, f);
  out.calm = lerp(a.calm, b.calm, f);
  out.poolX = lerp(a.pool[0], b.pool[0], f);
  out.poolY = lerp(a.pool[1], b.pool[1], f);
}
