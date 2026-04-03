import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /AIModels/pricing ────────────────────────────────────
// Title (raw):      "AI & Automation Pricing Plans & Tiers"  [37 chars]
// Title (rendered): 50 chars ✅ | Description: [152 chars] ✅
export const metadata: Metadata = {
  title: "AI & Automation Pricing | Starting from $34,999",
  description:
    "AI automation built for real business impact. Plans starting from $34,999 — turn manual workflows into intelligent, scalable systems. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/AIModels/pricing" },
  openGraph: {
    title: "AI & Automation Pricing | Starting from $34,999",
    description:
      "Explore AI automation plans starting from $34,999. We build intelligent systems that scale your operations.",
    type: "website",
    url: "/AIModels/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & Automation Pricing | Starting from $34,999",
    description:
      "Explore AI automation plans starting from $34,999. We build intelligent systems that scale your operations.",
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
