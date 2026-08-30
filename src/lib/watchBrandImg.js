// Default brand images for watch brands, bundled in src/assets/watch/*. Used as
// the fallback tile image when a vendor hasn't set their own brand thumbnail.
// Matches by normalised name (case/spacing/punctuation-insensitive), with a
// prefix fallback so "Vacheron Constantin" finds the "Vacheron" file.
const files = import.meta.glob("../assets/watch/*", { eager: true, query: "?url", import: "default" });

const nk = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const byKey = {};
for (const [path, url] of Object.entries(files)) {
  const name = path.split("/").pop().replace(/\.[^.]+$/, "");
  byKey[nk(name)] = url;
}

export function watchBrandImg(brand) {
  const k = nk(brand);
  if (!k) return null;
  if (byKey[k]) return byKey[k];
  for (const [fk, url] of Object.entries(byKey)) {
    if (fk.length >= 4 && (k.startsWith(fk) || fk.startsWith(k))) return url;
  }
  return null;
}
