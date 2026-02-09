import HeroNav from "@/components/HeroNavbar";
import CloudServicesSection from "@/components/Cloud/CloudServiceSection/CloudServicesSection";
import OurWorkStack from "@/components/Cloud/WorkSection/OurWorkStack";
import OurWorkFinal from "@/components/Cloud/WorkSection/OurWorkFinal";
import ScrollZoomStats from "@/components/Cloud/SrollZoom/ScrollZoomStats";
import MoreAboutSection from "@/components/Cloud/MoreAboutUs/MoreAboutSection";
import Awards from "@/components/Cloud/Awards/Awards";
import ProcessSection from "@/components/Cloud/Process/ProcessSection";
import TestimonialsSection from "@/components/Cloud/Testimonials/TestimonialsSection";

export default function CloudPage() {
    return (    
        <main>

            <HeroNav 
                
            />
            <CloudServicesSection/>
            <OurWorkFinal/>
            <ScrollZoomStats/>  
            <MoreAboutSection   />
            <Awards/>
            <ProcessSection/>
            <TestimonialsSection/>

        </main>
    );          
}