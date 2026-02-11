import UIUXHeroSection from "@/components/uiux/UIUXHeroSection";
import UIUXShowcase from "@/components/uiux/UIUXShowcase";
import UIUXProcess from "@/components/uiux/UIUXProcess";
import UIUXBenefits from "@/components/uiux/UIUXBenefits";
import UIUXFeatures from "@/components/uiux/UIUXFeatures";
import UIUXSolutions from "@/components/uiux/UIUXSolutions";
import UIUXPricing from "@/components/uiux/UIUXPricing";

import UIUXTutorials from "@/components/uiux/UIUXTutorials";

import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";import {
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

const faqs = [
  {
    question: "Why wouldn’t I just hire a full-time designer?",
    answer:
      "Hiring a full-time designer is expensive and inflexible. With our model, you get top-tier design talent on demand—no long-term commitments, overhead, or downtime.",
  },
  {
    question: "Is there a limit to how many requests I can have?",
    answer:
      "No hard limits. You can submit as many requests as you want. We work through them one by one, prioritizing quality and speed.",
  },
  {
    question: "How fast will I receive my designs?",
    answer:
      "Most requests are delivered within 24–48 hours depending on complexity. Larger projects may take slightly longer.",
  },
  {
    question: "Who are the designers?",
    answer:
      "Our designers are senior-level professionals with experience across startups, agencies, and enterprise products.",
  },
  {
    question: "What if I don’t like the design?",
    answer:
      "No worries — we’ll revise it until you’re 100% satisfied. Unlimited revisions are included.",
  },
  {
    question: "Are there any refunds if I don’t like the service?",
    answer:
      "If you’re not happy within the first week, we offer a no-questions-asked refund.",
  },
];


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
       <UIUXShowcaseLogos logos={heroLogos} iconGap={200}/>
      <UIUXTutorials />
      <FAQSection
        title={`Questions?\nWe're here to assist!`}
        faqs={faqs}
        defaultOpenIndex={0}
      />
      <CTASection/>
      <Footer />
      
      </div>
    </>
  );
}
