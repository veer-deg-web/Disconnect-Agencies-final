import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /AppDevelopment/pricing ──────────────────────────────
// Title (raw):      "App Development Pricing Plans & Tiers"  [37 chars]
// Title (rendered): 50 chars ✅ | Description: [148 chars] ✅
export const metadata: Metadata = {
  title: "App Development Pricing Plans & Tiers",
  description:
    "Fixed-price app development plans from Disconnect. MVP builds from $7,999, full product launches from $19,999 — no hidden costs. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/AppDevelopment/pricing" },
  openGraph: {
    title: "App Development Pricing Plans & Tiers",
    description:
      "App development pricing — MVP from $7,999, full product launches from $19,999. No hidden costs.",
    type: "website",
    url: "/AppDevelopment/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Development Pricing Plans & Tiers",
    description:
      "App development pricing — MVP from $7,999, full product launches from $19,999. No hidden costs.",
  },
};

export default function AppDevelopmentPricingPage() {
  const page = getPricingPage("app-development")!;
  return (
    <>
      <PricingDetailPage page={page} />
      <Footer />
    </>
  );
}
