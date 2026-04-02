import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /SEO/pricing ─────────────────────────────────────────
// Title (raw):      "SEO Optimization Pricing Plans & Tiers" [38 chars]
// Title (rendered): 51 chars ✅ | Description: [143 chars] ✅
export const metadata: Metadata = {
  title: "SEO Optimization Pricing Plans & Tiers",
  description:
    "Ongoing SEO pricing from Disconnect — monthly plans at $2,999/month or yearly at $29,999/year with proven ranking results. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/SEO/pricing" },
  openGraph: {
    title: "SEO Optimization Pricing Plans & Tiers",
    description:
      "SEO pricing — $2,999/month or $29,999/year. Proven ranking results, cancel anytime.",
    type: "website",
    url: "/SEO/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Optimization Pricing Plans & Tiers",
    description:
      "SEO pricing — $2,999/month or $29,999/year. Proven ranking results, cancel anytime.",
  },
};

export default function SEOPricingPage() {
  const page = getPricingPage("seo")!;
  return (
    <>
      <PricingDetailPage page={page} />
      <Footer />
    </>
  );
}
