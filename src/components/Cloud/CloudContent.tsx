"use client";

import CloudServicesSection from "@/components/Cloud/CloudServiceSection/CloudServicesSection";
import OurWorkFinal from "@/components/Cloud/WorkSection/OurWorkFinal";
import ScrollZoomStats from "@/components/Cloud/SrollZoom/ScrollZoomStats";
import MoreAboutSection from "@/components/Cloud/MoreAboutUs/MoreAboutSection";
import ProcessSection from "@/components/Cloud/Process/ProcessSection";
import TestimonialsSection from "@/components/Cloud/Testimonials/TestimonialsSection";
import HeroSection from "@/components/Cloud/Hero/HeroSection";
import CTASection from "@/components/Shared/CTASection/CTASection";
import FAQSection from "@/components/Shared/FAQSection/FAQSection";

export default function CloudContent() {
  return (
    <main style={{ backgroundColor: "#000000" }}>
      <HeroSection />
      <section id="feature">
        <CloudServicesSection />
      </section>
      <OurWorkFinal />
      <ScrollZoomStats />
      <MoreAboutSection />
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
    </main>
  );
}
