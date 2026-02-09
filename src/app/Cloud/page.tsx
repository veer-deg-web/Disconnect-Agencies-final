import HeroNav from "@/components/HeroNavbar";
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
import{ Cloudfaq } from "@/Data/Cloudfaq";
import FAQSection from "@/components/FAQSection";

export default function CloudPage() {
    return (    
        <main>
<DotBackground color="rgba(219, 254, 73, 0.18)" />
            <HeroNav/>
            <HeroSection/>
            <CloudServicesSection/>
            <OurWorkFinal/>
            <ScrollZoomStats/>  
            <MoreAboutSection   />
            <Awards/>
            <ProcessSection/>
            <TestimonialsSection/>
             <FAQSection
              faqs={Cloudfaq}
              accentColor="#DBFE49"
              title="Answer To Your Queries"
            />
            <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #DBFE49 0%, rgba(219,254,73,0.35) 35%, #0b0b0b 70%, #0b0b0b 100%)"
/>

        </main>
    );          
}