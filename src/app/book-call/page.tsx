import type { Metadata } from "next";
import { Suspense } from "react";
import BookCallClient from "./BookCallClient";

// ── /book-call ───────────────────────────────────────────
// Title (raw):      "Book a Free Strategy Call With Our Team" [39 chars]
// Title (rendered): 52 chars ✅ | Description: [155 chars] ✅
// Robots: noindex, nofollow ✅
export const metadata: Metadata = {
  title: "Book a Free Strategy Call With Our Team",
  description:
    "Book a free strategy call with Disconnect to discuss your project requirements, technical scope, and next steps — no commitment required. Get started today.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/book-call" },
  openGraph: {
    title: "Book a Free Strategy Call With Our Team",
    description:
      "Schedule a project discovery call with Disconnect — no commitment required.",
    type: "website",
    url: "/book-call",
    siteName: "Disconnect",
  },
  twitter: {
    card: "summary",
    title: "Book a Free Strategy Call With Our Team",
    description:
      "Schedule a project discovery call with Disconnect — no commitment required.",
  },
  keywords: [
    "book a strategy call",
    "free consultation",
    "service discovery",
    "Disconnect sales",
    "project booking",
    "expert consultation",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Book A Call",
            url: "/book-call",
            about: "Project consultation and service booking",
          }),
        }}
      />
      <Suspense fallback={null}>
        <BookCallClient />
      </Suspense>
    </>
  );
}
