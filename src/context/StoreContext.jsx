// Resolves which vendor this page load belongs to and loads their branding.
// Every other provider (cart, customer auth) and every page reads from here —
// this is what makes one deploy serve every vendor's storefront.
import React, { createContext, useContext, useEffect, useState } from "react";
import { resolveSlug, storeApi } from "../lib/storeApi";

const StoreCtx = createContext(null);

// --- palette helpers ----------------------------------------------------------
function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
// Item 4: text/foreground on a coloured surface is ONLY black or white, chosen
// for contrast by relative luminance (WCAG). Light surface → near-black; dark → white.
function contrastText(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.55 ? "#111111" : "#ffffff";
}
function warm(hex) {
  const p = String(hex || "").trim().toLowerCase();
  return (p === "#000" || p === "#000000" || p === "black") ? "#1a1512" : hex;
}
// Set --store-{primary,secondary,complementary,bg} and their contrast --store-on-* vars.
function applyTheme(theme) {
  const root = document.documentElement.style;
  const set = (name, val, fallback) => {
    const v = val || fallback;
    if (!v) return;
    root.setProperty(`--store-${name}`, name === "primary" ? warm(v) : v);
    root.setProperty(`--store-on-${name}`, contrastText(name === "primary" ? warm(v) : v));
  };
  set("primary", theme?.primary);
  set("secondary", theme?.secondary);
  set("complementary", theme?.complementary);
  if (theme?.background) {
    const bg = theme.background;
    const onBg = contrastText(bg);
    root.setProperty("--store-bg", bg);
    root.setProperty("--store-on-bg", onBg);
    document.body.style.background = bg; // paint the page in the vendor's bg colour

    // Re-derive the design's text + surface tokens from the vendor's background
    // so EVERY surface (cards, panels, borders) and all body/muted text keep
    // readable contrast on that background — not just the accent elements.
    const mix = (pct) => `color-mix(in srgb, ${onBg} ${pct}%, ${bg})`;
    root.setProperty("--color-paper", bg);
    root.setProperty("--color-panel", mix(6));
    root.setProperty("--color-ink", onBg);
    root.setProperty("--color-ink-soft", mix(74));
    root.setProperty("--color-muted", mix(50));
    root.setProperty("--color-line", mix(14));
    root.setProperty("--color-line-strong", mix(26));
  }
}

export function StoreProvider({ children }) {
  const [slug] = useState(resolveSlug);
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | error
  const api = storeApi(slug);

  useEffect(() => {
    if (!slug) { setStatus("not-found"); return; }
    api.config()
      .then((c) => { setConfig(c); setStatus("ready"); })
      .catch((e) => setStatus(e.status === 404 ? "not-found" : "error"));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (config?.theme) applyTheme(config.theme);
    if (config?.store_name) {
      document.title = config.store_name;
    }
    // Analytics pixels — injected once per page load. React StrictMode
    // double-mounts everything in dev; guard with an id we can look up.
    const ga = config?.analytics?.ga4_id;
    if (ga && !document.getElementById("spp-ga4-loader")) {
      const s1 = document.createElement("script");
      s1.id = "spp-ga4-loader";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.id = "spp-ga4-init";
      s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga)});`;
      document.head.appendChild(s2);
    }
    const meta = config?.analytics?.meta_pixel_id;
    if (meta && !document.getElementById("spp-meta-pixel")) {
      const s = document.createElement("script");
      s.id = "spp-meta-pixel";
      s.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(meta)});fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, [config]);

  return (
    <StoreCtx.Provider value={{ slug, config, status, api }}>
      {children}
    </StoreCtx.Provider>
  );
}

export const useStore = () => useContext(StoreCtx);
