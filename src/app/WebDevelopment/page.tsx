import type { Metadata } from "next";
import WebDevContent from "@/components/WebDevelopment/WebDevContent";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Reliable and conversion-focused web development services for modern businesses, from design to launch.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/WebDevelopment" },
  openGraph: {
    title: "Web Development",
    description:
      "Custom websites and web products engineered for performance, scalability, and growth.",
    type: "website",
    url: "/WebDevelopment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development",
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
