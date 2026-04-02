import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

// ── /Uiux/pricing ────────────────────────────────────────
// Title (raw):      "UI/UX Design Pricing Plans & Packages"  [37 chars]
// Title (rendered): 50 chars ✅ | Description: [145 chars] ✅
export const metadata: Metadata = {
  title: "UI/UX Design Pricing Plans & Packages",
  description:
    "Flat-rate UI/UX design pricing — $2,999 for a complete design system including wireframes, UI screens, and developer handoff. Book a free call.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/Uiux/pricing" },
  openGraph: {
    title: "UI/UX Design Pricing Plans & Packages",
    description:
      "UI/UX design pricing — $2,999 for wireframes, UI screens, and full developer handoff.",
    type: "website",
    url: "/Uiux/pricing",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design Pricing Plans & Packages",
    description:
      "UI/UX design pricing — $2,999 for wireframes, UI screens, and full developer handoff.",
  },
};

export default function UiuxPricingPage() {
  const page = getPricingPage("ui-ux")!;
  return (
    <>
      <PricingDetailPage page={page} />
      <Footer />
    </>
  );
}
