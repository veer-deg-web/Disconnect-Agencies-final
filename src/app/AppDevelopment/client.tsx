import BuildPocket from '@/components/AppDevelopment/BuildPocket/BuiltPocket';
import HeroSection from '@/components/AppDevelopment/HeroSection/HeroSection';
import ProductVisuals from '@/components/AppDevelopment/ProductVisuals/ProductVisuals';
import Reviews from '@/components/AppDevelopment/Review/Reviews';
import StickyProcess from '@/components/AppDevelopment/StickyProcess/StickyProcess';
import CTASection from '@/components/Shared/CTASection/CTASection';
import Footer from '@/components/Shared/Footer/Footer';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/Shared/FAQSection/FAQSection';


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <section id="feature">
      <ProductVisuals/>
      </section>
      <section id="benefits">
      <BuildPocket/>
      </section>
      <StickyProcess/>
      <section id="testimonials">
      <Reviews/>
      </section>
     <section id="pricing">
        <PricingSection
          headingTitle="App Development Pricing"
          headingGradient={[
            "#5869E3",
            "#7C8CF8",
            "#A5B4FC",
          ]}
          accentColor="#5869E3"
          serviceSlug="AppDevelopment"
          plansOverride={{
            build: [
              {
                title: "Starter",
                price: "From $7,999",
                subtitle: "MVP build",
                highlight: false,
                badge: null,
                note: "2+ months maintenance included",
                features: [
                  "Basic app (MVP)",
                  "Core features",
                  "UI integration",
                  "Backend setup",
                  "Deployment support",
                ],
                cta: "Start Project",
              },
              {
                title: "Core",
                price: "From $12,999",
                subtitle: "Full-featured app",
                highlight: false,
                badge: null,
                note: "2+ months maintenance included",
                features: [
                  "Everything in Starter",
                  "Advanced features",
                  "API integrations",
                  "Scalable backend",
                  "Performance optimization",
                ],
                cta: "Start Project",
              },
              {
                title: "Vision",
                price: "From $19,999",
                subtitle: "End-to-end product",
                highlight: true,
                badge: "Best Value",
                note: "2+ months maintenance included",
                features: [
                  "Everything in Core",
                  "Full product build",
                  "End-to-end system",
                  "High scalability",
                  "Deployment + optimization",
                ],
                cta: "Start Project",
              },
            ],
            maintenance: [
              {
                title: "Starter",
                price: "From $7,999",
                subtitle: "+ $3,199/year",
                highlight: false,
                badge: null,
                note: "40% of project cost yearly",
                features: [
                  "System monitoring",
                  "Bug fixes",
                  "Security updates",
                  "Performance upkeep",
                ],
                cta: "Continue Maintenance",
              },
              {
                title: "Core",
                price: "From $12,999",
                subtitle: "+ $5,199/year",
                highlight: false,
                badge: null,
                note: "40% of project cost yearly",
                features: [
                  "Priority monitoring",
                  "Faster issue resolution",
                  "Health optimization",
                  "Priority support",
                ],
                cta: "Continue Maintenance",
              },
              {
                title: "Vision",
                price: "From $19,999",
                subtitle: "+ $7,999/year",
                highlight: true,
                badge: "Recommended",
                note: "40% of project cost yearly",
                features: [
                  "Dedicated team oversight",
                  "Advanced monitoring",
                  "Critical priority support",
                  "Long-term system stability",
                ],
                cta: "Full Partnership",
              },
            ],
          }}
        />

</section>
<section id="faq">
<FAQSection
  category="appdev"
  accentColor="#5869E3"

/>
</section>
     <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #3B4EC3 0%, rgba(59,78,195,0.45) 35%, #0b0b0b 75%)"
  tiltGlow="#3B4EC3"
  tiltIntensity={14}
/>
      <Footer/>
    </main>
    
  );
}
