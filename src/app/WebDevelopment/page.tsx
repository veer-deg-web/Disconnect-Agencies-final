import type { Metadata } from "next";
import{ featureItems } from "@/Data/WebDevFeatures/Data";
import Hero from "@/components/WebDevelopment/Hero/Hero";
import SupportSection from "@/components/WebDevelopment/SupportService/SupportService";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import Footer from "@/components/Shared/Footer/Footer";
import FeatureGridSection from "@/components/WebDevelopment/FeatureGridSection/FeatureGridSection";
import IntegrationLogosSection from "@/components/WebDevelopment/IntegrationLogoSection/IntegrationLogoSection";
import PricingSection from "@/components/WebDevelopment/PricingSection/PricingSection";
import SupportedByAI from "@/components/WebDevelopment/SupportedByAi/SupportedByAi";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import { showcaseLogos } from "@/Data/showcaseLogos";
import ClientFeedback from "@/components/WebDevelopment/Testimonial/ClientFeedback";
import FeatureSection from "@/components/WebDevelopment/FeatureSection/FeatureSection";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Reliable and conversion-focused web development services for modern businesses, from design to launch.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/WebDevelopment" },
  openGraph: {
    title: "Web Development",
    description:
      "Custom websites and web products engineered for performance, scalability, and growth.",
    type: "website",
    url: "/WebDevelopment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development",
    description:
      "Custom websites and web products engineered for performance, scalability, and growth.",
  },
};

export default function WebDevelopmentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Development Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Custom web development, frontend engineering, and scalable web architecture.",
    url: "/WebDevelopment",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
       <section className="uiux-marquee-section">
    <UIUXShowcaseLogos logos={showcaseLogos} iconGap={200}/>
  </section>
      <SupportSection />

     
     <section id="feature">
     <FeatureSection />
     </section>
     <section id="benefits">
     <SupportedByAI  /> 
     </section>
     <FeatureGridSection
  headingLine1="Custom-designed modular"
  headingLine2="products at a world-class standard"
  subheading="Each component is designed to work beautifully together."
  items={featureItems}
/>
<IntegrationLogosSection />
<section id="pricing">
  <PricingSection />
</section>
<section id="testimonials">
<ClientFeedback />
</section>
     
<section id="faq">
<FAQSection
        title={`Questions?\nWe're here to assist!`}
        defaultOpenIndex={0}
        accentColor="#C7FF1A"
        category="webdev"
      />
</section>
    <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #CFFE25 0%, rgba(207,254,37,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#CFFE25"
  tiltIntensity={12}
/>
      <Footer />
    </>
  );
}
