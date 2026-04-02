"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSeoCityBySlug } from "@/Data/seoCities";
import { getSeoCountryBySlug } from "@/Data/seoCountries";

const CITY_STORAGE_KEY = "disconnect_city";
const CITY_COOKIE_KEY = "disconnect_city";
const CITY_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

let cachedCity: string | null = null;
let cityRequest: Promise<string> | null = null;

const normalizeCity = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const persistCity = (city: string) => {
  if (typeof window === "undefined") return;
  const normalized = normalizeCity(city);
  if (!normalized) return;

  localStorage.setItem(CITY_STORAGE_KEY, normalized);
  document.cookie = `${CITY_COOKIE_KEY}=${encodeURIComponent(
    normalized
  )}; path=/; max-age=${CITY_COOKIE_MAX_AGE}; samesite=lax`;
  cachedCity = normalized;
};

const readStoredCity = (): string => {
  if (typeof window === "undefined") return "";
  return normalizeCity(localStorage.getItem(CITY_STORAGE_KEY));
};

const readCityFromPathname = (pathname: string): string => {
  const cleanPath = normalizeCity(pathname);
  if (!cleanPath) return "";

  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length < 2) return "";

  const maybeSlug = normalizeCity(
    decodeURI(segments[segments.length - 1] ?? "")
  ).toLowerCase();
  if (!maybeSlug) return "";

  const matchedCity = getSeoCityBySlug(maybeSlug);
  if (matchedCity) return matchedCity.name;

  const matchedCountry = getSeoCountryBySlug(maybeSlug);
  return matchedCountry?.name ?? "";
};

const fetchCityOnce = async (): Promise<string> => {
  if (cachedCity) return cachedCity;
  if (cityRequest) return cityRequest;

  cityRequest = fetch("https://ipapi.co/json/", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) return "";
      const data = (await res.json()) as {
        city?: string;
        region?: string;
        country_name?: string;
      };

      const resolvedLocation =
        normalizeCity(data?.city) ||
        normalizeCity(data?.region) ||
        normalizeCity(data?.country_name);

      if (resolvedLocation) persistCity(resolvedLocation);
      return resolvedLocation;
    })
    .catch(() => "")
    .finally(() => {
      cityRequest = null;
    });

  return cityRequest;
};

export type UseCityResult = {
  city: string;
  isLoading: boolean;
  setCity: (city: string) => void;
};

export default function useCity(): UseCityResult {
  const pathname = usePathname();
  const [city, setCityState] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const routeCity = readCityFromPathname(pathname);
      if (routeCity) {
        if (!active) return;
        persistCity(routeCity);
        setCityState(routeCity);
        setIsLoading(false);
        return;
      }

      const localCity = readStoredCity();
      if (localCity) {
        if (!active) return;
        setCityState(localCity);
        setIsLoading(false);
        persistCity(localCity);
        return;
      }

      const fetchedCity = await fetchCityOnce();
      if (!active) return;
      setCityState(fetchedCity);
      setIsLoading(false);
    };

    void init();

    return () => {
      active = false;
    };
  }, [pathname]);

  const setCity = useCallback((nextCity: string) => {
    const normalized = normalizeCity(nextCity);
    if (!normalized) return;
    persistCity(normalized);
    setCityState(normalized);
    setIsLoading(false);
  }, []);

  return { city, isLoading, setCity };
}
