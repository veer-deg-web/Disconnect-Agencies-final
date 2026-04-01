import type { Metadata } from "next";
import { getPricingPage } from "@/Data/pricingPages";
import PricingDetailPage from "@/components/PricingDetail/PricingDetailPage";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "AI & Automation Pricing | Disconnect",
  description:
    "AI systems and automation pricing. Starter from $5,999. Turn manual work into intelligent systems.",
  alternates: { canonical: "/AIModels/pricing" },
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
