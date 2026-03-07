"use client";

import useCity from "@/hooks/useCity";

type DynamicCityProps = {
  fallback?: string;
};

export default function DynamicCity({ fallback = "your city" }: DynamicCityProps) {
  const { city } = useCity();
  return <>{city || fallback}</>;
}
