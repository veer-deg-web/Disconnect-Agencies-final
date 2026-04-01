import type { Metadata } from "next";
import AppDevContent from "@/components/AppDevelopment/AppDevContent";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "App Development",
  description:
    "Design, development, launch, and scaling support for high-performance mobile and web applications.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/AppDevelopment" },
  openGraph: {
    title: "App Development",
    description:
      "End-to-end app development for modern businesses, built for speed and scalability.",
    type: "website",
    url: "/AppDevelopment",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Development",
    description:
      "End-to-end app development for modern businesses, built for speed and scalability.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "App Development Services",
    provider: { "@type": "Organization", name: "Disconnect" },
    description:
      "Design, development, launch, and optimization services for mobile and web applications.",
    url: "/AppDevelopment",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
        App Development Services
      </h1>
      <AppDevContent />
      <Footer />
    </>
  );
}
