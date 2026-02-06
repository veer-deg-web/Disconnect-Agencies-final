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

export default function Ai() {
  return (
   <>
      <HeroNavbar />
      <HeroSection />
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
  gradient="radial-gradient(80% 120% at 50% 100%, #7c3aed 0%, #4c1d95 40%, #1a1a1a 70%, #0d0d0d 100%)"
/>
<Footer />
    </>
  );
}