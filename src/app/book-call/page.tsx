import type { Metadata } from "next";
import { Suspense } from "react";
import BookCallClient from "./BookCallClient";

export const metadata: Metadata = {
  title: "Book A Call",
  description:
    "Book a call with Disconnect to discuss your project requirements and next steps.",
  alternates: { canonical: "/book-call" },
  openGraph: {
    title: "Book A Call | Disconnect Agencies",
    description:
      "Schedule a project discovery call with Disconnect Agencies.",
    type: "website",
    url: "/book-call",
  },
  twitter: {
    card: "summary",
    title: "Book A Call | Disconnect Agencies",
    description:
      "Schedule a project discovery call with Disconnect Agencies.",
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
