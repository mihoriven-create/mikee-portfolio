"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// three.js stays out of the initial bundle and only loads in the browser.
const SystemsCore = dynamic(() => import("./SystemsCore"), { ssr: false });

const INTERACTION_EVENTS = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);

  // The 3D scene is the heaviest thing on the page, so it starts only once the page has finished
  // loading and the browser is idle — or immediately when the visitor first interacts.
  useEffect(() => {
    if (!supportsWebGL()) return;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      window.removeEventListener("load", afterLoad);
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, start));
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timer !== undefined) clearTimeout(timer);
    };
    function start() {
      setReady(true);
      cleanup();
    }
    function afterLoad() {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 3000 });
      else timer = setTimeout(start, 1500);
    }

    INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return cleanup;
  }, []);

  return (
    <div className="relative size-full">
      {/* Static glow doubles as the placeholder before the scene starts and the fallback without WebGL. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[55%] size-[min(70vw,46vh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.45)_0%,rgba(212,175,55,0.08)_45%,transparent_70%)] blur-2xl"
      />
      {ready && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${shown ? "opacity-100" : "opacity-0"}`}>
          <SystemsCore animate={!reduced} onReady={() => setShown(true)} />
        </div>
      )}
    </div>
  );
}
