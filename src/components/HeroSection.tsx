import HeroNavbar from "./HeroNavbar";
import HeroContent from "./HeroContent";
import "./hero.css";

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden', // desktop unchanged
        backgroundImage: "url('/her0-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* NAVBAR */}
      <div style={{ position: 'relative', zIndex: 30 }}>
        <HeroNavbar />
      </div>

      {/* CONTENT */}
      <div
        className="hero-content-container"
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
        }}
      >
        <div
          className="hero-inner"
          style={{
            margin: '0 auto',
            width: '100%',
            maxWidth: '1320px',
            padding: '0 3rem', // desktop unchanged
          }}
        >
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
