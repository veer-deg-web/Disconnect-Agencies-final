import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /Cloud/pricing ───────────────────────────────────────
// Title (raw):      "Transparent Cloud Infrastructure Pricing" [40 chars]
// Title (rendered): 53 chars ✅ | Description: [146 chars] ✅
export const metadata: Metadata = {
  title: "Cloud Infrastructure Architecture & Scalability",
  description:
    "Production-grade cloud infrastructure built by Disconnect. We design auto-scaling, high-performance systems for real-world load. Book a call for a custom quote.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/Cloud/pricing" },
  openGraph: {
    title: "Cloud Infrastructure Architecture & Scalability",
    description:
      "Scalable cloud infrastructure designed for real production load and auto-scaling performance.",
    type: "website",
    url: "/Cloud/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Infrastructure Architecture & Scalability",
    description:
      "Scalable cloud infrastructure designed for real production load and auto-scaling performance.",
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
