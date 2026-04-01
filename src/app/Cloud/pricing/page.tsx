import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "Cloud Infrastructure Pricing | Disconnect",
  description:
    "Transparent cloud infrastructure pricing. Starter from $3,999. Scalable systems built for real load.",
  alternates: { canonical: "/Cloud/pricing" },
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
