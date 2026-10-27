"use client";

import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { journey, measureJourney } from "./journeyState";

// three.js and the scene stay out of the initial bundle; they load once the visitor is nearly there.
const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

/** Reads a browser-only fact without a hydration mismatch (the server always sees `false`). */
function useBrowserFlag(read: () => boolean) {
  return useSyncExternalStore(
    () => () => {},
    read,
    () => false,
  );
}

// Visitors on data-saver mode or a 2G connection keep the plain dark background and skip the 3D download.
const wantsLightPage = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!connection && (connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? ""));
};
const isLowPower = () => matchMedia("(hover: none)").matches || window.innerWidth < 768;
const hasPointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Wraps the sections from About Me through Contact. Behind them it pins one full-screen environment that
 * evolves with scroll progress; the content, links and layout stay exactly as they were, on top.
 * Nothing before this wrapper (the hero, the tool strip) is touched.
 */
export function JourneyStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const lightPage = useBrowserFlag(wantsLightPage);
  const low = useBrowserFlag(isLowPower);
  const [webgl] = useState(() => (typeof window === "undefined" ? true : supportsWebGL()));
  const [near, setNear] = useState(false); // within a couple of screens: start loading
  const [visible, setVisible] = useState(false); // on screen: draw frames
  const [ready, setReady] = useState(false);

  const enabled = !lightPage && webgl;

  // Know when the visitor is close (so the scene is ready on arrival) and when it is on screen (so no
  // frames are drawn while the hero is showing).
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !enabled) return;
    const watch = (rootMargin: string, set: (v: boolean) => void) => {
      const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), { rootMargin });
      io.observe(el);
      return io;
    };
    const a = watch("200% 0px 200% 0px", setNear);
    const b = watch("0px", setVisible);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, [enabled]);

  // Chapter anchors depend on layout, so measure again whenever the stage or window changes size.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !enabled) return;
    measureJourney();
    const ro = new ResizeObserver(measureJourney);
    ro.observe(el);
    window.addEventListener("resize", measureJourney);
    window.addEventListener("load", measureJourney);
    document.fonts?.ready.then(measureJourney);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureJourney);
      window.removeEventListener("load", measureJourney);
    };
  }, [enabled]);

  // A gentle pointer drift, on devices that have a pointer.
  useEffect(() => {
    if (!enabled || reduced || !hasPointer()) return;
    const move = (e: PointerEvent) => {
      journey.tmx = (e.clientX / window.innerWidth) * 2 - 1;
      journey.tmy = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, reduced]);

  return (
    <div ref={stageRef} className="relative isolate">
      {/* Pinned for the whole range, then released with the Contact section. -mb pulls the content up under it. */}
      <div aria-hidden="true" className="pointer-events-none sticky top-0 -z-10 -mb-[100lvh] h-[100lvh] w-full overflow-clip">
        {/* Plain dark gold glow: what visitors without 3D see, and what shows while the scene loads. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(212,175,55,0.10),transparent_60%),radial-gradient(ellipse_at_20%_85%,rgba(212,175,55,0.06),transparent_55%)]" />
        {enabled && near && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <JourneyScene active={visible} reduced={reduced} low={low} onReady={() => setReady(true)} />
          </div>
        )}
        {/* Keeps every line of text comfortably readable over the scene. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.4),rgba(10,10,10,0.58))]" />
      </div>
      {children}
    </div>
  );
}
