import "./globals.css";
import SmoothScroll from "./providers/SmoothScroll";
import DotBackground from "@/components/DotBackground/DotBackground";
import "@/components/DotBackground/DotBackground.css";
import HeroNavbar from "@/components/Home/HeroSection/HeroNavbar";

export const metadata = {
  title: "Disconnect Agencies",
  description: "Disconnect Agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        data-scroll-container
        style={{
          fontFamily: "'Inter', sans-serif",
          padding: 0,
          margin: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Background */}
        <DotBackground />

        {/* Smooth Scroll */}
        <SmoothScroll />

        {/* Navbar */}
        <HeroNavbar />
        {children}
      </body>
    </html>
  );
}
