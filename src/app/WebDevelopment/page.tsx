import type { Metadata } from "next";
import WebDevContent from "@/components/WebDevelopment/WebDevContent";
import Footer from "@/components/Shared/Footer/Footer";

// ── /WebDevelopment ──────────────────────────────────────
// Title (raw):      "Web Development & Engineering Services"   [38 chars]
// Title (rendered): "Web Development & Engineering Services | Disconnect" [51 chars] ✅
// Description:      [150 chars] ✅
// Canonical:        https://disconnect.software/WebDevelopment ✅
export const metadata: Metadata = {
  title: "Web Development & Engineering Services",
  description:
    "Custom websites and full-stack web apps built with React, Next.js, and modern frameworks — trusted by businesses for real, measurable growth. Explore now.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/WebDevelopment" },
  openGraph: {
    title: "Web Development & Engineering Services",
    description:
      "Custom websites and web products engineered for performance, scalability, and growth.",
    type: "website",
    url: "/WebDevelopment",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development & Engineering Services",
    description:
      "Custom websites and web products engineered for performance, scalability, and growth.",
  },
  keywords: [
    "web development",
    "custom website design",
    "React.js",
    "Next.js",
    "full-stack development",
    "e-commerce solutions",
    "responsive design",
    "frontend engineering",
    "backend development",
    "high-performance web",
  ],
};

export default function WebDevelopmentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Development Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Custom web development, frontend engineering, and scalable web architecture.",
    url: "/WebDevelopment",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebDevContent />
      <Footer />
    </>
  );
}
