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
import { showcaseLogos } from "@/Data/showcaseLogos";

export const metadata: Metadata = {
  title: "AI Models & Automation",
  description:
    "Custom AI models, workflow automation, and intelligent systems built to improve business efficiency and scale.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/AIModels" },
  openGraph: {
    title: "AI Models & Automation",
    description:
      "AI automation, integration, and optimization services for modern teams.",
    type: "website",
    url: "/AIModels",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Models & Automation",
    description:
      "AI automation, integration, and optimization services for modern teams.",
  },
};

export default function Ai() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Models & Automation Services",
    provider: { "@type": "Organization", name: "Disconnect" },
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
      <UIUXShowcaseLogos logos={showcaseLogos} iconGap={200} title="Our Trusted Partners." />
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
          headingTitle="Pricing That Grows With Your AI"
          headingGradient={[
            "#7C3AED",
            "#A78BFA",
            "#22D3EE",
          ]}
          accentColor="#7C3AED"
          serviceSlug="AIModels"
          hoverScale={true}
          plansOverride={{
            build: [
              {
                title: "Starter",
                price: "From $5,999",
                subtitle: "AI integration",
                highlight: false,
                badge: null,
                note: "2+ months maintenance included",
                features: [
                  "Basic automation workflows",
                  "API-based AI integrations",
                  "Deployment support",
                  "Post-delivery handover",
                ],
                cta: "Start Project",
              },
              {
                title: "Core",
                price: "From $11,999",
                subtitle: "Custom AI logic",
                highlight: false,
                badge: null,
                note: "2+ months maintenance included",
                features: [
                  "Everything in Starter",
                  "Custom AI logic",
                  "Workflow automation systems",
                  "Data handling pipelines",
                  "Priority execution",
                ],
                cta: "Start Project",
              },
              {
                title: "Vision",
                price: "From $18,999",
                subtitle: "Enterprise AI systems",
                highlight: true,
                badge: "Best Value",
                note: "2+ months maintenance included",
                features: [
                  "Everything in Core",
                  "Advanced AI systems",
                  "Multi-layer automation",
                  "Business process transformation",
                  "On-site strategy session",
                ],
                cta: "Start Project",
              },
            ],
            maintenance: [
              {
                title: "Starter",
                price: "From $5,999",
                subtitle: "+ $2,399/year",
                highlight: false,
                badge: null,
                note: "40% of project cost yearly",
                features: [
                  "Workflow monitoring",
                  "Bug fixes & integration upkeep",
                  "Security updates",
                  "Email support",
                ],
                cta: "Continue Maintenance",
              },
              {
                title: "Core",
                price: "From $11,999",
                subtitle: "+ $4,799/year",
                highlight: false,
                badge: null,
                note: "40% of project cost yearly",
                features: [
                  "Priority monitoring",
                  "Pipeline health checks",
                  "Faster issue resolution",
                  "Priority support",
                ],
                cta: "Continue Maintenance",
              },
              {
                title: "Vision",
                price: "From $18,999",
                subtitle: "+ $7,599/year",
                highlight: true,
                badge: "Recommended",
                note: "40% of project cost yearly",
                features: [
                  "Dedicated AI oversight",
                  "Advanced system monitoring",
                  "Critical priority support",
                  "Long-term AI stability",
                ],
                cta: "Full Partnership",
              },
            ],
          }}
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
