import "./globals.css";
import SmoothScroll from "./providers/SmoothScroll";
import DotBackground from "@/components/DotBackground/DotBackground";
import "@/components/DotBackground/DotBackground.css";
import HeroNavbar from "@/components/HeroNavbar";
import Footer from "@/components/Footer";

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
        style={{
          fontFamily: "'Inter', sans-serif",
          padding: 0,
          margin: 0,
        }}
      >
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
          }}
        >
          {children}
          {/* Footer inside locomotive container to ensure it scrolls properly */}
          <Footer />
        </div>
      </body>
    </html>
  );
}