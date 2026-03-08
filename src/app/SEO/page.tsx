import type { Metadata } from "next";
import HeroSection from "@/components/SEO/HeroSection/HeroSection";  
import CTASection from "@/components/Shared/CTASection/CTASection";
import Footer from "@/components/Shared/Footer/Footer";
import SeoProcess from "@/components/SEO/Seoprocess/SEOProcessSection";
import SEOServicesSection from "@/components/SEO/Services/SeoServiceSection";
import UIUXPricing from "@/components/uiux/UIUXPricing";
import FeaturedServicesSection from "@/components/SEO/FeaturedServiceSection/FeaturedSevicesSection";
import ReviewsSection from "@/components/SEO/Review/ReviewsSection";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";

export const metadata: Metadata = {
  title: "SEO Services | Disconnect",
  description:
    "Technical SEO, on-page optimization, content strategy, and growth-focused search performance services.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/SEO" },
  openGraph: {
    title: "SEO Services | Disconnect",
    description:
      "Data-driven SEO services built to increase visibility, rankings, and conversions.",
    type: "website",
    url: "/SEO",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services | Disconnect",
    description:
      "Data-driven SEO services built to increase visibility, rankings, and conversions.",
  },
};

export default function SEOPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "SEO Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Technical SEO, on-page optimization, and content growth services.",
    url: "/SEO",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <section id="benefits">
      <SeoProcess />
      </section>
      <SEOServicesSection />
      <section id="feature">
      <FeaturedServicesSection />
      </section>
      <section id="pricing">
        <UIUXPricing />
      </section>
      <section id="testimonials">
      <ReviewsSection />
      </section>
      <section id="faq">
      <FAQSection
        title={`Questions?\nWe're here to assist!`}
        category="seo"
        accentColor="#3755CD"
        defaultOpenIndex={0}
      />
      </section>
    <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #3755CD 0%, rgba(55,85,205,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#3755CD"
  tiltIntensity={14}
/>
      <Footer />
    </main>
  );
}
