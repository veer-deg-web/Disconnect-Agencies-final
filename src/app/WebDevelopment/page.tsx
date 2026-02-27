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
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si"; 
import ClientFeedback from "@/components/WebDevelopment/Testimonial/ClientFeedback";
import FeatureSection from "@/components/WebDevelopment/FeatureSection/FeatureSection";

const heroLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Hero />
       <section className="uiux-marquee-section">
    <UIUXShowcaseLogos logos={heroLogos} iconGap={200}/>
  </section>
      <SupportSection />

     
     <FeatureSection />
     <SupportedByAI  /> 
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
<ClientFeedback />
     
<FAQSection
        title={`Questions?\nWe're here to assist!`}
        defaultOpenIndex={0}
        accentColor="#C7FF1A"
        category="webdev"
      />
    <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #CFFE25 0%, rgba(207,254,37,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#CFFE25"
  tiltIntensity={12}
/>
      <Footer />
    </>
  );
}