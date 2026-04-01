import type { Metadata } from "next";
import CloudServicesSection from "@/components/Cloud/CloudServiceSection/CloudServicesSection";

import OurWorkFinal from "@/components/Cloud/WorkSection/OurWorkFinal";
import ScrollZoomStats from "@/components/Cloud/SrollZoom/ScrollZoomStats";
import MoreAboutSection from "@/components/Cloud/MoreAboutUs/MoreAboutSection";
// import Awards from "@/components/Cloud/Awards/Awards";
import ProcessSection from "@/components/Cloud/Process/ProcessSection";
import TestimonialsSection from "@/components/Cloud/Testimonials/TestimonialsSection";
import HeroSection from "@/components/Cloud/Hero/HeroSection";
import CTASection from "@/components/Shared/CTASection/CTASection";

import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import Footer from "@/components/Shared/Footer/Footer";
import PricingSection from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Cloud Services",
  description:
    "Cloud architecture, migration, optimization, and scalable infrastructure services for modern products.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/Cloud" },
  openGraph: {
    title: "Cloud Services",
    description:
      "Secure and scalable cloud engineering for high-growth businesses.",
    type: "website",
    url: "/Cloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Services",
    description:
      "Secure and scalable cloud engineering for high-growth businesses.",
  },
};

export default function CloudPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cloud Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "End-to-end cloud services including architecture, deployment, and optimization.",
    url: "/Cloud",
  };

  return (
    <main style={{ backgroundColor: "#000000" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <section id="feature">
      <CloudServicesSection />
      </section>
      <OurWorkFinal />
      <ScrollZoomStats />
      <MoreAboutSection />
      {/* 
      <section id="benefits">
        <Awards />
      </section> 
      */}
      <ProcessSection />
      <section id="pricing">
        <PricingSection
          headingTitle="Cloud Infrastructure Pricing"
          headingGradient={["#84cc16", "#DBFE49", "#a3e635"]}
          accentColor="#DBFE49"
          serviceSlug="Cloud"
          plansOverride={{
            build: [
              {
                title: "Starter",
                price: "From $3,999",
                subtitle: "Foundation setup",
                highlight: false,
                badge: null,
                note: "2+ months support included",
                features: [
                  "Basic deployment",
                  "Hosting setup",
                  "CI/CD basics",
                  "Deployment support",
                ],
                cta: "Get Started",
              },
              {
                title: "Core",
                price: "From $7,999",
                subtitle: "Scalable infrastructure",
                highlight: false,
                badge: null,
                note: "2+ months support included",
                features: [
                  "Everything in Starter",
                  "Scalable infrastructure",
                  "Monitoring systems",
                  "Load balancing",
                ],
                cta: "Get Started",
              },
              {
                title: "Vision",
                price: "From $14,999",
                subtitle: "Enterprise-grade",
                highlight: true,
                badge: "Best Value",
                note: "2+ months support included",
                features: [
                  "Everything in Core",
                  "Enterprise-level architecture",
                  "Auto-scaling systems",
                  "Security + redundancy",
                ],
                cta: "Get Started",
              },
            ],
            maintenance: [
              {
                title: "Starter",
                price: "From $3,999",
                subtitle: "+ $1,599/year",
                highlight: false,
                badge: null,
                note: "40% of project cost yearly",
                features: [
                  "Infrastructure monitoring",
                  "Security patches",
                  "Uptime monitoring",
                  "Email support",
                ],
                cta: "Continue Support",
              },
              {
                title: "Core",
                price: "From $7,999",
                subtitle: "+ $3,199/year",
                highlight: false,
                badge: null,
                note: "40% of project cost yearly",
                features: [
                  "Priority monitoring",
                  "Scaling management",
                  "Faster issue resolution",
                  "Priority support",
                ],
                cta: "Continue Support",
              },
              {
                title: "Vision",
                price: "From $14,999",
                subtitle: "+ $5,999/year",
                highlight: true,
                badge: "Recommended",
                note: "40% of project cost yearly",
                features: [
                  "Dedicated team oversight",
                  "Advanced monitoring",
                  "Critical priority SLA",
                  "Full infrastructure health",
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
        category="cloud"
        accentColor="#DBFE49"
        title="Answer To Your Queries"
      />
      </section>
      <CTASection
        gradient="radial-gradient(80% 120% at 50% 100%, #DCEC8F 0%, rgba(220,236,143,0.5) 35%, #0b0b0b 75%)"
        tiltGlow="#DCEC8F"
        tiltIntensity={11}
      />
      <Footer />

    </main>
  );
}
