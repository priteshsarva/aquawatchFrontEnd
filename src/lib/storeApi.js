// API client for the hosted, multi-tenant storefront — /store/:slug/* on the
// scraper backend. Tenant is resolved once per page load, never guessed per call.
const BASE = import.meta.env.VITE_BASE_URL;

// Production: subdomain (aquawatch.platform.com -> "aquawatch") — or a full
// custom_domain match handled server-side by resolveStore.
// Local dev (no wildcard DNS): ?store=slug, or VITE_DEV_STORE, and we cache
// the resolved slug in sessionStorage so an internal <Link to="/"> (which
// drops the query param under BrowserRouter) or a hard refresh keeps the
// tenant across the same tab.
const SESSION_KEY = "spp_resolved_slug";

export function resolveSlug() {
  const fromQuery = new URLSearchParams(window.location.search).get("store");
  if (fromQuery) {
    try { sessionStorage.setItem(SESSION_KEY, fromQuery.toLowerCase()); } catch { /* private mode */ }
    return fromQuery.toLowerCase();
  }

  const host = window.location.hostname;
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(host);
  if (isLocalHost) {
    // dev order: cached slug from this session → VITE_DEV_STORE fallback
    let cached = "";
    try { cached = sessionStorage.getItem(SESSION_KEY) || ""; } catch { /* ignore */ }
    return (cached || import.meta.env.VITE_DEV_STORE || "").toLowerCase();
  }

  // production: subdomain, cached to survive client-side navigations that drop
  // the URL context (they usually don't in prod, but the cache costs nothing).
  const sub = host.split(".")[0].toLowerCase();
  try { sessionStorage.setItem(SESSION_KEY, sub); } catch { /* ignore */ }
  return sub;
}

const tokenKey = (slug) => `spp_customer_token:${slug}`;
export const getCustomerToken = (slug) => localStorage.getItem(tokenKey(slug)) || "";
export const setCustomerToken = (slug, t) =>
  t ? localStorage.setItem(tokenKey(slug), t) : localStorage.removeItem(tokenKey(slug));

// Sent on every /store/* call so the server can match a **custom domain**
// (e.g. aquawatch.com) against enrollments.custom_domain when the URL segment
// slug doesn't happen to match the hostname's first label. Cheap and always-on.
function currentHost() {
  return typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
}

async function req(slug, path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json", "X-Store-Host": currentHost() };
  if (auth) {
    const t = getCustomerToken(slug);
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}/store/${slug}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const storeApi = (slug) => ({
  config: () => req(slug, "/config"),
  // Hide OOS by default across every listing (home rails, category page, search,
  // similar items). A caller can override with { stock: "any" } to see everything,
  // or { stock: "out" } to see only OOS.
  products: (params = {}) => {
    const p = { stock: "in", ...params };
    if (p.stock === "any") delete p.stock;
    return req(slug, `/products?${new URLSearchParams(p)}`);
  },
  facets: (params = {}) => req(slug, `/facets?${new URLSearchParams(params)}`),
  // sub-categories (the vendor's canonical category-map names) for one parent category
  subcategories: (category) => req(slug, `/subcategories?category=${encodeURIComponent(category)}`),
  // full menu tree: primary → secondary categories → brands (one call)
  menu: () => req(slug, "/menu"),
  product: (dbName, id) => req(slug, `/products/${dbName}/${id}`),
  // triggers a background re-scrape server-side; returns only a status, never
  // product data (so supplier cost/URL never reach the browser).
  refreshProduct: (dbName, id) => req(slug, `/products/${dbName}/${id}/refresh`, { method: "POST" }),

  signup: (body) => req(slug, "/auth/signup", { method: "POST", body }),
  login: (body) => req(slug, "/auth/login", { method: "POST", body }),
  me: () => req(slug, "/me", { auth: true }),
  addAddress: (body) => req(slug, "/me/addresses", { method: "POST", body, auth: true }),
  updateAddress: (id, body) => req(slug, `/me/addresses/${id}`, { method: "PUT", body, auth: true }),
  deleteAddress: (id) => req(slug, `/me/addresses/${id}`, { method: "DELETE", auth: true }),

  // auth:true attaches the customer token when logged in, but the backend allows
  // guest checkout too — omitting the header (not logged in) is not an error.
  createOrder: (body) => req(slug, "/orders", { method: "POST", body, auth: true }),
  myOrders: () => req(slug, "/me/orders", { auth: true }),
  myOrder: (orderNo) => req(slug, `/me/orders/${orderNo}`, { auth: true }),
});
