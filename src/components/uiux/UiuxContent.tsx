"use client";

import UIUXHeroSection from "@/components/uiux/UIUXHeroSection";
import UIUXProcess from "@/components/uiux/UIUXProcess";
import UIUXBenefits from "@/components/uiux/UIUXBenefits";
import UIUXFeatures from "@/components/uiux/UIUXFeatures";
import UIUXSolutions from "@/components/uiux/UIUXSolutions";
import UIUXPricing from "@/components/uiux/UIUXPricing";
import UIUXTutorials from "@/components/uiux/UIUXTutorials";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import { showcaseLogos } from "@/Data/showcaseLogos";

export default function UiuxContent() {
  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      <UIUXHeroSection />
      <UIUXProcess />
      <section id="benefits">
        <UIUXBenefits />
      </section>
      <section id="feature">
        <UIUXFeatures />
      </section>
      <UIUXSolutions />
      <section id="pricing">
        <UIUXPricing 
          serviceSlug="Uiux" 
          basePrice={21999}
          addonPrice={0}
          notIncluded={["Development", "Updates & Revisions (Post-handoff)"]}
        />
      </section>
      <UIUXShowcaseLogos logos={showcaseLogos} iconGap={200} />
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
    </div>
  );
}
