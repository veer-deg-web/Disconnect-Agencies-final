import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Book A Call Redirect | Disconnect Agencies",
  description: "Redirecting to the canonical booking page.",
  alternates: { canonical: "/book-call" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookCallAliasPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const category = searchParams?.category;
  if (category) {
    redirect(`/book-call?category=${encodeURIComponent(category)}`);
  }
  redirect("/book-call");
}
