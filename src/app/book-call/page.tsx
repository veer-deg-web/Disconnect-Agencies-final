"use client";

import { useSearchParams } from "next/navigation";
import BookingSteps from "@/components/booking/BookingStep";
import { CategoryType, categories } from "@/components/data/serviceData";

export default function BookCallPage() {
  const search = useSearchParams();
  const categoryParam = search.get("category") as CategoryType | null;

  const initialCategory: CategoryType =
    categoryParam && categories.includes(categoryParam)
      ? categoryParam
      : "website";

  return <BookingSteps initialCategory={initialCategory} />;
}
