import UIUXHeroSection from "@/components/uiux/UIUXHeroSection";
import UIUXShowcase from "@/components/uiux/UIUXShowcase";
import UIUXProcess from "@/components/uiux/UIUXProcess";
import UIUXBenefits from "@/components/uiux/UIUXBenefits";
import UIUXFeatures from "@/components/uiux/UIUXFeatures";
import UIUXSolutions from "@/components/uiux/UIUXSolutions";
import UIUXPricing from "@/components/uiux/UIUXPricing";
import UIUXTrustedBy from "@/components/uiux/UIUXTrustedBy";
import UIUXTutorials from "@/components/uiux/UIUXTutorials";
import UIUXFAQ from "@/components/uiux/UIUXFAQ";
import UIUXFinalCTA from "@/components/uiux/UIUXFinalCTA";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

export default function UIUXPage() {
  return (
    <>
    <div style={
      {
        minHeight : "200vh",
      }
    }>
      <UIUXHeroSection />
    </div>
      <div style={{
        position: "relative",
        top: "-70vh",
        zIndex: 10,
      }}>
        <UIUXShowcase />
      <UIUXProcess />
      <UIUXBenefits />
      <UIUXFeatures />
      <UIUXSolutions />
      <UIUXPricing />
      <UIUXTrustedBy />
      <UIUXTutorials />
      <FAQSection />
      <CTASection/>
      <Footer />
      
      </div>
    </>
  );
}
