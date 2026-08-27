import React from "react";
import { useStore } from "../../context/StoreContext";

export default function StoreAnnouncementBar() {
  const { config } = useStore();
  if (!config?.announcement) return null;
  return (
    <div className="text-white text-center text-[11px] sm:text-xs py-2 px-3 tracking-[0.1em] uppercase font-medium" style={{ background: "var(--store-primary, #1a1512)" }}>
      {config.announcement}
    </div>
  );
}
