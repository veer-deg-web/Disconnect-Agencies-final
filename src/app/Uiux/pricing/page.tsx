import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "UI/UX Design Pricing | Disconnect",
  description:
    "Flat-rate UI/UX design. $2,999 for a complete design system — wireframes, UI screens, and developer handoff.",
  alternates: { canonical: "/Uiux/pricing" },
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
