// Category / search listing with an advanced filter rail: brand checklist,
// draggable + typable price range, sort, and stock toggle. Page-based paging
// ("Load more"). All filters are reflected in the URL query so a filtered view
// is shareable.
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/store/ProductCard";
import PriceRange from "../../components/store/PriceRange";

const SORTS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
];

export default function StoreCategoryPage() {
  const { category: rawCategory } = useParams();
  const category = rawCategory ? decodeURIComponent(rawCategory) : "";
  const [sp, setSp] = useSearchParams();
  const { api, config } = useStore();

  const q = sp.get("q") || "";
  const subcat = sp.get("cat") || ""; // sub-category (canonical category-map name)
  const sort = sp.get("sort") || "featured";
  const brandsSel = useMemo(() => (sp.get("brand") ? sp.get("brand").split(",").filter(Boolean) : []), [sp]);
  const priceMin = sp.get("price_min");
  const priceMax = sp.get("price_max");

  const [facets, setFacets] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  // No category in the URL (the /search route) → search across ALL categories,
  // not just the first one. /c/:category and /c/all pass their own category.
  const listCategory = category || "all";

  // one facets fetch per category (price bounds + brands)
  useEffect(() => {
    setFacets(null);
    api.facets({ category: listCategory }).then(setFacets).catch(() => setFacets({ price_min: 0, price_max: 0, brands: [] }));
  }, [listCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const queryParams = useMemo(() => ({
    category: listCategory,
    ...(q && { q }),
    ...(subcat && { cat: subcat }),
    ...(sort && sort !== "featured" && { sort }),
    ...(brandsSel.length && { brand: brandsSel.join(",") }),
    ...(priceMin && { price_min: priceMin }),
    ...(priceMax && { price_max: priceMax }),
  }), [listCategory, q, subcat, sort, brandsSel, priceMin, priceMax]);

  // reload from page 1 whenever any filter changes
  useEffect(() => {
    setLoading(true); setPage(1);
    api.products({ ...queryParams, page: 1, limit: 12 })
      .then((r) => { setProducts(r.results); setHasMore(r.hasMore); })
      .finally(() => setLoading(false));
  }, [JSON.stringify(queryParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  function loadMore() {
    const next = page + 1;
    setLoading(true); setPage(next);
    api.products({ ...queryParams, page: next, limit: 12 })
      .then((r) => { setProducts((prev) => [...prev, ...r.results]); setHasMore(r.hasMore); })
      .finally(() => setLoading(false));
  }

  // URL-param mutators (each preserves the others)
  const patch = (obj) => {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(obj)) {
      if (v == null || v === "" || (Array.isArray(v) && !v.length)) next.delete(k);
      else next.set(k, Array.isArray(v) ? v.join(",") : v);
    }
    setSp(next, { replace: true });
  };
  const toggleBrand = (b) => patch({ brand: brandsSel.includes(b) ? brandsSel.filter((x) => x !== b) : [...brandsSel, b] });
  const clearAll = () => patch({ brand: null, price_min: null, price_max: null, sort: null });

  const activeCount = brandsSel.length + (priceMin || priceMax ? 1 : 0) + (sort !== "featured" ? 1 : 0);
  // Prefer the vendor's menu label for the category; "all" → the mixed listing.
  const catLabel = category === "all" ? "All products"
    : ((config?.nav?.items || []).find((i) => i.category === category)?.label || category);
  const title = q ? `Search results for "${q}"` : (subcat || catLabel || "All products");

  const Sidebar = (
    <FilterRail
      facets={facets} brandsSel={brandsSel} onToggleBrand={toggleBrand}
      priceMin={priceMin} priceMax={priceMax}
      onPrice={([lo, hi]) => patch({ price_min: lo, price_max: hi })}
      activeCount={activeCount} onClear={clearAll}
    />
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-end justify-between mb-8 gap-3 flex-wrap border-b border-line pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl capitalize text-ink">{title}</h1>
          {!loading && <div className="text-sm text-muted mt-1.5 num">{products.length}{hasMore ? "+" : ""} {products.length === 1 ? "piece" : "pieces"}</div>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setFiltersOpen(true)} className="md:hidden inline-flex items-center gap-1.5 text-sm border border-line-strong px-3.5 py-2 hover:border-ink transition-colors">
            <SlidersHorizontal size={15} /> Filters{activeCount ? ` (${activeCount})` : ""}
          </button>
          <label className="text-sm text-muted flex items-center gap-2">
            <span className="hidden sm:inline uppercase tracking-[0.1em] text-xs">Sort</span>
            <select value={sort} onChange={(e) => patch({ sort: e.target.value })} className="border border-line-strong bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink transition-colors">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-10">
        <aside className="hidden md:block w-60 shrink-0">{Sidebar}</aside>

        <div className="flex-1 min-w-0">
          {products.length === 0 && !loading ? (
            <div className="text-center py-24">
              <div className="text-lg text-ink mb-1">Nothing matches these filters</div>
              <div className="text-sm text-muted mb-6">Try widening the price range or clearing a brand.</div>
              <button onClick={clearAll} className="btn btn-outline">Clear filters</button>
            </div>
          ) : (
            <div className="stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-9">
              {products.map((p) => <ProductCard key={`${p.dbName}-${p.productId}`} product={p} />)}
            </div>
          )}
          {hasMore && (
            <div className="text-center mt-12">
              <button onClick={loadMore} disabled={loading} className="btn btn-outline">
                {loading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85%] bg-paper p-5 overflow-y-auto shadow-[var(--shadow-lg)]">
            <div className="flex justify-between items-center mb-5">
              <span className="font-display text-lg text-ink">Filters</span>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close" className="text-ink-soft hover:text-ink"><X size={20} /></button>
            </div>
            {Sidebar}
            <button onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full mt-8">
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterRail({ facets, brandsSel, onToggleBrand, priceMin, priceMax, onPrice, activeCount, onClear }) {
  if (!facets) return <div className="text-sm text-muted">Loading filters…</div>;
  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="eyebrow !text-ink">Filter</h2>
        {activeCount > 0 && <button onClick={onClear} className="text-xs text-muted hover:text-ink underline transition-colors">Clear all</button>}
      </div>

      {facets.price_max > facets.price_min && (
        <section className="mb-6 pb-6 border-b border-line">
          <h3 className="font-semibold mb-3.5 uppercase text-[11px] tracking-[0.14em] text-muted">Price</h3>
          <PriceRange
            min={facets.price_min} max={facets.price_max}
            value={[priceMin ? Number(priceMin) : facets.price_min, priceMax ? Number(priceMax) : facets.price_max]}
            onChange={onPrice}
          />
        </section>
      )}

      {facets.brands.length > 0 && (
        <section>
          <h3 className="font-semibold mb-3.5 uppercase text-[11px] tracking-[0.14em] text-muted">Brand</h3>
          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {facets.brands.map((b) => (
              <label key={b.name} className="flex items-center gap-2.5 cursor-pointer text-ink-soft hover:text-ink transition-colors">
                <input type="checkbox" checked={brandsSel.includes(b.name)} onChange={() => onToggleBrand(b.name)} className="accent-[var(--store-primary,#1a1512)]" />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-xs text-muted num">{b.count}</span>
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
