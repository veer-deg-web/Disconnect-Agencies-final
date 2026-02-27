"use client";

import { useSearchParams } from "next/navigation";
import BookingSteps from "@/components/booking/BookingStep";
import { CategoryType, categories } from "@/components/data/serviceData";

export default function BookCallClient() {
  const search = useSearchParams();
  const categoryParam = search.get("category");

  const legacyCategoryAlias: Record<string, CategoryType> = {
    website: "webdev",
    application: "appdev",
    fullstack: "cloud",
  };

  const normalizedCategory = categoryParam
    ? legacyCategoryAlias[categoryParam] || (categoryParam as CategoryType)
    : null;

  const initialCategory: CategoryType =
    normalizedCategory && categories.includes(normalizedCategory)
      ? normalizedCategory
      : "webdev";

  return <BookingSteps initialCategory={initialCategory} />;
}
