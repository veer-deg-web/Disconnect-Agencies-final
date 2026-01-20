import HeroNavbar from "./HeroNavbar";
import HeroContent from "./HeroContent";

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
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
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            width: '100%',
            maxWidth: '1320px',
            padding: '0 3rem',
          }}
        >
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
