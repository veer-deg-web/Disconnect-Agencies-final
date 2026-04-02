import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /AIModels/pricing ────────────────────────────────────
// Title (raw):      "AI & Automation Pricing Plans & Tiers"  [37 chars]
// Title (rendered): 50 chars ✅ | Description: [152 chars] ✅
export const metadata: Metadata = {
  title: "AI & Automation Pricing Plans & Tiers",
  description:
    "AI and automation pricing from Disconnect. Starter plans from $5,999 — turn manual workflows into intelligent, scalable automation. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/AIModels/pricing" },
  openGraph: {
    title: "AI & Automation Pricing Plans & Tiers",
    description:
      "AI automation pricing — starter from $5,999. Turn manual workflows into intelligent systems.",
    type: "website",
    url: "/AIModels/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & Automation Pricing Plans & Tiers",
    description:
      "AI automation pricing — starter from $5,999. Turn manual workflows into intelligent systems.",
  },
};

export default function AIModelsPricingPage() {
  const page = getPricingPage("ai")!;
  return (
    <>
      <PricingDetailPage page={page} />
      <Footer />
    </>
  );
}
