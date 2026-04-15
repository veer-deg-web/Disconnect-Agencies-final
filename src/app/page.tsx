import type { Metadata } from "next";
import GrowthShowcaseSection from "@/components/Home/GrowthShowcaseSection/GrowthShowcaseSection";
import HeroSection from "@/components/Home/HeroSection/HeroSection";
import PageBackground from "@/components/Home/PageBackground/PageBackground";
import ScrollToQuerySection from "@/components/Home/ScrollToQuerySection";
import ServicesSection from "@/components/Home/ServicesSection/ServicesSection";
import SmartGrowthSection from "@/components/Home/SmartGrowthSection/SmartGrowthSection";
import VisionShowcase from "@/components/Home/VisionShowcase/VisionShowcase";
import PerformanceMetrics from "@/components/Home/PerformanceMetrics/PerformanceMetrics";
import TestimonialsSection from "@/components/Home/TestimonialsSection/TestimonialsSection";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import AddressSection from "@/components/Home/AddressSection/AddressSection";
import Footer from "@/components/Shared/Footer/Footer";

// ── Homepage / ───────────────────────────────────────────
// Title (absolute): "Disconnect | Full-Service Design & Development Agency"  [53 chars] ✅
// Description:      [146 chars] ✅
// Canonical:        https://disconnect.software ✅
export const metadata: Metadata = {
  title: {
    absolute: "Disconnect | Full-Service Design & Development Agency",
  },
  description:
    "Disconnect helps teams design, build, and scale products across web, app, AI, cloud, SEO, and UI/UX — delivering proven results. Book a free call.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Disconnect | Full-Service Design & Development Agency",
    description:
      "End-to-end product design, engineering, and launch support for modern businesses — trusted by teams worldwide.",
    type: "website",
    url: "/",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disconnect | Full-Service Design & Development Agency",
    description:
      "End-to-end product design, engineering, and launch support for modern businesses.",
  },
  keywords: [
    "Disconnect agencies",
    "digital product agency",
    "software development company",
    "AI solutions",
    "web development",
    "app development",
    "cloud infrastructure",
    "SEO services",
    "UI/UX design",
    "product engineering",
  ],
};





export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Disconnect",
    url: "/",
    description:
      "Full-service product agency for design, development, AI, SEO, and cloud solutions.",
  };

  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollToQuerySection />
      <main className="relative min-h-screen text-white overflow-hidden">
        <HeroSection />
      </main>
      <section id="feature">
        <VisionShowcase />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <GrowthShowcaseSection />
      <section id="benefits">
        <SmartGrowthSection />
      </section>

      <PerformanceMetrics />
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="faq">
        <FAQSection
          title="FAQ"
          category="general"
          accentColor="#DE5E03"
          defaultOpenIndex={0}
        />
      </section>
      <AddressSection />
      <CTASection
        gradient="radial-gradient(80% 120% at 50% 100%, #DE5E03 0%, rgba(222,94,3,0.45) 35%, #0b0b0b 75%)"
        tiltGlow="#DE5E03"
        tiltIntensity={14}
      />

      <Footer />
    </PageBackground>


  );
}
