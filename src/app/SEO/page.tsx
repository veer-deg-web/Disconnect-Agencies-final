import type { Metadata } from "next";
import SeoContent from "@/components/SEO/SeoContent";
import Footer from "@/components/Shared/Footer/Footer";

// ── /SEO ─────────────────────────────────────────────────
// Title (raw):      "SEO Services — Technical & On-Page SEO" [38 chars]
// Title (rendered): "SEO Services — Technical & On-Page SEO | Disconnect" [51 chars] ✅
// Description:      [154 chars] ✅
// Canonical:        https://disconnect.software/SEO ✅
export const metadata: Metadata = {
  title: "SEO Services — Technical & On-Page SEO",
  description:
    "Data-driven SEO services — technical audits, on-page optimization, keyword tracking, and content strategy that delivers real organic growth. Explore now.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/SEO" },
  openGraph: {
    title: "SEO Services — Technical & On-Page SEO",
    description:
      "Data-driven SEO services built to increase visibility, rankings, and conversions.",
    type: "website",
    url: "/SEO",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services — Technical & On-Page SEO",
    description:
      "Data-driven SEO services built to increase visibility, rankings, and conversions.",
  },
  keywords: [
    "SEO services",
    "search engine optimization",
    "technical SEO",
    "on-page SEO",
    "content strategy",
    "rank tracking",
    "SEO audit",
    "local SEO",
    "keyword optimization",
    "organic growth",
  ],
};

export default function SEOPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "SEO Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Technical SEO, on-page optimization, and content growth services.",
    url: "/SEO",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoContent />
      <Footer />
    </>
  );
}
