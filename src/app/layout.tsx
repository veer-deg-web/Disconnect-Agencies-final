import "./globals.css";
import type { Metadata } from "next";
import SmoothScroll from "./providers/SmoothScroll";
import { Toaster } from "react-hot-toast";
import DotBackground from "@/components/DotBackground/DotBackground";
import "@/components/DotBackground/DotBackground.css";
import HeroNavbar from "@/components/Home/HeroSection/HeroNavbar";
import StoreProvider from "@/store/StoreProvider";

export const metadata: Metadata = {
  title: {
    default: "Disconnect",
    template: "%s | Disconnect",
  },
  description: "Disconnect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Inter', sans-serif",
          padding: 0,
          margin: 0,
        }}
      >
        <StoreProvider>
          <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999, fontFamily: 'inherit' } }} />
          {/* Background */}
          <DotBackground />

          {/* Smooth Scroll */}
          <SmoothScroll />

          {/* Navbar */}
          <HeroNavbar />

          {/* Locomotive Container */}
          <div
            data-scroll-container
            style={{
              position: "relative",
              zIndex: 1,
              backgroundColor: "#000000",
            }}
          >
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
