import type { Metadata } from "next";

// ── /feedback ────────────────────────────────────────────
// Title (raw):      "Client Reviews — Share Your Experience" [38 chars]
// Title (rendered): 51 chars ✅ | Description: [155 chars] ✅
export const metadata: Metadata = {
  title: "Client Reviews — Share Your Experience",
  description:
    "Share your experience working with Disconnect. Your feedback helps us improve and may be featured as a client testimonial on our website. Get started today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/feedback" },
  openGraph: {
    title: "Client Reviews — Share Your Experience",
    description:
      "Share your experience working with Disconnect — your feedback may be featured as a testimonial.",
    url: "/feedback",
    siteName: "Disconnect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Reviews — Share Your Experience",
    description:
      "Share your experience working with Disconnect — your feedback may be featured as a testimonial.",
  },
  keywords: [
    "client feedback",
    "testimonials",
    "Disconnect reviews",
    "customer experience",
    "service feedback",
  ],
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
