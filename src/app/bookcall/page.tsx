import { redirect } from "next/navigation";

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
