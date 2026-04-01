import type { Metadata } from "next";
import SeoContent from "@/components/SEO/SeoContent";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "SEO Services",
  description:
    "Technical SEO, on-page optimization, content strategy, and growth-focused search performance services.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/SEO" },
  openGraph: {
    title: "SEO Services",
    description:
      "Data-driven SEO services built to increase visibility, rankings, and conversions.",
    type: "website",
    url: "/SEO",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services",
    description:
      "Data-driven SEO services built to increase visibility, rankings, and conversions.",
  },
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
