"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const loadSystemsCore = () => import("./SystemsCore");

// three.js stays out of the initial bundle and only loads in the browser.
const SystemsCore = dynamic(loadSystemsCore, { ssr: false });

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

export function HeroVisual() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);

  // The 3D scene is the heaviest thing on the page. It must never start because of a click or scroll
  // (that froze the page for about a second on slower computers), so it loads on its own once the page
  // has settled, in two separate idle steps: first download and evaluate the code, then create the scene.
  useEffect(() => {
    if (!supportsWebGL()) return;
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
  }, []);

  return (
    <div className="relative size-full">
      {/* Static glow doubles as the placeholder before the scene starts and the fallback without WebGL. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[55%] size-[min(70vw,46vh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.45)_0%,rgba(212,175,55,0.08)_45%,transparent_70%)] blur-2xl"
      />
      {ready && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}>
          <SystemsCore animate={!reduced} onReady={() => setShown(true)} />
        </div>
      )}
    </div>
  );
}
