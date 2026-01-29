"use client";
import BuildPocket from '@/components/AppDevelopment/BuildPocket/BuiltPocket';
import HeroSection from '@/components/AppDevelopment/HeroSection/HeroSection';
import ProductVisuals from '@/components/AppDevelopment/ProductVisuals/ProductVisuals';
import Reviews from '@/components/AppDevelopment/Review/Reviews';
import StickyProcess from '@/components/AppDevelopment/StickyProcess/StickyProcess';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProductVisuals/>
      <BuildPocket/>
      <StickyProcess/>
      <Reviews/>
      <PricingSection/>
      <CTASection/>
      <Footer/>
    </main>
    
  );
}
