import { seoCities } from "./src/lib/seoCities.js";

const SERVICES = ["Cloud", "WebDevelopment", "AppDevelopment", "AIModels", "SEO", "Uiux"];

const aliasRedirects = SERVICES.flatMap((service) =>
  seoCities.flatMap((city) =>
    (city.aliases ?? []).map((alias) => ({
      source: `/${service}/${alias}`,
      destination: `/${service}/${city.slug}`,
      permanent: true,
    }))
  )
);

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
    return [
      // ── Alias City Redirects ─────────────────────────────────────────────
      ...aliasRedirects,
    ];
  },

  async headers() {
    const isVercelPreview =
      process.env.VERCEL_ENV === "preview" ||
      process.env.VERCEL_URL?.includes("vercel.app");

    return [
      // ── Default Headers ──────────────────────────────────────────────────
      {
        source: "/(.*)",
        headers: [
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

      // ── Block staging/preview from being indexed ──────────────────────────
      ...(isVercelPreview
        ? [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Robots-Tag", value: "noindex, nofollow" },
              ],
            },
          ]
        : []),

      // ── Production: city pages explicitly indexable ───────────────────────
      ...(!isVercelPreview
        ? [
            {
              source: "/:Service(Cloud|WebDevelopment|AppDevelopment|AIModels|SEO|Uiux)/:city",
              headers: [
                { key: "X-Robots-Tag", value: "index, follow, max-image-preview:large" },
              ],
            },
          ]
        : []),

      // ── book-call pages always noindex ────────────────────────────────────
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
