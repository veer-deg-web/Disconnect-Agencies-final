import type { Metadata } from "next";
import AppDevelopmentPage from "./client";

export const metadata: Metadata = {
  title: "App Development Services | Disconnect Agencies",
  description:
    "Design, development, launch, and scaling support for high-performance mobile and web applications.",
  alternates: { canonical: "/AppDevelopment" },
  openGraph: {
    title: "App Development Services | Disconnect Agencies",
    description:
      "End-to-end app development for modern businesses, built for speed and scalability.",
    type: "website",
    url: "/AppDevelopment",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Development Services | Disconnect Agencies",
    description:
      "End-to-end app development for modern businesses, built for speed and scalability.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "App Development Services",
    provider: { "@type": "Organization", name: "Disconnect Agencies" },
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
      <AppDevelopmentPage />
    </>
  );
}
