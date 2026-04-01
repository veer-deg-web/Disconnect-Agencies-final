import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the team at Disconnect Agencies. We're looking for focused engineers, designers, and strategists who care about the work they ship.",
  keywords: [
    "careers at Disconnect",
    "join Disconnect Agencies",
    "software developer jobs",
    "UI/UX designer roles",
    "AI engineer jobs",
    "remote tech jobs",
    "digital agency careers",
    "work at Disconnect",
  ],
  alternates: { canonical: "/careers" },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
