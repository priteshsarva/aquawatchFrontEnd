import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Cross-browser scroll-reveal engine (a lightweight stand-in for GSAP/ScrollTrigger
// that works in every browser — the site's CSS `animation-timeline` reveal only
// runs in Chromium). `.reveal` elements fade + rise as they enter the viewport;
// `.stagger` grids cascade their children in. A MutationObserver catches
// async-loaded content (product grids arrive after their fetch). The hidden
// initial state is gated behind the `reveal-on` class this hook adds, so if the
// JS never runs (or reduced-motion is on) everything stays fully visible.
export function useScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reveal-on");

    // add `in-view`; the stagger cascade delay is pure CSS (nth-child), so this
    // needs nothing more even when a grid fills with async children later.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    const seen = new WeakSet();
    const register = (el) => {
      if (seen.has(el)) return;
      seen.add(el);
      // above-the-fold on arrival → reveal now (no flash), else wait for scroll
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add("in-view");
      else io.observe(el);
    };
    const scan = (node) => {
      if (node.nodeType !== 1) return;
      if (node.matches?.(".reveal, .stagger")) register(node);
      node.querySelectorAll?.(".reveal, .stagger").forEach(register);
    };

    scan(document.body);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) for (const n of m.addedNodes) scan(n);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
}
