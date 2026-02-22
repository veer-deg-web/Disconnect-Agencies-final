import UIUXHeroSection from "@/components/uiux/UIUXHeroSection";
import UIUXShowcase from "@/components/uiux/UIUXShowcase";
import UIUXProcess from "@/components/uiux/UIUXProcess";
import UIUXBenefits from "@/components/uiux/UIUXBenefits";
import UIUXFeatures from "@/components/uiux/UIUXFeatures";
import UIUXSolutions from "@/components/uiux/UIUXSolutions";
import UIUXPricing from "@/components/uiux/UIUXPricing";

import UIUXTutorials from "@/components/uiux/UIUXTutorials";

import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si"; 

const heroLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
];




export default function UIUXPage() {
  return (
    <>
    
      <UIUXHeroSection />
 

<div style={{ position: "relative", zIndex: 10 }}>
        <UIUXShowcase />
      <UIUXProcess />
      <UIUXBenefits />
      <UIUXFeatures />
      <UIUXSolutions />
      <section id="pricing">
        <UIUXPricing />
      </section>
       <UIUXShowcaseLogos logos={heroLogos} iconGap={200}/>
      <UIUXTutorials />
      <FAQSection
        title={`Questions?\nWe're here to assist!`}
        category="uiux"
        accentColor="#7C3AED"
        defaultOpenIndex={0}
      />
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
