import BenefitsSection from "@/components/Ai/Hero/Benefits/BenefitsSection";
import HeroSection from "@/components/Ai/Hero/HeroSection";
import ProcessSection from "@/components/Ai/Hero/ProcessSection/ProcessSection";
import ServicesSection from "@/components/Ai/Hero/ServiceSection/ServicesSection";
import TestimonialsSection from "@/components/Ai/Hero/Testimoninals/TestimonialsSection";
import AntigravitySection from "@/components/AntiGravity/AntigravitySection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import HeroNavbar from "@/components/HeroNavbar";
import { faqs } from "@/Data/faq";
import PricingSection from "@/components/PricingSection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";  
import { partnerLogos } from "@/Data/PartnerLogo";

export default function Ai() {
  return (
   <>
      <HeroNavbar />
      <HeroSection />
     <UIUXShowcaseLogos logos={partnerLogos} iconGap={200} title="Over 50+ businesses trusts us ." />
      <ServicesSection />  
      <ProcessSection /> 
      <AntigravitySection
        label="For Developers"
        title={"Achieve\nNew Heights"}
        buttonText="Download"
      />
      <BenefitsSection />
      <PricingSection
  headingTitle="AI-Powered Pricing Built to Scale"
  headingGradient={[
    "#7C3AED", // violet
    "#A78BFA", // soft purple
    "#22D3EE", // cyan accent
  ]}
  accentColor="#7C3AED"
/>
      <TestimonialsSection />
      <FAQSection
  faqs={faqs}
  accentColor="#7c3aed"
/>
    <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #814AC8 0%, rgba(129,74,200,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#814AC8"
  tiltIntensity={14}
/>
<Footer />
    </>
  );
}