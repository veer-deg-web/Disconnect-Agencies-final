import type { Metadata } from "next";
import AppDevContent from "@/components/AppDevelopment/AppDevContent";
import Footer from "@/components/Shared/Footer/Footer";

// ── /AppDevelopment ──────────────────────────────────────
// Title (raw):      "App Development for iOS, Android & Web"  [38 chars]
// Title (rendered): "App Development for iOS, Android & Web | Disconnect" [51 chars] ✅
// Description:      [144 chars] ✅
// Canonical:        https://disconnect.software/AppDevelopment ✅
export const metadata: Metadata = {
  title: "App Development for iOS, Android & Web",
  description:
    "iOS, Android, React Native, and Flutter app development from MVP to enterprise scale — proven results for modern product teams. Book a free call.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/AppDevelopment" },
  openGraph: {
    title: "App Development for iOS, Android & Web",
    description:
      "End-to-end app development for modern businesses, built for speed and scalability.",
    type: "website",
    url: "/AppDevelopment",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Development for iOS, Android & Web",
    description:
      "End-to-end app development for modern businesses, built for speed and scalability.",
  },
  keywords: [
    "app development",
    "mobile app development",
    "iOS apps",
    "Android apps",
    "React Native development",
    "Flutter apps",
    "custom app builder",
    "mobile product engineering",
    "app design",
  ],
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
