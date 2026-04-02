import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /WebDevelopment/pricing ──────────────────────────────
// Title (raw):      "Web Development Pricing Plans & Tiers"  [37 chars]
// Title (rendered): 50 chars ✅ | Description: [152 chars] ✅
export const metadata: Metadata = {
  title: "Web Development Pricing Plans & Tiers",
  description:
    "Clear web development pricing plans from Disconnect — business sites, platforms, and custom builds with fixed-price, no-surprise budgets. Explore now.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/WebDevelopment/pricing" },
  openGraph: {
    title: "Web Development Pricing Plans & Tiers",
    description:
      "Fixed-price web development plans — business sites and platforms with no-surprise budgets.",
    type: "website",
    url: "/WebDevelopment/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Pricing Plans & Tiers",
    description:
      "Fixed-price web development plans — business sites and platforms with no-surprise budgets.",
  },
};

export default function WebDevelopmentPricingPage() {
  const page = getPricingPage("web-development")!;
  return (
    <>
      <PricingDetailPage page={page} />
      <Footer />
    </>
  );
}
