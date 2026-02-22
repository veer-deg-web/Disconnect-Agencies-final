"use client";
import BuildPocket from '@/components/AppDevelopment/BuildPocket/BuiltPocket';
import HeroSection from '@/components/AppDevelopment/HeroSection/HeroSection';
import ProductVisuals from '@/components/AppDevelopment/ProductVisuals/ProductVisuals';
import Reviews from '@/components/AppDevelopment/Review/Reviews';
import StickyProcess from '@/components/AppDevelopment/StickyProcess/StickyProcess';
import CTASection from '@/components/CTASection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProductVisuals />
      <BuildPocket />
      <StickyProcess />
      <Reviews />
      <section id="pricing">
        <PricingSection
<<<<<<< HEAD
          headingTitle="AI-Powered Pricing Built to Scale"
          headingGradient={[
            "#5869E3", // primary indigo
            "#7C8CF8", // soft indigo glow
            "#A5B4FC", // light indigo highlight
          ]}
          accentColor="#5869E3"
        />
      </section>
      <FAQSection
        faqs={faqs}
        accentColor="#5869E3"
=======
  headingTitle="AI-Powered Pricing Built to Scale"
  headingGradient={[
    "#5869E3", // primary indigo
    "#7C8CF8", // soft indigo glow
    "#A5B4FC", // light indigo highlight
  ]}
  accentColor="#5869E3"
/>
</section>
<FAQSection
  category="general"
  accentColor="#5869E3"
>>>>>>> 48b7a3addeb201b8a37908428e5dc004fd4ba25e

      />
      <CTASection
        gradient="radial-gradient(80% 120% at 50% 100%, #3B4EC3 0%, rgba(59,78,195,0.45) 35%, #0b0b0b 75%)"
        tiltGlow="#3B4EC3"
        tiltIntensity={14}
      />
    </main>

  );
}
