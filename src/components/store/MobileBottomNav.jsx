// Fixed bottom tab bar for mobile — quick reach to the store's key destinations.
// Hidden on md+ (the top nav covers desktop). Cart/wishlist show live count
// badges. The active tab is highlighted by the current route.
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { withStore } from "../../lib/tenant";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { count } = useCart();
  const wishlist = useWishlist();

  const items = [
    { to: "/", icon: Home, label: "Home", match: (p) => p === "/" },
    { to: "/c/all", icon: LayoutGrid, label: "Shop", match: (p) => p.startsWith("/c/") || p.startsWith("/p/") },
    { to: "/wishlist", icon: Heart, label: "Wishlist", match: (p) => p === "/wishlist", badge: wishlist?.count },
    { to: "/cart", icon: ShoppingBag, label: "Cart", match: (p) => p === "/cart", badge: count },
    { to: "/account", icon: User, label: "Account", match: (p) => p === "/account" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t"
      style={{
        background: "var(--store-bg, #faf8f5)",
        borderColor: "color-mix(in srgb, var(--store-on-bg, #1a1512) 12%, transparent)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Primary"
    >
      {items.map(({ to, icon: Icon, label, match, badge }) => {
        const active = match(pathname);
        return (
          <Link
            key={to}
            to={withStore(to)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] tracking-wide transition-colors ${active ? "text-ink" : "text-muted"}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="relative">
              <Icon size={21} strokeWidth={active ? 2.2 : 1.7} style={active ? { color: "var(--store-primary, #1a1512)" } : undefined} />
              {badge > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center num"
                  style={{ background: "var(--store-primary, #1a1512)", color: "var(--store-on-primary, #fff)" }}
                >
                  {badge}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
