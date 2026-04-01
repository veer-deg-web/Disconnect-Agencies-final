import type { Metadata } from "next";
import UiuxContent from "@/components/uiux/UiuxContent";
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: "UI/UX Design",
  description:
    "User-focused UI/UX design services with research, wireframes, visual design, and conversion-driven experiences.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/Uiux" },
  openGraph: {
    title: "UI/UX Design",
    description:
      "Modern interface design and product UX systems crafted for engagement and growth.",
    type: "website",
    url: "/Uiux",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design",
    description:
      "Modern interface design and product UX systems crafted for engagement and growth.",
  },
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
