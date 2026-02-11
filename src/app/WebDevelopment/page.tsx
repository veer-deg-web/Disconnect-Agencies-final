import Hero from "@/components/WebDevelopment/Hero/Hero";
import SupportSection from "@/components/WebDevelopment/SupportService/SupportService";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/WebDevelopment/FeatureGridSection/FeatureGridSection";
import IntegrationLogosSection from "@/components/WebDevelopment/IntegrationLogoSection/IntegrationLogoSection";
import PricingSection from "@/components/WebDevelopment/PricingSection/PricingSection";
import SupportedByAI from "@/components/WebDevelopment/SupportedByAi/SupportedByAi";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si"; 
const heroLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Hero />
       <section className="uiux-marquee-section">
    <UIUXShowcaseLogos logos={heroLogos} iconGap={200}/>
  </section>
      <SupportSection />

      <SupportedByAI  /> 
     <FeaturesSection
  headingLine1="Custom-designed modular"
  headingLine2="products at a world-class standard"
  subheading="Each component is designed to work beautifully together, ensuring a seamless experience."
  items={[
    {
      title: "Project Planning",
      description: "Create, assign, and manage tasks with drag-and-drop views.",
      logo: "/icons/planning.svg",
    },
    {
      title: "Team Collaboration",
      description: "Streamline communication and teamwork effortlessly.",
      logo: "/icons/team.svg",
    },
    {
      title: "Live Insights",
      description: "Track performance with real-time analytics.",
      logo: "/icons/insights.svg",
    },
    {
      title: "Easy to Use",
      description: "Intuitive design lets anyone navigate with ease.",
      logo: "/icons/easy.svg",
    },
    {
      title: "Limitless Flexibility",
      description: "Custom workflows that scale with your business.",
      logo: "/icons/flexible.svg",
    },
    {
      title: "Secure at Scale",
      description: "Enterprise-grade security baked in.",
      logo: "/icons/secure.svg",
    },
  ]}
/>
<IntegrationLogosSection />
<PricingSection />
     
<FAQSection
        title={`Questions?\nWe're here to assist!`}
        defaultOpenIndex={0}
         accentColor="#C7FF1A"
        faqs={[
          {
            question: "Why is a strong brand identity important?",
            answer:
              "A robust brand identity and website serve as the face of your business, shaping how it is perceived by potential customers. They not only convey professionalism but also establish trust and credibility, vital factors in today’s competitive market.",
          },
          {
            question: "How long before I see results?",
            answer:
              "Timelines vary based on project scope, but most clients begin to see measurable progress within weeks after launch.",
          },
          {
            question: "Can I cancel anytime?",
            answer:
              "Yes. You can cancel or pause services anytime with proper notice.",
          },
          {
            question: "Do you work with international clients?",
            answer:
              "Absolutely. We work with clients across different time zones and continents.",
          },
          {
            question: "What industries do you specialize in?",
            answer:
              "We specialize in SaaS, fintech, e-commerce, startups, and enterprise platforms.",
          },
        ]}
      />
    <CTASection
  gradient="radial-gradient(80% 120% at 50% 100%, #C7FF1A 0%, #9BE000 40%, #1a1a1a 75%, #0d0d0d 100%)"
/>
      <Footer />
    </>
  );
}