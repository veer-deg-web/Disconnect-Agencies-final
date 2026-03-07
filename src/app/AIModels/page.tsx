import type { Metadata } from "next";
import BenefitsSection from "@/components/Ai/Hero/Benefits/BenefitsSection";
import HeroSection from "@/components/Ai/Hero/HeroSection";
import ProcessSection from "@/components/Ai/Hero/ProcessSection/ProcessSection";
import ServicesSection from "@/components/Ai/Hero/ServiceSection/ServicesSection";
import TestimonialsSection from "@/components/Ai/Hero/Testimoninals/TestimonialsSection";
import AntigravitySection from "@/components/AntiGravity/AntigravitySection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import Footer from "@/components/Shared/Footer/Footer";
import PricingSection from "@/components/PricingSection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import { partnerLogos } from "@/Data/PartnerLogo";

export const metadata: Metadata = {
  title: "AI Models & Automation Services | Disconnect Agencies",
  description:
    "Custom AI models, workflow automation, and intelligent systems built to improve business efficiency and scale.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/AIModels" },
  openGraph: {
    title: "AI Models & Automation Services | Disconnect Agencies",
    description:
      "AI automation, integration, and optimization services for modern teams.",
    type: "website",
    url: "/AIModels",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Models & Automation Services | Disconnect Agencies",
    description:
      "AI automation, integration, and optimization services for modern teams.",
  },
};

export default function Ai() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Models & Automation Services",
    provider: { "@type": "Organization", name: "Disconnect Agencies" },
    description:
      "Custom AI development, integration, and optimization for business workflows.",
    url: "/AIModels",
  };

  return (
    <main style={{ backgroundColor: "#000000" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <UIUXShowcaseLogos logos={partnerLogos} iconGap={200} title="Over 50+ businesses trusts us ." />
      <section id="feature">
      <ServicesSection />
      </section>
      <ProcessSection />
      <AntigravitySection
        label="For Developers"
        title={"Achieve\nNew Heights"}
      />
      <section id="benefits">
      <BenefitsSection />
      </section>
      <section id="pricing">
        <PricingSection
          headingTitle="AI-Powered Pricing Built to Scale"
          headingGradient={[
            "#7C3AED", // violet
            "#A78BFA", // soft purple
            "#22D3EE", // cyan accent
          ]}
          accentColor="#7C3AED"
        /></section>
      <section id="testimonials">
      <TestimonialsSection />
      </section>
      <section id="faq">
      <FAQSection
        category="aimodels"
        accentColor="#7c3aed"
      />
      </section>
      <CTASection
        gradient="radial-gradient(80% 120% at 50% 100%, #814AC8 0%, rgba(129,74,200,0.45) 35%, #0b0b0b 75%)"
        tiltGlow="#814AC8"
        tiltIntensity={14}
      />
      <Footer />
    </main>
  );
}
