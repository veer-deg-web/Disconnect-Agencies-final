import type { Metadata } from "next";
import UIUXHeroSection from "@/components/uiux/UIUXHeroSection";
import UIUXProcess from "@/components/uiux/UIUXProcess";
import UIUXBenefits from "@/components/uiux/UIUXBenefits";
import UIUXFeatures from "@/components/uiux/UIUXFeatures";
import UIUXSolutions from "@/components/uiux/UIUXSolutions";
import UIUXPricing from "@/components/uiux/UIUXPricing";

import UIUXTutorials from "@/components/uiux/UIUXTutorials";

import Footer from "@/components/Shared/Footer/Footer";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import { showcaseLogos } from "@/Data/showcaseLogos";

export const metadata: Metadata = {
  title: "UI/UX Design | Disconnect",
  description:
    "User-focused UI/UX design services with research, wireframes, visual design, and conversion-driven experiences.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/Uiux" },
  openGraph: {
    title: "UI/UX Design | Disconnect",
    description:
      "Modern interface design and product UX systems crafted for engagement and growth.",
    type: "website",
    url: "/Uiux",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design | Disconnect",
    description:
      "Modern interface design and product UX systems crafted for engagement and growth.",
  },
};
export default function UIUXPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "UI/UX Design Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Design systems, user experience strategy, and conversion-optimized interfaces.",
    url: "/Uiux",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    
      <UIUXHeroSection />
 

<div style={{ position: "relative", zIndex: 10 }}>
      <UIUXProcess />
      <section id="benefits">
      <UIUXBenefits />
      </section>
      <section id="feature">
      <UIUXFeatures />
      </section>
      <UIUXSolutions />
      <section id="pricing">
        <UIUXPricing />
      </section>
       <UIUXShowcaseLogos logos={showcaseLogos} iconGap={200}/>
      <UIUXTutorials />
      <section id="faq">
      <FAQSection
        title={`Questions?\nWe're here to assist!`}
        category="uiux"
        accentColor="#7C3AED"
        defaultOpenIndex={0}
      />
      </section>
      <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #6214D9 0%, rgba(98,20,217,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#6214D9"
  tiltIntensity={14}
/>
      <Footer />
      
      </div>
    </>
  );
}
