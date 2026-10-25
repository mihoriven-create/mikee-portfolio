"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// three.js stays out of the initial bundle and only loads in the browser.
const SystemsCore = dynamic(() => import("./SystemsCore"), { ssr: false });

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

  useEffect(() => {
    if (!supportsWebGL()) return;
    // Wait for the browser to be idle so the 3D scene never competes with first paint.
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative size-full">
      {/* Static glow doubles as the fallback when WebGL is unavailable. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[55%] size-[min(70vw,46vh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.45)_0%,rgba(212,175,55,0.08)_45%,transparent_70%)] blur-2xl"
      />
      {ready && <SystemsCore animate={!reduced} />}
    </div>
  );
}
