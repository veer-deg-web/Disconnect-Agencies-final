"use client";

import "./BuildPocket.css";
import TargetCursor from "@/Components/TargetCursor";
import ShinyText from '@/Components/ShinyText';

const features = [
  {
    title: "App Development",
    description:
      "We design and develop powerful mobile apps tailored to your goals.",
    active: true,
  },
  {
    title: "Clean & Scalable Code",
    description:
      "Your app is built for speed, performance, and future growth.",
  },
  {
    title: "Smart Support & Upgrades",
    description:
      "Get expert guidance, feature improvements, and regular updates.",
  },
];

const logos = Array.from({ length: 10 });


export default function BuildPocket() {
  return (
    <div>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
  hoverDuration={0.2}
/>
    <section className="build-pocket">
       
      <div className="build-pocket__top">
        <div style={{display:"flex",flexDirection:"column"}} className="build">
            

<ShinyText
  text="Everything you needs, "
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#ffffff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/>
<ShinyText
  text="Right in your pocket"
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#ffffff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/>
        </div>

        <div className="features">
          {features.map((item, index) => (
            <div
              key={index}
              className={`feature-card cursor-target${
                item.active ? "active" : ""
              }`}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="partners">
        <p className="partners__title">
          Partners of 20+ banks globally
        </p>

        <div className="partners__grid ">
          {logos.map((_, index) => (
            <div key={index} className="logo-box cursor-target">
              {/* logo goes here */}
            </div>
          ))}
        </div>

        <p className="partners__note">
          Reach out if your bank can’t be found
        </p>
      </div>
    </section>
    </div>
  );
}
