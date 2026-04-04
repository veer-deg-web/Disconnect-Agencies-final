"use client";

import "./ProductVisuals.css";
import SpotlightCard from "@/components/Shared/SpotlightCard/SpotlightCard";

import {
  MdAppSettingsAlt,
  MdOutlineBuildCircle,
  MdOutlineSecurityUpdateGood
} from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";

export default function ProductVisuals() {
  return (
    <>
      {/* ================= PRODUCT VISUALS ================= */}
      <section className="product-visuals">
        {/* TEXT */}
        <div className="product-visuals__content">
          <h2>
            Mobile Apps Built to Perform
          </h2>

          <p>
            We Design And Develop High-Quality Android, iOS, And Cross-Platform Apps That Scale With Your Business.
          </p>
        </div>

        {/* VISUAL */}
        
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
      <MdAppSettingsAlt className="icon" />
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
      <MdOutlineBuildCircle className="icon" />
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
      <MdOutlineSecurityUpdateGood className="icon" />
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
      <FaRegLightbulb className="icon" />
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
