import type { Metadata } from "next";
import CloudServicesSection from "@/components/Cloud/CloudServiceSection/CloudServicesSection";

import OurWorkFinal from "@/components/Cloud/WorkSection/OurWorkFinal";
import ScrollZoomStats from "@/components/Cloud/SrollZoom/ScrollZoomStats";
import MoreAboutSection from "@/components/Cloud/MoreAboutUs/MoreAboutSection";
import Awards from "@/components/Cloud/Awards/Awards";
import ProcessSection from "@/components/Cloud/Process/ProcessSection";
import TestimonialsSection from "@/components/Cloud/Testimonials/TestimonialsSection";
import HeroSection from "@/components/Cloud/Hero/HeroSection";
import CTASection from "@/components/Shared/CTASection/CTASection";

import FAQSection from "@/components/Shared/FAQSection/FAQSection";
import Footer from "@/components/Shared/Footer/Footer";

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
      <section id="benefits">
      <Awards />
      </section>
      <ProcessSection />
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
