import GrowthShowcaseSection from "@/components/GrowthShowcaseSection";
import HeroSection  from "@/components/HeroSection";
import PageBackground from "@/components/PageBackground";

import ServicesSection from "@/components/ServicesSection";
import SmartGrowthSection from "@/components/SmartGrowthSection";
import VisionShowcase from "@/components/VisionShowcase";

import PerformanceMetrics from "@/components/PerformaceMetrics";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";





export default function Home() {
  return (
    <PageBackground>
      <main className="relative min-h-screen text-white overflow-hidden">
        <HeroSection />
      </main>
      <VisionShowcase />
      <ServicesSection/>
      <GrowthShowcaseSection />
      <SmartGrowthSection />
      
      <PerformanceMetrics />
      <PricingSection/>
      <TestimonialsSection/>
      <FAQSection/>
      <CTASection/>
      <Footer/>
    </PageBackground>
    
  );
}
