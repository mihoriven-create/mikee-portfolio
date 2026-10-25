"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling for wheel and trackpad. It drives the native window scroll,
 * so sticky elements and scroll-linked animations keep working. Touch scrolling stays native,
 * and it is skipped entirely for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      // In-page links (#about, #projects…) glide to their section. Lenis honours the CSS
      // scroll-padding-top on <html>, which already keeps sections clear of the fixed navbar.
      anchors: true,
      // Let scrollable panels (mobile menu, Let's Connect popover, thumbnail strips) scroll on their own.
      allowNestedScroll: true,
    });

    // Menus and the screenshot viewer lock the page by setting overflow: hidden on <body>;
    // pause smooth scrolling while they are open.
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
