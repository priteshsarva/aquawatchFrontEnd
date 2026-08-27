// Storefront home. Default = the original Aqua Watch layout (hero → categories
// → per-category collections), which is what most vendors want. A vendor who
// explicitly picks a preset in the portal gets the section-builder layout
// instead — that path stays available, it's just no longer the default.
import React from "react";
import { useStore } from "../../context/StoreContext";
import SectionRenderer from "../../components/sections/registry";
import WhatsAppPromoBar from "../../components/store/WhatsAppPromoBar";
import OriginalHome from "./OriginalHome";

export default function StoreHome() {
  const { config } = useStore();
  if (!config) return <div className="min-h-[60vh]" />;

  // vendor explicitly configured a custom section layout → render that
  if (Array.isArray(config.sections) && config.sections.length) {
    return (
      <>
        <WhatsAppPromoBar />
        <SectionRenderer sections={config.sections} />
      </>
    );
  }

  // default: the original look
  return <OriginalHome />;
}
