import type { Metadata } from "next";
import UiuxContent from "@/components/uiux/UiuxContent";
import Footer from "@/components/Shared/Footer/Footer";

// ── /Uiux ────────────────────────────────────────────────
// Title (raw):      "UI/UX Design, Wireframes & Prototyping" [38 chars]
// Title (rendered): "UI/UX Design, Wireframes & Prototyping | Disconnect" [51 chars] ✅
// Description:      [142 chars] ✅
// Canonical:        https://disconnect.software/Uiux ✅
export const metadata: Metadata = {
  title: "UI/UX Design, Wireframes & Prototyping",
  description:
    "Expert UI/UX design with wireframes, design systems, Figma handoff, and conversion-driven interfaces trusted by product teams. Book a free call.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/Uiux" },
  openGraph: {
    title: "UI/UX Design, Wireframes & Prototyping",
    description:
      "Modern interface design and product UX systems crafted for engagement and growth.",
    type: "website",
    url: "/Uiux",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design, Wireframes & Prototyping",
    description:
      "Modern interface design and product UX systems crafted for engagement and growth.",
  },
  keywords: [
    "UI/UX design",
    "user experience design",
    "interface design",
    "product design",
    "Figma design",
    "wireframing",
    "prototyping",
    "design systems",
    "visual identity",
    "user-centric design",
  ],
};

export default function UIUXPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "UI/UX Design Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Design systems, user experience strategy, and conversion-optimized interfaces.",
    url: "/Uiux",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UiuxContent />
      <Footer />
    </>
  );
}
