// "Velocity" — a high-energy, shoe-first storefront template (neon-lime + crimson,
// heavy slanted display type, floating angled product shots). Fully tenant-driven:
// every image, price and link comes from the vendor's own config + products, so
// it works for any footwear store, not one brand. Shoes are the hero; other
// categories drop to a secondary rail at the bottom. Falls back gracefully when
// a store sells no shoes (uses its first category instead).
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import WhatsAppPromoBar from "../../components/store/WhatsAppPromoBar";
import ProductCard from "../../components/store/ProductCard";
import ReviewsSlider from "../../components/store/ReviewsSlider";
import { withStore } from "../../lib/tenant";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const isShoeCat = (c) => /shoe|footwear|sneaker|trainer/i.test(c || "");

// engineered footwear feature blurbs — brand-neutral, true of any performance shoe
const UPGRADES = [
  { tag: "01", title: "Protective Material", body: "Reinforced high-wear zones stand up to hard court play, session after session." },
  { tag: "02", title: "Multilayer Cushioning", body: "A stacked foam system keeps every step comfortable from warm-up to match point." },
  { tag: "03", title: "Upgraded Rubber", body: "A denser, abrasion-resistant outsole compound built to grip and to last." },
];
const TECH = ["Protective Material", "Multilayer Cushioning System", "High-Rebound Midsole", "Upgraded Abrasion-Resistant Rubber"];

export default function VelocityHome() {
  const { config, api } = useStore();
  const cats = config?.categories || [];
  const shoeCat = useMemo(() => cats.find(isShoeCat) || cats[0], [cats.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  const otherCats = cats.filter((c) => c !== shoeCat);

  const [products, setProducts] = useState(null); // shoe products
  const [gender, setGender] = useState("all");     // all | men | women

  useEffect(() => {
    if (!shoeCat) { setProducts([]); return; }
    api.products({ category: shoeCat, limit: 24 }).then((r) => setProducts(r.results || [])).catch(() => setProducts([]));
  }, [shoeCat]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = products || [];
  const hasGender = useMemo(() => list.some((p) => /women/i.test(p.catName || "")) || list.some((p) => /\bmen/i.test(p.catName || "")), [list]);
  const shown = useMemo(() => {
    if (gender === "all" || !hasGender) return list;
    if (gender === "women") return list.filter((p) => /women/i.test(p.catName || ""));
    return list.filter((p) => /\bmen/i.test(p.catName || "") && !/women/i.test(p.catName || ""));
  }, [list, gender, hasGender]);

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const floats = list.slice(0, 2); // hero floating shoes
  const mosaic = list.slice(0, 8).map((p) => p.thumbnail).filter(Boolean);
  const spotlights = list.filter((p) => p.thumbnail).slice(0, 2);
  const shopShoes = withStore(`/c/${encodeURIComponent(shoeCat || "all")}`);

  return (
    <div className="velocity">
      {/* ---------------- HERO ---------------- */}
      <section className="v-hero">
        <div className="v-wrap text-center relative z-10">
          <span className="v-pill-red">{(hero.subtitle || `${cap(shoeCat) || "New"} Collection`).toUpperCase()}</span>
          <h1 className="v-display v-hero-title">
            {hero.title || storeName || "Move Faster"}
          </h1>
          <Link to={shopShoes} className="v-btn-red mt-6">Explore the collection</Link>
        </div>
        {/* floating angled shoe shots pulled from real products */}
        <div className="v-hero-floats" aria-hidden="true">
          {floats[0]?.thumbnail && <img src={floats[0].thumbnail} alt="" referrerPolicy="no-referrer" className="v-float v-float-a" />}
          {floats[1]?.thumbnail && <img src={floats[1].thumbnail} alt="" referrerPolicy="no-referrer" className="v-float v-float-b" />}
        </div>
      </section>

      <WhatsAppPromoBar />

      {/* ---------------- THE UPGRADES ---------------- */}
      <section className="v-lime py-16">
        <div className="v-wrap">
          <h2 className="v-display v-h2 text-center mb-10">The Upgrades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {UPGRADES.map((u, i) => (
              <div key={u.tag} className="reveal flex flex-col items-center text-center">
                <div className="w-full aspect-[4/3] bg-white/50 mb-5 overflow-hidden flex items-center justify-center rounded-sm">
                  {list[i]?.thumbnail
                    ? <img src={list[i].thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    : <span className="text-black/30 text-4xl v-display">{u.tag}</span>}
                </div>
                <span className="v-tag-red">New</span>
                <h3 className="v-display text-xl mt-2 mb-1.5">{u.title}</h3>
                <p className="text-sm text-black/70 max-w-xs">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- GET THERE (product selector) ---------------- */}
      <section className="v-lime-soft py-16">
        <div className="v-wrap text-center">
          <h2 className="v-display v-h2 mb-2">Get There</h2>
          <p className="text-black/70 mb-8">The shoes designed to help you win the rally.</p>
          {hasGender && (
            <div className="flex items-center justify-center gap-6 mb-10">
              {["men", "women"].map((g) => (
                <button key={g} onClick={() => setGender(gender === g ? "all" : g)}
                  className={`v-display text-2xl md:text-3xl transition-colors ${gender === g ? "text-black" : "text-black/30 hover:text-black/60"}`}>
                  {g === "men" ? "Men's" : "Women's"}
                </button>
              ))}
            </div>
          )}
          {products === null ? (
            <div className="py-16 text-black/50">Loading…</div>
          ) : shown.length === 0 ? (
            <div className="py-16 text-black/50">No products yet.</div>
          ) : (
            <div className="stagger grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-9 text-left">
              {shown.slice(0, 8).map((p) => <ProductCard key={`${p.dbName}-${p.productId}`} product={p} />)}
            </div>
          )}
          <div className="mt-10">
            <Link to={shopShoes} className="v-btn-black">Shop all {cap(shoeCat)}</Link>
          </div>
        </div>
      </section>

      {/* ---------------- ENDORSEMENT / QUOTE ---------------- */}
      {config?.about && (
        <section className="v-lime py-16">
          <div className="v-wrap text-center max-w-3xl">
            <h2 className="v-display v-h2 mb-2">Stamp of Approval</h2>
            <div className="eyebrow mb-6 !text-black/60">Straight from the {cap(shoeCat) || "court"}</div>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-light" style={{ textWrap: "pretty" }}>
              “{config.about}”
            </p>
            <div className="v-display text-lg mt-6">— {storeName}</div>
          </div>
        </section>
      )}

      {/* ---------------- BANNER TICKER + MOSAIC ---------------- */}
      {mosaic.length >= 3 && (
        <section>
          <div className="v-banner v-display">MADE&nbsp;FOR&nbsp;{(cap(shoeCat) || "SPEED").toUpperCase()}</div>
          <div className="flex overflow-hidden">
            {mosaic.map((src, i) => (
              <div key={i} className="flex-1 min-w-0 aspect-square bg-black">
                <img src={src} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90" />
              </div>
            ))}
          </div>
          <div className="v-banner v-display">{storeName ? storeName.toUpperCase() : "PLAY HARD"}</div>
        </section>
      )}

      {/* ---------------- PRODUCT SPOTLIGHTS ---------------- */}
      {spotlights.map((p, i) => (
        <section key={`${p.dbName}-${p.productId}`} className={i % 2 ? "v-lime-soft" : "bg-paper"}>
          <div className="v-wrap py-16 grid md:grid-cols-2 gap-10 items-center">
            <div className={`reveal ${i % 2 ? "md:order-2" : ""}`}>
              <div className="eyebrow mb-3 !text-[var(--v-red)]">{p.productBrand || cap(shoeCat)}</div>
              <h2 className="v-display text-3xl md:text-4xl mb-4">{p.productName}</h2>
              <p className="text-ink-soft leading-relaxed mb-6">
                Built for players who want responsive court feel, lockdown support and all-day comfort — engineered to elevate your game.
              </p>
              <Link to={withStore(`/p/${p.dbName}/${p.productId}`)} className="inline-flex items-center gap-1.5 v-display text-sm hover:gap-2.5 transition-all">
                Shop {p.productName.split(" ").slice(0, 3).join(" ")} <ArrowRight size={16} />
              </Link>
            </div>
            <div className={`reveal ${i % 2 ? "md:order-1" : ""}`}>
              <div className="aspect-square bg-panel overflow-hidden">
                <img src={p.thumbnail} alt={p.productName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ---------------- EXPLODED TECH BREAKDOWN ---------------- */}
      <section className="v-ink text-white py-16">
        <div className="v-wrap grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="v-display v-h2 mb-8 text-[var(--v-lime)]">The Tech</h2>
            <ul className="space-y-5">
              {TECH.map((t) => (
                <li key={t} className="reveal flex items-start gap-3">
                  <span className="v-tag-red shrink-0 mt-0.5">New</span>
                  <span className="v-display text-lg">{t}</span>
                </li>
              ))}
            </ul>
            <Link to={shopShoes} className="v-btn-red mt-9">Shop Now</Link>
          </div>
          <div className="reveal">
            {list[0]?.thumbnail
              ? <img src={list[0].thumbnail} alt="" referrerPolicy="no-referrer" className="w-full object-contain drop-shadow-2xl" />
              : <div className="aspect-square bg-white/5" />}
          </div>
        </div>
      </section>

      {/* ---------------- ACTION HERO ---------------- */}
      {(hero.image_url || mosaic[0]) && (
        <section className="relative h-[52vh] min-h-[340px] overflow-hidden">
          <img src={hero.image_url || mosaic[0]} alt="" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <Link to={shopShoes} className="v-btn-red">Find your pair</Link>
          </div>
        </section>
      )}

      {/* reviews (vendor-added, reuses the shared auto-slider) */}
      <div className="v-lime-soft"><ReviewsSlider images={config?.reviews} /></div>

      {/* ---------------- SECONDARY CATEGORIES ---------------- */}
      {otherCats.length > 0 && (
        <section className="v-wrap py-14">
          <h2 className="v-display v-h2 text-center mb-8">Also in store</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {otherCats.map((c) => (
              <Link key={c} to={withStore(`/c/${encodeURIComponent(c)}`)} className="group block text-center">
                <div className="aspect-square bg-panel mb-3 flex items-center justify-center v-display text-xl group-hover:bg-[var(--v-lime)] transition-colors">{cap(c)}</div>
                <span className="text-sm text-ink-soft">{cap(c)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .velocity {
          --v-lime: #d8ff53; --v-lime-soft: #e9ff8a; --v-red: #d90429; --v-ink: #0d0d0d;
          overflow-x: clip;
        }
        .velocity .v-hero-title { overflow-wrap: anywhere; }
        .velocity .v-wrap { max-width: 72rem; margin: 0 auto; padding-left: 1rem; padding-right: 1rem; }
        .velocity .v-lime { background: var(--v-lime); color: var(--v-ink); }
        .velocity .v-lime-soft { background: var(--v-lime-soft); color: var(--v-ink); }
        .velocity .v-ink { background: var(--v-ink); }
        .velocity .v-display {
          font-weight: 900; font-style: italic; text-transform: uppercase;
          letter-spacing: -0.01em; line-height: 0.95; transform: skewX(-6deg);
        }
        .velocity .v-h2 { font-size: clamp(2rem, 6vw, 3.75rem); }
        .velocity .v-hero {
          position: relative; overflow: hidden; padding: clamp(3.5rem, 9vw, 7rem) 0 clamp(9rem, 22vw, 14rem);
          background: radial-gradient(120% 120% at 50% 0%, var(--v-lime) 40%, var(--v-lime-soft) 100%);
          color: var(--v-ink);
        }
        .velocity .v-hero-title { font-size: clamp(2.75rem, 12vw, 8rem); margin-top: 1rem; }
        .velocity .v-hero-floats { position: absolute; inset: 0; pointer-events: none; }
        .velocity .v-float {
          position: absolute; width: clamp(160px, 34vw, 420px); object-fit: contain;
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.35));
        }
        .velocity .v-float-a { right: 3%; bottom: -4%; transform: rotate(-14deg); }
        .velocity .v-float-b { left: 3%; bottom: 2%; transform: rotate(10deg); width: clamp(120px, 24vw, 300px); opacity: 0.96; }
        .velocity .v-pill-red, .velocity .v-tag-red {
          display: inline-block; background: var(--v-red); color: #fff; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .velocity .v-pill-red { font-size: 11px; padding: 6px 14px; border-radius: 999px; }
        .velocity .v-tag-red { font-size: 10px; padding: 3px 8px; border-radius: 3px; }
        .velocity .v-btn-red, .velocity .v-btn-black {
          display: inline-flex; align-items: center; gap: 8px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.04em; font-size: 14px; padding: 14px 30px; border-radius: 999px;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .velocity .v-btn-red { background: var(--v-red); color: #fff; }
        .velocity .v-btn-black { background: var(--v-ink); color: #fff; }
        .velocity .v-btn-red:hover, .velocity .v-btn-black:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .velocity .v-banner {
          background: var(--v-ink); color: #fff; text-align: center; padding: 14px 0;
          font-size: clamp(1.25rem, 4vw, 2.25rem); overflow: hidden; white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
