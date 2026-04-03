"use client";

import BenefitsSection from "@/components/Ai/Hero/Benefits/BenefitsSection";
import HeroSection from "@/components/Ai/Hero/HeroSection";
import ProcessSection from "@/components/Ai/Hero/ProcessSection/ProcessSection";
import ServicesSection from "@/components/Ai/Hero/ServiceSection/ServicesSection";
import TestimonialsSection from "@/components/Ai/Hero/Testimoninals/TestimonialsSection";
import AntigravitySection from "@/components/AntiGravity/AntigravitySection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import PricingSection from "@/components/PricingSection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import { showcaseLogos } from "@/Data/showcaseLogos";

export default function AiContent() {
  return (
    <main style={{ backgroundColor: "#000000" }}>
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
                price: "From $34,999",
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
                price: "From $59,999",
                subtitle: "Custom AI logic",
                highlight: false,
                badge: null,
                note: "2+ months maintenance included",
                features: [
                  "Everything in Starter",
                  "Custom AI logic design",
                  "Workflow automation systems",
                  "Data handling & pipeline setup",
                  "Priority execution",
                ],
                cta: "Start Project",
              },
              {
                title: "Vision",
                price: "From $99,999",
                subtitle: "Enterprise AI systems",
                highlight: true,
                badge: "Best Value",
                note: "2+ months maintenance included",
                features: [
                  "Everything in Core",
                  "Advanced AI system design",
                  "Multi-layer automation architecture",
                  "End-to-end workflow transformation",
                  "On-site strategy session",
                ],
                cta: "Start Project",
              },
            ],
            maintenance: [
              {
                title: "Starter",
                price: "From $34,999",
                subtitle: "+ $13,999/year",
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
                price: "From $59,999",
                subtitle: "+ $23,999/year",
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
                price: "From $99,999",
                subtitle: "+ $39,999/year",
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
        />
      </section>
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
    </main>
  );
}
