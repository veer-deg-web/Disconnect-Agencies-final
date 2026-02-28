import type { Metadata } from "next";
import GrowthShowcaseSection from "@/components/Home/GrowthShowcaseSection/GrowthShowcaseSection";
import HeroSection  from "@/components/Home/HeroSection/HeroSection";
import PageBackground from "@/components/Home/PageBackground/PageBackground";
import ScrollToQuerySection from "@/components/Home/ScrollToQuerySection";

import ServicesSection from "@/components/Home/ServicesSection/ServicesSection";
import SmartGrowthSection from "@/components/Home/SmartGrowthSection/SmartGrowthSection";
import VisionShowcase from "@/components/Home/VisionShowcase/VisionShowcase";

import PerformanceMetrics from "@/components/Home/PerformanceMetrics/PerformanceMetrics";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection/TestimonialsSection";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "Disconnect Agencies | Full-Service Design & Development Agency",
  description:
    "Disconnect Agencies helps founders and teams design, build, and scale products across web, app, UI/UX, SEO, cloud, and AI.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Disconnect Agencies | Full-Service Design & Development Agency",
    description:
      "End-to-end product design, engineering, and launch support for modern businesses.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disconnect Agencies | Full-Service Design & Development Agency",
    description:
      "End-to-end product design, engineering, and launch support for modern businesses.",
  },
};


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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Disconnect Agencies",
    url: "/",
    description:
      "Full-service product agency for design, development, AI, SEO, and cloud solutions.",
  };

  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollToQuerySection />
      <main className="relative min-h-screen text-white overflow-hidden">
        <HeroSection />
      </main>
      <section id="feature">
      <VisionShowcase />
      </section>
      <section id="services">
      <ServicesSection/>
      </section>
      <GrowthShowcaseSection />
      <section id="benefits">
      <SmartGrowthSection />
      </section>
      
      <PerformanceMetrics />
      <section id="pricing">
      <PricingSection/>
</section>
      <section id="testimonials">
      <TestimonialsSection/>
      </section>
      <section id="faq">
      <FAQSection
  title="FAQ"
  category="general"
  accentColor="#DE5E03"
  defaultOpenIndex={0}
/>
      </section>
      <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #DE5E03 0%, rgba(222,94,3,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#DE5E03"
  tiltIntensity={14}
/>
      <Footer/></PageBackground>
    
    
  );
}
