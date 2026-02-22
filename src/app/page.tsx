import GrowthShowcaseSection from "@/components/Home/GrowthShowcaseSection/GrowthShowcaseSection";
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
import { Section } from "lucide-react";


const faqs = [
  {
    question: "How is Aset different?",
    answer:
      "Aset isn’t just another investment platform—it’s powered by real-time AI that adapts to market changes, automates portfolio optimization, and provides actionable insights that go beyond static inputs or manual strategies.",
  },
  {
    question: "Is Aset suitable for beginners?",
    answer:
      "Yes. Aset is designed for both beginners and experienced investors. The platform simplifies complex financial concepts while offering advanced tools for those who want deeper control.",
  },
  {
    question: "How secure is my data and portfolio on Aset?",
    answer:
      "Security is our top priority. Aset uses industry-standard encryption, secure infrastructure, and best practices to ensure your data and investments remain protected at all times.",
  },
  {
    question: "Can I customize my investment strategy?",
    answer:
      "Absolutely. You can tailor strategies based on your goals, risk tolerance, and preferences, while still benefiting from AI-driven recommendations and automation.",
  },
  {
    question: "What kind of assets can I manage with Aset?",
    answer:
      "Aset supports a wide range of assets, including stocks, ETFs, and other investment instruments, allowing you to manage and optimize your portfolio from a single dashboard.",
  },
];


export default function Home() {
  return (
    <PageBackground>
      <main className="relative min-h-screen text-white overflow-hidden">
        <HeroSection />
      </main>
      <VisionShowcase />
      <section id="services">
      <ServicesSection/>
      </section>
      <GrowthShowcaseSection />
      <SmartGrowthSection />
      
      <PerformanceMetrics />
      <section id="pricing">
      <PricingSection/>
</section>
      <TestimonialsSection/>
      <FAQSection
  title="FAQ"
  category="general"
  defaultOpenIndex={0}
/>
      <CTASection
<<<<<<< HEAD
        gradient="radial-gradient(80% 120% at 50% 100%, #DE5E03 0%, rgba(222,94,3,0.45) 35%, #0b0b0b 75%)"
        tiltGlow="#DE5E03"
        tiltIntensity={14}
      />
    </PageBackground>


=======
  gradient="radial-gradient(80% 120% at 50% 100%, #DE5E03 0%, rgba(222,94,3,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#DE5E03"
  tiltIntensity={14}
/>
      <Footer/></PageBackground>
    
    
>>>>>>> 48b7a3addeb201b8a37908428e5dc004fd4ba25e
  );
}
