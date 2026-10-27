"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const loadSystemsCore = () => import("./SystemsCore");

// three.js stays out of the initial bundle and only loads in the browser.
const SystemsCore = dynamic(loadSystemsCore, { ssr: false });

/** Reads a browser-only fact without a hydration mismatch (the server always sees `false`). */
function useBrowserFlag(read: () => boolean) {
  return useSyncExternalStore(
    () => () => {},
    read,
    () => false,
  );
}

// ?orb-poster renders just the orb on a transparent page, to produce public/orb-poster.webp.
const isPosterCapture = () => new URLSearchParams(window.location.search).has("orb-poster");

// Visitors on data-saver mode or a 2G connection keep the picture and skip the heavy 3D download.
const wantsLightPage = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!connection && (connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? ""));
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Runs `task` when the browser is idle (or after `timeout` ms at the latest). Returns a cancel function. */
function whenIdle(task: () => void, timeout: number) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(task, 300);
  return () => clearTimeout(id);
}

/**
 * The hero orb. A pre-rendered picture of it is part of the page, so it appears with the first paint.
 * The live 3D scene (a large download) loads afterwards and fades in over the picture.
 */
export function HeroVisual() {
  const reduced = useReducedMotion();
  const capture = useBrowserFlag(isPosterCapture);
  const lightPage = useBrowserFlag(wantsLightPage);
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // The orb stops drawing once it has scrolled out of view (the page below has its own 3D to render).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced-motion and data-saver visitors never need the live scene: the picture is the orb.
  const skipLive = !!reduced || lightPage;
  const showLive = capture || (ready && !skipLive);
  const liveVisible = capture || shown;

  // The 3D scene is the heaviest thing on the page. It must never start because of a click or scroll
  // (that froze the page for about a second on slower computers), so it loads on its own once the page
  // has settled, in two separate idle steps: first download and evaluate the code, then create the scene.
  useEffect(() => {
    if (capture || skipLive || !supportsWebGL()) return;
    let cancelStep: (() => void) | undefined;
    let calmTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const startedAt = performance.now();
    let lastInput = 0;

    // Even while idle, creating the scene is a short stall — so avoid doing it while the visitor is
    // actively moving, clicking or scrolling. Wait for a brief calm moment, but never longer than 4 s.
    const markInput = () => {
      lastInput = performance.now();
    };
    const INPUT_EVENTS = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;
    INPUT_EVENTS.forEach((e) => window.addEventListener(e, markInput, { passive: true }));

    const whenCalm = (task: () => void) => {
      if (cancelled) return;
      const busy = performance.now() - lastInput < 600;
      if (busy && performance.now() - startedAt < 4000) {
        calmTimer = setTimeout(() => whenCalm(task), 200);
        return;
      }
      task();
    };

    // Step 1: download and evaluate the 3D code. Step 2: create the scene. Each waits for idle and calm.
    const begin = () => {
      cancelStep = whenIdle(() => {
        whenCalm(() => {
          loadSystemsCore().then(() => {
            if (cancelled) return;
            cancelStep = whenIdle(() => whenCalm(() => setReady(true)), 150);
          });
        });
      }, 250);
    };

    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", begin);
      INPUT_EVENTS.forEach((e) => window.removeEventListener(e, markInput));
      cancelStep?.();
      if (calmTimer !== undefined) clearTimeout(calmTimer);
    };
  }, [capture, skipLive]);

  return (
    <div ref={rootRef} className="relative size-full" style={{ containerType: "size" }}>
      {/* Soft glow behind the picture; also the fallback if images or WebGL are unavailable. */}
      {!capture && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[58%] size-[min(70vw,46vh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.45)_0%,rgba(212,175,55,0.08)_45%,transparent_70%)] blur-2xl"
        />
      )}
      {/* The pre-rendered orb: in the page from the first byte, sized and placed exactly like the live one. */}
      {!capture && (
        <Image
          src="/orb-poster.webp"
          alt=""
          width={900}
          height={900}
          fetchPriority="high"
          loading="eager"
          unoptimized
          draggable={false}
          data-orb-poster
          aria-hidden="true"
          className={`orb-poster transition-opacity duration-700 ${liveVisible ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {showLive && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${liveVisible ? "opacity-100" : "opacity-0"}`}>
          <SystemsCore animate={!reduced && !capture} poster={capture} paused={!onScreen} onReady={() => setShown(true)} />
        </div>
      )}
    </div>
  );
}
