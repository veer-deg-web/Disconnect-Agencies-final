import type { Metadata } from "next";
import CloudContent from "@/components/Cloud/CloudContent";
import Footer from "@/components/Shared/Footer/Footer";

// ── /Cloud ───────────────────────────────────────────────
// Title (raw):      "Cloud Infrastructure & DevOps Services"   [38 chars]
// Title (rendered): 51 chars ✅ | Description: [147 chars] ✅
export const metadata: Metadata = {
  title: "Cloud Infrastructure & DevOps Services",
  description:
    "Scalable cloud architecture, CI/CD pipelines, cloud security, and managed infrastructure services trusted by growing businesses. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/Cloud" },
  openGraph: {
    title: "Cloud Infrastructure & DevOps Services",
    description:
      "Secure, scalable cloud engineering — architecture, migration, and optimization for high-growth businesses.",
    type: "website",
    url: "/Cloud",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Infrastructure & DevOps Services",
    description:
      "Secure, scalable cloud engineering — architecture, migration, and optimization for high-growth businesses.",
  },
  keywords: [
    "cloud infrastructure",
    "cloud migration",
    "CI/CD",
    "AWS architecture",
    "Azure deployment",
    "Google Cloud Platform",
    "cloud security",
    "scalable hosting",
    "DevOps services",
    "high-performance infra",
  ],
};

export default function CloudPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cloud Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "End-to-end cloud services including architecture, deployment, and optimization.",
    url: "/Cloud",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CloudContent />
      <Footer />
    </>
  );
}
