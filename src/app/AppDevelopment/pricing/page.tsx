import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "App Development Pricing | Disconnect",
  description:
    "End-to-end app development pricing. MVP from $7,999. Full product builds from $19,999.",
  alternates: { canonical: "/AppDevelopment/pricing" },
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
