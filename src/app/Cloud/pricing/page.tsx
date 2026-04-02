import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /Cloud/pricing ───────────────────────────────────────
// Title (raw):      "Transparent Cloud Infrastructure Pricing" [40 chars]
// Title (rendered): 53 chars ✅ | Description: [146 chars] ✅
export const metadata: Metadata = {
  title: "Transparent Cloud Infrastructure Pricing",
  description:
    "Transparent cloud infrastructure pricing from Disconnect. Starter plans from $3,999, built for auto-scaling and real production load. Explore now.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/Cloud/pricing" },
  openGraph: {
    title: "Transparent Cloud Infrastructure Pricing",
    description:
      "Scalable cloud pricing plans — starter from $3,999. Built for real production load.",
    type: "website",
    url: "/Cloud/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transparent Cloud Infrastructure Pricing",
    description:
      "Scalable cloud pricing plans — starter from $3,999. Built for real production load.",
  },
};

export default function CloudPricingPage() {
  const page = getPricingPage("cloud")!;
  return (
    <>
      <PricingDetailPage page={page} />
      <Footer />
    </>
  );
}
