import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the team at Disconnect Agencies — a small, focused group of elite engineers, designers, and strategists.",
  keywords: [
    "about Disconnect",
    "digital agency team",
    "software engineering team",
    "Alex Rivera",
    "Elena Chen",
    "technology partners",
    "product agency culture",
    "Disconnect Agencies team",
  ],
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
