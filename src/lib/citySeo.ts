import type { Metadata } from "next";
import { getSeoCityBySlug } from "@/Data/seoCities";

const SITE_URL = "https://disconnect.agency";

export type CitySeoInput = {
  serviceSlug: string;
  serviceName: string;
  citySlug: string;
};

export const buildCitySeo = ({ serviceSlug, serviceName, citySlug }: CitySeoInput) => {
  const city = getSeoCityBySlug(citySlug);
  if (!city) return null;

  const canonical = `${SITE_URL}/${serviceSlug}/${city.slug}`;
  const serviceLower = serviceName.toLowerCase();
  const cityLower = city.name.toLowerCase();
  const title = `Best ${serviceName} Company in ${city.name} | Disconnect`;
  const description = `Disconnect is a trusted ${serviceLower} company in ${city.name}, building high-performance websites, apps, SaaS products, and AI solutions.`;

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      `${serviceLower} ${cityLower}`,
      `best ${serviceLower} company in ${cityLower}`,
      `${cityLower} software development agency`,
      `startup tech agency ${cityLower}`,
      `web development services ${cityLower}`,
      `app developers in ${cityLower}`,
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "Disconnect",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Disconnect",
      areaServed: `${city.name}, India`,
      url: SITE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${serviceName} in ${city.name}`,
      serviceType: serviceName,
      areaServed: `${city.name}, India`,
      provider: { "@type": "Organization", name: "Disconnect" },
      url: canonical,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Disconnect",
      areaServed: `${city.name}, India`,
      serviceType: serviceName,
      url: canonical,
    },
  ];

  return { city, canonical, metadata, schemas };
};
