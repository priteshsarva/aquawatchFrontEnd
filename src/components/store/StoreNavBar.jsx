// Storefront header — announcement bar on top, main row (logo · nav · search ·
// account · cart) below, on a warm glass surface. All content is vendor-driven
// from StoreContext.
//
// Nav categories come from the vendor's curated `config.nav.items` (set in the
// portal's "Navigation & front page" panel); with none configured it falls back
// to every category the store sells. The account area shows Login when logged
// out, and the customer's name → Dashboard / Logout when logged in.
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Heart, ArrowRight, ChevronDown, LogOut } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { withStore } from "../../lib/tenant";
import StoreAnnouncementBar from "./StoreAnnouncementBar";
import ProductCard from "./ProductCard";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Curated nav items → [{ category, label }]; falls back to raw categories.
function navItemsFrom(config) {
  const items = config?.nav?.items;
  if (Array.isArray(items) && items.length) {
    return items.filter((i) => i && i.category).map((i) => ({ category: i.category, label: i.label || cap(i.category) }));
  }
  return (config?.categories || []).map((c) => ({ category: c, label: cap(c) }));
}

// Small count badge (cart / wishlist) — one accent, one shape, everywhere.
function CountBadge({ n }) {
  if (!n) return null;
  return (
    <span
      className="absolute -top-2 -right-2 text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center num"
      style={{ background: "var(--store-primary, #1a1512)", color: "var(--store-on-primary, #fff)" }}
    >
      {n}
    </span>
  );
}

// A top-level category link with a hover dropdown of its sub-categories (from
// the vendor's category map) and then its featured brands. Priority in the menu:
// parent category (the link) → sub-categories → brands.
function CategoryNav({ item, subcats, brands }) {
  const [open, setOpen] = useState(false);
  const subs = subcats || [];
  const brs = brands || [];
  const hasMenu = subs.length > 0 || brs.length > 0;
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        to={withStore(`/c/${encodeURIComponent(item.category)}`)}
        className="flex items-center gap-1 uppercase tracking-[0.12em] capitalize hover:text-ink transition-colors"
      >
        {item.label}{hasMenu && <ChevronDown size={13} />}
      </Link>
      {open && hasMenu && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-40">
          <div className="bg-paper border border-line shadow-[var(--shadow-md)] min-w-[210px] py-2 max-h-[70vh] overflow-y-auto">
            {subs.length > 0 && (
              <>
                <div className="px-4 py-1 text-[10px] uppercase tracking-[0.14em] text-muted">Categories</div>
                {subs.map((sc) => (
                  <Link
                    key={sc.name}
                    to={withStore(`/c/${encodeURIComponent(item.category)}?cat=${encodeURIComponent(sc.name)}`)}
                    className="block px-4 py-2 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors"
                  >
                    {sc.name}
                  </Link>
                ))}
              </>
            )}
            {brs.length > 0 && (
              <>
                <div className={`px-4 py-1 text-[10px] uppercase tracking-[0.14em] text-muted ${subs.length ? "mt-1 border-t border-line pt-2" : ""}`}>Brands</div>
                {brs.map((b) => (
                  <Link
                    key={b.brand}
                    to={withStore(`/c/${encodeURIComponent(item.category)}?brand=${encodeURIComponent(b.brand)}`)}
                    className="block px-4 py-2 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors"
                  >
                    {b.label || b.brand}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StoreNavBar() {
  const { config, api } = useStore();
  const { count } = useCart();
  const wishlist = useWishlist();
  const auth = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null); // null = idle, [] = no results
  const debounceRef = useRef(null);

  const navItems = navItemsFrom(config);
  // Featured brands, grouped under their parent category → each category's menu
  // dropdown lists its sub-categories (from the vendor's map) then its brands.
  const navBrands = Array.isArray(config?.nav?.brands) ? config.nav.brands.filter((b) => b && b.brand) : [];
  const brandsByCat = navBrands.reduce((m, b) => { (m[b.category] ||= []).push(b); return m; }, {});
  const [subcats, setSubcats] = useState({}); // category -> [{ name, mapped }]
  const catKey = navItems.map((i) => i.category).join("|");
  const customer = auth?.customer;
  const onHome = location.pathname === "/";

  // fetch each category's sub-categories once (for the dropdowns)
  useEffect(() => {
    let alive = true;
    Promise.all(navItems.map((it) => api.subcategories(it.category).then((r) => [it.category, r.subcategories || []]).catch(() => [it.category, []])))
      .then((pairs) => { if (alive) setSubcats(Object.fromEntries(pairs)); });
    return () => { alive = false; };
  }, [catKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // live search: 3+ chars, debounced 250ms — same threshold the original had
  useEffect(() => {
    if (!searchOpen) return;
    const term = q.trim();
    if (term.length < 3) { setResults(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api.products({ q: term, limit: 6, category: "all" }).then((r) => setResults(r.results || [])).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [q, searchOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // close the search overlay on Escape
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSearch();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function submitSearch(e) {
    e?.preventDefault?.();
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); closeSearch(); }
  }
  function closeSearch() { setSearchOpen(false); setQ(""); setResults(null); }
  function doLogout() { auth?.logout(); setAcctOpen(false); setMenuOpen(false); navigate("/"); }

  const iconBtn = "text-ink-soft hover:text-ink transition-colors";

  return (
    // NOTE: the search + mobile-menu overlays are rendered as SIBLINGS of
    // <header>, not children. The header uses backdrop-blur, and a
    // backdrop-filter establishes a containing block for position:fixed
    // descendants — nesting the overlays inside would size their `fixed
    // inset-0` to the 64px header instead of the viewport (drawer collapses to
    // a strip). Keeping them outside anchors `fixed` to the viewport.
    <>
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        background: "color-mix(in srgb, var(--store-bg, #faf8f5) 85%, transparent)",
        borderColor: "color-mix(in srgb, var(--store-on-bg, #1a1512) 12%, transparent)",
      }}
    >
      <StoreAnnouncementBar />

      <div className="store-nav max-w-screen-xl mx-auto px-4 lg:px-6 h-16 md:h-20 flex items-center gap-4">
        <button className="md:hidden text-ink-soft hover:text-ink" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link to={withStore("/")} className="flex items-center gap-2 shrink-0">
          {config?.logo_url
            ? <img src={config.logo_url} alt={config.store_name} className="h-10 md:h-12 w-auto" />
            : <span className="font-display text-xl md:text-2xl tracking-tight text-ink">{config?.store_name}</span>}
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-[13px] font-medium text-ink-soft">
          <Link
            to={withStore("/")}
            className={`uppercase tracking-[0.12em] hover:text-ink transition-colors ${onHome ? "text-ink" : ""}`}
          >
            Home
          </Link>
          {/* Each category is a link with a dropdown of its sub-categories + brands */}
          {navItems.map((it) => (
            <CategoryNav key={it.category} item={it} subcats={subcats[it.category]} brands={brandsByCat[it.category]} />
          ))}
          {/* Shop = all products mixed across every category */}
          <Link to={withStore("/c/all")} className="uppercase tracking-[0.12em] hover:text-ink transition-colors">Shop</Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 md:gap-5">
          <button onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search">
            <Search size={20} strokeWidth={1.75} />
          </button>

          {/* Account: logged-out → Login; logged-in → name → Dashboard / Logout */}
          {customer ? (
            <div className="relative hidden sm:block" onMouseLeave={() => setAcctOpen(false)}>
              <button
                onClick={() => setAcctOpen((o) => !o)}
                onMouseEnter={() => setAcctOpen(true)}
                className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors"
              >
                <User size={18} strokeWidth={1.75} /> <span className="max-w-[110px] truncate">{customer.name || "Account"}</span> <ChevronDown size={13} />
              </button>
              {acctOpen && (
                <div className="absolute right-0 top-full pt-3 z-40">
                  <div className="bg-paper border border-line shadow-[var(--shadow-md)] min-w-[180px] py-1.5">
                    <Link to={withStore("/account")} onClick={() => setAcctOpen(false)} className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors">Dashboard</Link>
                    <Link to={withStore("/wishlist")} onClick={() => setAcctOpen(false)} className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors">Wishlist</Link>
                    <button onClick={doLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to={withStore("/account")} className="hidden sm:flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors">
              <User size={18} strokeWidth={1.75} /> Login
            </Link>
          )}

          <Link to={withStore("/wishlist")} className={`relative hidden sm:inline-flex ${iconBtn}`} aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.75} />
            <CountBadge n={wishlist?.count} />
          </Link>
          <Link to={withStore("/cart")} className={`relative ${iconBtn}`} aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.75} />
            <CountBadge n={count} />
          </Link>
        </div>
      </div>
    </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={closeSearch}>
          <div className="bg-paper shadow-[var(--shadow-lg)] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-screen-md mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-ink">Search {config?.store_name}</h2>
                <button onClick={closeSearch} aria-label="Close search" className="text-ink-soft hover:text-ink"><X size={20} /></button>
              </div>
              <form onSubmit={submitSearch} className="relative mb-5">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-11 pr-4 py-3 text-sm border border-line-strong bg-white text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
                />
              </form>

              {q.trim().length < 3 && (
                <p className="text-center text-sm text-muted mt-4">Type at least 3 characters to see results.</p>
              )}
              {q.trim().length >= 3 && results === null && (
                <p className="text-center text-sm text-muted mt-4">Searching…</p>
              )}
              {q.trim().length >= 3 && results && results.length === 0 && (
                <p className="text-center text-sm text-ink-soft mt-4">No products match “{q.trim()}”.</p>
              )}
              {results && results.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {results.map((p) => (
                      <div key={`${p.dbName}-${p.productId}`} onClick={closeSearch}>
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                  <button onClick={submitSearch} className="btn btn-primary w-full mt-6">
                    View all results <ArrowRight size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-paper p-5 overflow-y-auto shadow-[var(--shadow-lg)]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
              <span className="font-display text-lg text-ink">{config?.store_name}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-ink-soft hover:text-ink"><X size={20} /></button>
            </div>
            <ul className="flex flex-col gap-1 text-sm text-ink-soft">
              <li><Link to={withStore("/")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Home</Link></li>
              {/* Each category, with its sub-categories + brands indented beneath */}
              {navItems.map((it) => (
                <li key={it.category} className="pt-1">
                  <Link to={withStore(`/c/${encodeURIComponent(it.category)}`)} onClick={() => setMenuOpen(false)} className="block py-2 uppercase tracking-[0.1em] capitalize hover:text-ink">{it.label}</Link>
                  {(subcats[it.category] || []).map((sc) => (
                    <Link key={sc.name} to={withStore(`/c/${encodeURIComponent(it.category)}?cat=${encodeURIComponent(sc.name)}`)} onClick={() => setMenuOpen(false)} className="block py-1.5 pl-4 text-[13px] hover:text-ink">{sc.name}</Link>
                  ))}
                  {(brandsByCat[it.category] || []).map((b) => (
                    <Link key={b.brand} to={withStore(`/c/${encodeURIComponent(it.category)}?brand=${encodeURIComponent(b.brand)}`)} onClick={() => setMenuOpen(false)} className="block py-1.5 pl-4 text-[13px] text-muted hover:text-ink">{b.label || b.brand}</Link>
                  ))}
                </li>
              ))}
              <li><Link to={withStore("/c/all")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Shop</Link></li>
              <li className="border-t border-line mt-3 pt-3">
                {customer ? (
                  <>
                    <Link to={withStore("/account")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Dashboard</Link>
                    <Link to={withStore("/wishlist")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Wishlist</Link>
                    <Link to={withStore("/cart")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Cart</Link>
                    <button onClick={doLogout} className="block w-full text-left py-2.5 uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to={withStore("/account")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Login</Link>
                    <Link to={withStore("/wishlist")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Wishlist</Link>
                    <Link to={withStore("/cart")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Cart</Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
