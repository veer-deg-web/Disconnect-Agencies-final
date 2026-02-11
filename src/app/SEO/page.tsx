import HeroSection from "@/components/SEO/HeroSection/HeroSection";  
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SeoProcess from "@/components/SEO/Seoprocess/SEOProcessSection";
import SEOServicesSection from "@/components/SEO/Services/SeoServiceSection";
import UIUXPricing from "@/components/uiux/UIUXPricing";
import FeaturedServicesSection from "@/components/SEO/FeaturedServiceSection/FeaturedSevicesSection";
import ReviewsSection from "@/components/SEO/Review/ReviewsSection";

export default function SEOPage() {
  return (
    <main>
      <HeroSection />
      <SeoProcess />
      <SEOServicesSection />
      <FeaturedServicesSection />
      <UIUXPricing />
      <ReviewsSection />
     <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, 
  #3B6CFF 0%, 
  rgba(59,108,255,0.35) 35%, 
  #0b0b0b 70%, 
  #0b0b0b 100%)"
/>
      <Footer />
    </main>
  );
}