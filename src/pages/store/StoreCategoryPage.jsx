// Category / search listing with a compact, collapsible filter rail: category
// (on the all-shop), sub-category, brand, size, price, and availability. Every
// filter is reflected in the URL query so a filtered view is shareable.
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import ProductCard from "../../components/store/ProductCard";
import PriceRange from "../../components/store/PriceRange";

const SORTS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
];

const STOCK = [["in", "In stock"], ["out", "Out of stock"], ["all", "All"]];

export default function StoreCategoryPage() {
  const { category: rawCategory } = useParams();
  const category = rawCategory ? decodeURIComponent(rawCategory) : "";
  const [sp, setSp] = useSearchParams();
  const { api, config } = useStore();

  const q = sp.get("q") || "";
  const subcat = sp.get("cat") || ""; // sub-category (canonical category-map name)
  const sort = sp.get("sort") || "featured";
  const stock = sp.get("stock") || "in";
  const brandsSel = useMemo(() => (sp.get("brand") ? sp.get("brand").split(",").filter(Boolean) : []), [sp]);
  const subBrandsSel = useMemo(() => (sp.get("sub_brand") ? sp.get("sub_brand").split(",").filter(Boolean) : []), [sp]);
  const sizesSel = useMemo(() => (sp.get("size") ? sp.get("size").split(",").filter(Boolean) : []), [sp]);
  const priceMin = sp.get("price_min");
  const priceMax = sp.get("price_max");

  const [facets, setFacets] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  // No category in the URL (the /search route) → search across ALL categories.
  const listCategory = category || "all";
  const isAll = listCategory === "all";

  // facets re-fetch when the category OR the cascade selection (sub-category /
  // brand) changes — so the brand list narrows to the picked sub-category, and
  // sub-brands appear for the picked brand.
  useEffect(() => {
    api.facets({ category: listCategory, ...(subcat && { cat: subcat }), ...(brandsSel.length && { brand: brandsSel.join(",") }) })
      .then(setFacets)
      .catch(() => setFacets({ price_min: 0, price_max: 0, brands: [], subBrands: [], subcategories: [], sizes: [] }));
  }, [listCategory, subcat, brandsSel.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const queryParams = useMemo(() => ({
    category: listCategory,
    ...(q && { q }),
    ...(subcat && { cat: subcat }),
    ...(sort && sort !== "featured" && { sort }),
    ...(stock && stock !== "in" && { stock }),
    ...(brandsSel.length && { brand: brandsSel.join(",") }),
    ...(subBrandsSel.length && { sub_brand: subBrandsSel.join(",") }),
    ...(sizesSel.length && { size: sizesSel.join(",") }),
    ...(priceMin && { price_min: priceMin }),
    ...(priceMax && { price_max: priceMax }),
  }), [listCategory, q, subcat, sort, stock, brandsSel, subBrandsSel, sizesSel, priceMin, priceMax]);

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
  // clearing a brand also clears its sub-brands (they only make sense together)
  const toggleBrand = (b) => {
    const on = brandsSel.includes(b);
    patch({ brand: on ? brandsSel.filter((x) => x !== b) : [...brandsSel, b], ...(on && { sub_brand: null }) });
  };
  const toggleSubBrand = (s) => patch({ sub_brand: subBrandsSel.includes(s) ? subBrandsSel.filter((x) => x !== s) : [...subBrandsSel, s] });
  const toggleSize = (s) => patch({ size: sizesSel.includes(s) ? sizesSel.filter((x) => x !== s) : [...sizesSel, s] });
  const clearAll = () => patch({ brand: null, sub_brand: null, size: null, cat: null, price_min: null, price_max: null, sort: null, stock: null });

  const activeCount = brandsSel.length + subBrandsSel.length + sizesSel.length + (subcat ? 1 : 0)
    + (priceMin || priceMax ? 1 : 0) + (sort !== "featured" ? 1 : 0) + (stock !== "in" ? 1 : 0);

  // Prefer the vendor's menu label for the category; "all" → the mixed listing.
  const catLabel = category === "all" ? "All products"
    : ((config?.nav?.items || []).find((i) => i.category === category)?.label || category);
  const title = q ? `Search results for "${q}"` : (subcat || catLabel || "All products");

  // primary categories for the all-shop category filter (from the vendor nav)
  const categories = useMemo(() => {
    const items = config?.nav?.items;
    if (Array.isArray(items) && items.length) return items.filter((i) => i && i.category).map((i) => ({ category: i.category, label: i.label || i.category }));
    return (config?.categories || []).map((c) => ({ category: c, label: c }));
  }, [config]);

  const Sidebar = (
    <FilterRail
      facets={facets} isAll={isAll} categories={categories}
      brandsSel={brandsSel} onToggleBrand={toggleBrand}
      subBrandsSel={subBrandsSel} onToggleSubBrand={toggleSubBrand}
      sizesSel={sizesSel} onToggleSize={toggleSize}
      subcat={subcat} onSubcat={(name) => patch({ cat: subcat === name ? null : name, brand: null, sub_brand: null })}
      stock={stock} onStock={(v) => patch({ stock: v === "in" ? null : v })}
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
              <div className="text-sm text-muted mb-6">Try widening the price range or clearing a filter.</div>
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

// A collapsible filter section. Open by default; click the header to collapse.
function Section({ title, children, defaultOpen = true, count }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-line py-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-left">
        <h3 className="font-semibold uppercase text-[11px] tracking-[0.14em] text-muted">
          {title}{count ? <span className="text-ink-soft"> ({count})</span> : null}
        </h3>
        <ChevronDown size={15} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </section>
  );
}

function FilterRail({
  facets, isAll, categories, brandsSel, onToggleBrand, subBrandsSel, onToggleSubBrand,
  sizesSel, onToggleSize, subcat, onSubcat, stock, onStock, priceMin, priceMax, onPrice, activeCount, onClear,
}) {
  if (!facets) return <div className="text-sm text-muted">Loading filters…</div>;
  const subs = facets.subcategories || [];
  const subBrands = facets.subBrands || [];
  const sizes = facets.sizes || [];
  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="eyebrow !text-ink">Filter</h2>
        {activeCount > 0 && <button onClick={onClear} className="text-xs text-muted hover:text-ink underline transition-colors">Clear all</button>}
      </div>

      {/* Price stays on top */}
      {facets.price_max > facets.price_min && (
        <Section title="Price">
          <PriceRange
            min={facets.price_min} max={facets.price_max}
            value={[priceMin ? Number(priceMin) : facets.price_min, priceMax ? Number(priceMax) : facets.price_max]}
            onChange={onPrice}
          />
        </Section>
      )}

      {isAll && categories.length > 0 && (
        <Section title="Category" count={categories.length}>
          <div className="flex flex-col gap-1.5">
            {categories.map((c) => (
              <Link key={c.category} to={withStore(`/c/${encodeURIComponent(c.category)}`)}
                className="capitalize text-ink-soft hover:text-ink transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {!isAll && subs.length > 0 && (
        <Section title="Sub-category" count={subs.length}>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {subs.map((s) => (
              <label key={s.name} className="flex items-center gap-2.5 cursor-pointer text-ink-soft hover:text-ink transition-colors capitalize">
                <input type="checkbox" checked={subcat === s.name} onChange={() => onSubcat(s.name)} className="accent-[var(--store-primary,#1a1512)]" />
                <span className="flex-1 truncate">{s.name}</span>
                <span className="text-xs text-muted num">{s.count}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {facets.brands.length > 0 && (
        <Section title="Brand" count={facets.brands.length}>
          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {facets.brands.map((b) => (
              <label key={b.name} className="flex items-center gap-2.5 cursor-pointer text-ink-soft hover:text-ink transition-colors">
                <input type="checkbox" checked={brandsSel.includes(b.name)} onChange={() => onToggleBrand(b.name)} className="accent-[var(--store-primary,#1a1512)]" />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-xs text-muted num">{b.count}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Cascade: sub-brands appear once a brand with sub-brands is selected */}
      {subBrands.length > 0 && (
        <Section title="Sub-brand" count={subBrands.length}>
          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {subBrands.map((b) => (
              <label key={b.name} className="flex items-center gap-2.5 cursor-pointer text-ink-soft hover:text-ink transition-colors">
                <input type="checkbox" checked={subBrandsSel.includes(b.name)} onChange={() => onToggleSubBrand(b.name)} className="accent-[var(--store-primary,#1a1512)]" />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-xs text-muted num">{b.count}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {sizes.length > 0 && (
        <Section title="Size" count={sizes.length}>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button key={s} onClick={() => onToggleSize(s)}
                className={`min-w-[40px] px-2.5 py-1.5 text-[13px] border transition-colors ${sizesSel.includes(s) ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-soft hover:border-ink"}`}>
                {s}
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section title="Availability" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {STOCK.map(([v, l]) => (
            <label key={v} className="flex items-center gap-2.5 cursor-pointer text-ink-soft hover:text-ink transition-colors">
              <input type="radio" name="stock" checked={stock === v} onChange={() => onStock(v)} className="accent-[var(--store-primary,#1a1512)]" />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
