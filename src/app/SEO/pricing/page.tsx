import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "SEO Pricing | Disconnect",
  description:
    "Ongoing SEO optimization. Monthly at $2,999/month or yearly at $29,999/year. Cancel anytime.",
  alternates: { canonical: "/SEO/pricing" },
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
