import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "Web Development Pricing | Disconnect",
  description:
    "Fixed-price web development plans for business websites and scalable platforms. Starter from $4,999.",
  alternates: { canonical: "/WebDevelopment/pricing" },
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
