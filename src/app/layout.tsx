import "./globals.css";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import DotBackground from "@/components/DotBackground/DotBackground";
import "@/components/DotBackground/DotBackground.css";
import HeroNavbar from "@/components/Home/HeroSection/HeroNavbar";
import StoreProvider from "@/store/StoreProvider";

/* ── Fonts (self-hosted via next/font — no render-blocking requests) ── */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

// ── Root Layout ──────────────────────────────────────────
// Description: [153 chars] ✅
export const metadata: Metadata = {
  metadataBase: new URL("https://disconnect.software"),
  title: {
    default: "Disconnect",
    template: "%s | Disconnect",
  },
  description:
    "Disconnect builds production-grade digital products — web, app, AI, cloud, SEO, and UI/UX — delivering proven results for modern businesses. Explore now.",
  keywords: [
    "Disconnect agencies",
    "digital product agency",
    "software development company",
    "AI solutions",
    "web development",
    "app development",
    "cloud infrastructure",
    "SEO services",
    "UI/UX design",
    "elite engineering",
  ],
  openGraph: {
    siteName: "Disconnect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body>
        <StoreProvider>
          <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999, fontFamily: 'inherit' } }} />
          {/* Background */}
          <DotBackground />

          {/* Navbar */}
          <HeroNavbar />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              backgroundColor: "var(--color-bg-deep)",
            }}
          >
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
