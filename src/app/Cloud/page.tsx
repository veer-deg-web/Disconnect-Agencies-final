import type { Metadata } from "next";
import CloudContent from "@/components/Cloud/CloudContent";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "Cloud Services",
  description:
    "Cloud architecture, migration, optimization, and scalable infrastructure services for modern products.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/Cloud" },
  openGraph: {
    title: "Cloud Services",
    description:
      "Secure and scalable cloud engineering for high-growth businesses.",
    type: "website",
    url: "/Cloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Services",
    description:
      "Secure and scalable cloud engineering for high-growth businesses.",
  },
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
