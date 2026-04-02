import { seoCities } from "./src/lib/seoCities.js";

const SERVICES = ["Cloud", "WebDevelopment", "AppDevelopment", "AIModels", "SEO", "Uiux"];

// ── Alias Redirects (e.g. /Cloud/bangalore → /Cloud/bengaluru) ──────────────
const aliasRedirects = SERVICES.flatMap((service) =>
  seoCities.flatMap((city) =>
    (city.aliases ?? []).map((alias) => ({
      source: `/${service}/${alias}`,
      destination: `/${service}/${city.slug}`,
      permanent: true,
    }))
  )
);

// ── Lowercase Redirects (e.g. /cloud → /Cloud) ─────────────────────────────
const lowercaseRedirects = SERVICES.filter((s) => s !== s.toLowerCase()).map(
  (service) => ({
    source: `/${service.toLowerCase()}`,
    destination: `/${service}`,
    permanent: true,
  })
);

// ── Environment Detection ───────────────────────────────────────────────────
const isStaging =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_URL?.includes("vercel.app");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "xbsoftware.com" },
      { protocol: "https", hostname: "**.xbsoftware.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async redirects() {
    return [...aliasRedirects, ...lowercaseRedirects];
  },

  async headers() {
    return [
      // ── Catch-All: security headers + environment-aware robots ────────
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: isStaging ? "noindex, nofollow" : "index, follow",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },

      // ── City Pages: explicitly indexable with rich snippets ───────────
      {
        source:
          "/:Service(Cloud|WebDevelopment|AppDevelopment|AIModels|SEO|Uiux)/:city",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large",
          },
        ],
      },

      // ── book-call: always noindex ─────────────────────────────────────
      {
        source: "/book-call(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
