import CloudServicesSection from "@/components/Cloud/CloudServiceSection/CloudServicesSection";
import OurWorkStack from "@/components/Cloud/WorkSection/OurWorkStack";
import OurWorkFinal from "@/components/Cloud/WorkSection/OurWorkFinal";
import ScrollZoomStats from "@/components/Cloud/SrollZoom/ScrollZoomStats";
import MoreAboutSection from "@/components/Cloud/MoreAboutUs/MoreAboutSection";
import Awards from "@/components/Cloud/Awards/Awards";
import ProcessSection from "@/components/Cloud/Process/ProcessSection";
import TestimonialsSection from "@/components/Cloud/Testimonials/TestimonialsSection";
import HeroSection from "@/components/Cloud/Hero/HeroSection";
import DotBackground from "@/components/DotBackground/DotBackground";
import CTASection from "@/components/CTASection";
import { Cloudfaq } from "@/Data/Cloudfaq";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function CloudPage() {
  return (
    <main>
      <DotBackground color="rgba(219, 254, 73, 0.18)" />
      <HeroSection />
      <CloudServicesSection />
      <OurWorkFinal />
      <ScrollZoomStats />
      <MoreAboutSection />
      <Awards />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection
        category="cloud"
        accentColor="#DBFE49"
        title="Answer To Your Queries"
      />
      <CTASection
        gradient="radial-gradient(80% 120% at 50% 100%, #DCEC8F 0%, rgba(220,236,143,0.5) 35%, #0b0b0b 75%)"
        tiltGlow="#DCEC8F"
        tiltIntensity={11}
      />
      <Footer />

    </main>
  );
}