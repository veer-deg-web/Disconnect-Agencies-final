"use client";

import "./ProductVisuals.css";
import TiltedCard from "@/components/TiltedCard";
import SpotlightCard from "@/components/SpotlightCard";

import {
  SiAppstore,
  SiReact,
  SiTestinglibrary,
  SiLightning,
} from "react-icons/si";

export default function ProductVisuals() {
  return (
    <>
      {/* ================= PRODUCT VISUALS ================= */}
      <section className="product-visuals">
        {/* TEXT */}
        <div className="product-visuals__content">
          <h2>
            Disconnect Agency builds high-quality mobile apps with modern design,
            speed, and powerful performance for businesses.
          </h2>

          <p>
            We create Android, iOS, and cross-platform apps for growth.
          </p>
        </div>

        {/* VISUAL */}
        <div className="visual-wrapper">
          <img
            src="/frame.png"
            alt="App preview"
            className="phone"
          />

          <div className="card-left">
            <TiltedCard
              imageSrc="/tilted-card1.png"
              altText="Goals widget"
              containerHeight="500px"
              containerWidth="400px"
              imageHeight="500px"
              imageWidth="400px"
              rotateAmplitude={10}
              scaleOnHover={1.04}
              showMobileWarning={false}
            />
          </div>

          <div className="card-right">
            <TiltedCard
              imageSrc="/tilted-card2.png"
              altText="AI assistant widget"
              containerHeight="200px"
              containerWidth="260px"
              imageHeight="200px"
              imageWidth="260px"
              rotateAmplitude={10}
              scaleOnHover={1.04}
              showMobileWarning={false}
            />
          </div>

          <div className="card-bottom">
            <TiltedCard
              imageSrc="/tilted-card3.png"
              altText="Traffic analytics widget"
              containerHeight="200px"
              containerWidth="414px"
              imageHeight="200px"
              imageWidth="414px"
              rotateAmplitude={8}
              scaleOnHover={1.04}
              showMobileWarning={false}
            />
          </div>
        </div>
      </section>

      {/* ================= WE HELP ================= */}
      {/* ================= WE HELP ================= */}
<section className="we-help">
  <h2 className="we-help__title">We help you...</h2>

  <div className="we-help__grid">

    <SpotlightCard
      className="we-card"
      spotlightColor="rgba(88,105,227,0.25)"
    >
      <SiAppstore className="icon" />
      <h3>All your app needs, in one place</h3>
      <p>
        Plan, design, develop, and launch your product smoothly with our
        end-to-end app services.
      </p>
    </SpotlightCard>

    <SpotlightCard
      className="we-card"
      spotlightColor="rgba(88,105,227,0.25)"
    >
      <SiReact className="icon" />
      <h3>Build smarter, faster apps</h3>
      <p>
        From UI to backend, we create scalable apps with clean code and
        smooth performance.
      </p>
    </SpotlightCard>

    <SpotlightCard
      className="we-card"
      spotlightColor="rgba(88,105,227,0.25)"
    >
      <SiTestinglibrary className="icon" />
      <h3>Stay ahead with quality delivery</h3>
      <p>
        We follow a clear process, timely updates, and testing—so your app
        launches without stress.
      </p>
    </SpotlightCard>

    <SpotlightCard
      className="we-card"
      spotlightColor="rgba(88,105,227,0.25)"
    >
      <SiLightning className="icon" />
      <h3>Get expert ideas to grow</h3>
      <p>
        Disconnect Agency helps you improve features, UX, and performance
        for long-term success.
      </p>
    </SpotlightCard>

  </div>
</section>
    </>
  );
}