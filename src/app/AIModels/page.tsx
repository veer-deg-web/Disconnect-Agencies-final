import type { Metadata } from "next";
import AiContent from "@/components/Ai/AiContent";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "AI Models & Automation",
  description:
    "Custom AI models, workflow automation, and intelligent systems built to improve business efficiency and scale.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/AIModels" },
  openGraph: {
    title: "AI Models & Automation",
    description:
      "AI automation, integration, and optimization services for modern teams.",
    type: "website",
    url: "/AIModels",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Models & Automation",
    description:
      "AI automation, integration, and optimization services for modern teams.",
  },
  keywords: [
    "AI automation",
    "custom AI models",
    "large language models",
    "LLM integration",
    "workflow automation",
    "AI agents",
    "machine learning",
    "business AI",
    "predictive analytics",
    "AI consulting",
  ],
};

export default function Ai() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Models & Automation Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Custom AI development, integration, and optimization for business workflows.",
    url: "/AIModels",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiContent />
      <Footer />
    </>
  );
}
