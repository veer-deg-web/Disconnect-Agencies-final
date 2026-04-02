// src/app/[Service]/[city]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoCityBySlug, seoCities } from "@/lib/seoCities";
import Footer from "@/components/Shared/Footer/Footer";

// Service content components (reusable across routes)
import CloudContent from "@/components/Cloud/CloudContent";
import WebDevContent from "@/components/WebDevelopment/WebDevContent";
import AppDevContent from "@/components/AppDevelopment/AppDevContent";
import AiContent from "@/components/Ai/AiContent";
import SeoContent from "@/components/SEO/SeoContent";
import UiuxContent from "@/components/uiux/UiuxContent";

const SERVICE_CONTENT: Record<string, React.ComponentType> = {
  Cloud: CloudContent,
  WebDevelopment: WebDevContent,
  AppDevelopment: AppDevContent,
  AIModels: AiContent,
  SEO: SeoContent,
  Uiux: UiuxContent,
};

const serviceNames: Record<string, string> = {
  Cloud:          "Cloud Infrastructure Services",
  WebDevelopment: "Web Development Services",
  AppDevelopment: "App Development Services",
  AIModels:       "AI Automation Services",
  SEO:            "SEO Services",
  Uiux:           "UI/UX Design Services",
};

const serviceShort: Record<string, string> = {
  Cloud:          "Cloud Services",
  WebDevelopment: "Web Development",
  AppDevelopment: "App Development",
  AIModels:       "AI Automation",
  SEO:            "SEO Services",
  Uiux:           "UI/UX Design",
};

const serviceDesc: Record<string, string> = {
  Cloud:
    "scalable cloud infrastructure, CI/CD pipelines, cloud security, and managed services",
  WebDevelopment:
    "stunning, responsive websites and full-stack web applications built for performance",
  AppDevelopment:
    "high-quality iOS, Android, and cross-platform mobile apps from MVP to enterprise scale",
  AIModels:
    "custom AI systems, workflow automation, AI agents, and intelligent sales automation",
  SEO:
    "data-driven SEO including technical audits, on-page optimization, and keyword tracking",
  Uiux:
    "professional UI/UX design with wireframes, design systems, and full Figma handoff",
};

type Props = {
  params: Promise<{ Service: string; city: string }>;
};

export async function generateStaticParams() {
  const SERVICES = ["Cloud", "WebDevelopment", "AppDevelopment", "AIModels", "SEO", "Uiux"];
  return SERVICES.flatMap((Service) =>
    seoCities.map((city) => ({ Service, city: city.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { Service, city } = await params;
  const cityData       = getSeoCityBySlug(city);
  if (!cityData || !serviceNames[Service]) return { title: "Not Found | Disconnect" };

  const cityName       = cityData.name;
  const canonicalSlug  = cityData.slug;
  const canonical      = `https://disconnect.software/${Service}/${canonicalSlug}`;
  const shortName      = serviceShort[Service] ?? "Services";
  const fullName       = serviceNames[Service] ?? "Digital Services";
  const desc           = serviceDesc[Service]  ?? "professional digital services";
  const cityLower      = cityName.toLowerCase();

  return {
    title: `${shortName} in ${cityName} | Disconnect`,
    description:
      `Looking for ${fullName} in ${cityName}? Disconnect delivers ${desc} ` +
      `for businesses in ${cityName}. Proven results. Book a free call.`,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title: `${shortName} in ${cityName} | Disconnect`,
      description:
        `Top-rated ${fullName} for ${cityName} businesses. ` +
        `Disconnect builds scalable, results-driven digital products. Explore our work.`,
      url: canonical,
      siteName: "Disconnect",
      images: [
        {
          url: `/assets/og/${Service.toLowerCase()}.png`,
          width: 1200,
          height: 630,
          alt: `${shortName} in ${cityName} — Disconnect`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${shortName} in ${cityName} | Disconnect`,
      description:
        `Expert ${shortName} in ${cityName}. Book a free strategy call with Disconnect.`,
    },

    keywords: [
      `${shortName.toLowerCase()} in ${cityLower}`,
      `${shortName.toLowerCase()} ${cityLower}`,
      `${cityLower} ${Service.toLowerCase()} company`,
      `best ${shortName.toLowerCase()} ${cityLower}`,
      `${cityLower} digital agency`,
      `hire ${shortName.toLowerCase()} ${cityLower}`,
      `disconnect ${cityLower}`,
      `${fullName.toLowerCase()} ${cityLower}`,
      ...(cityData.aliases?.map((a) => `${shortName.toLowerCase()} ${a}`) ?? []),
    ],
  };
}

export default async function CityServicePage({ params }: Props) {
  const { Service, city } = await params;
  const cityData = getSeoCityBySlug(city);
  const ContentComponent = SERVICE_CONTENT[Service];

  if (!cityData || !ContentComponent) notFound();

  const cityName = cityData.name;
  const shortName = serviceShort[Service] ?? Service;
  const fullName = serviceNames[Service] ?? Service;
  const canonical = `https://disconnect.software/${Service}/${cityData.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": `${fullName} in ${cityName}`,
        "provider": {
          "@type": "Organization",
          "name": "Disconnect",
          "url": "https://disconnect.software",
          "logo": "https://disconnect.software/assets/logo.png",
          "telephone": "+91-8585858586",
          "email": "enquiry@disconnect.software",
        },
        "areaServed": {
          "@type": "City",
          "name": cityName,
          "addressCountry": "IN",
        },
        "serviceType": fullName,
        "url": canonical,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",       "item": "https://disconnect.software" },
          { "@type": "ListItem", "position": 2, "name": shortName,    "item": `https://disconnect.software/${Service}` },
          { "@type": "ListItem", "position": 3, "name": cityName,     "item": canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* SEO Title - Hidden from UI, remains for Search Engines */}
      <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
        {fullName} in {cityName}
      </h1>

      <ContentComponent />
      <Footer />
    </>
  );
}
