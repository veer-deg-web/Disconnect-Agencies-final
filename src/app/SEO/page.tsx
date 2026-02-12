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
  gradient="radial-gradient(80% 120% at 50% 100%, #3755CD 0%, rgba(55,85,205,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#3755CD"
  tiltIntensity={14}
/>
      <Footer />
    </main>
  );
}