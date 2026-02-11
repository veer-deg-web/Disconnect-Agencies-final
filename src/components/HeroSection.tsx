import HeroNavbar from "./HeroNavbar";
import HeroContent from "./HeroContent";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* NAVBAR */}
      <div className="hero-navbar">
        <HeroNavbar />
      </div>

      {/* CONTENT */}
      <div className="hero-content-container">
        <div className="hero-inner">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}