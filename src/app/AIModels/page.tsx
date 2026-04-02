import type { Metadata } from "next";
import AiContent from "@/components/Ai/AiContent";
import Footer from "@/components/Shared/Footer/Footer";

// ── /AIModels ────────────────────────────────────────────
// Title (raw):      "AI Models, Agents & Workflow Automation" [39 chars]
// Title (rendered): "AI Models, Agents & Workflow Automation | Disconnect" [52 chars] ✅
// Description:      [149 chars] ✅
// Canonical:        https://disconnect.software/AIModels ✅
export const metadata: Metadata = {
  title: "AI Models, Agents & Workflow Automation",
  description:
    "Custom AI systems, LLM integration, workflow automation, and intelligent agents designed for business efficiency and proven results. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/AIModels" },
  openGraph: {
    title: "AI Models, Agents & Workflow Automation",
    description:
      "AI automation, integration, and optimization services for modern teams.",
    type: "website",
    url: "/AIModels",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Models, Agents & Workflow Automation",
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
