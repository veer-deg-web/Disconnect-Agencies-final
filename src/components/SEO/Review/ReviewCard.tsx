"use client";

import { JSX, useRef } from "react";
import {
  SiCodesandbox,
  SiAdobe,
  SiGoogle,
} from "react-icons/si";

type ReviewCardProps = {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: string;
  quote: string;
};

const companyIcons: Record<string, JSX.Element> = {
  "Code Solutions": <SiCodesandbox />,
  "Abstract Studio": <SiAdobe />,
  "Creative Studios": <SiAdobe />,
  "ABC Solutions": <SiGoogle />,
};

export default function ReviewCard({
  name,
  role,
  company,
  avatar,
  rating,
  quote,
}: ReviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * 14;
    const rotateY = ((x / rect.width) - 0.5) * -14;

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale(1.02)
    `;
  };

  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      className="seo-review"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {/* TOP */}
      <div className="seo-review__top">
        <img src={avatar} alt={name} className="seo-review__avatar" />
        <div className="seo-review__person">
          <span className="seo-review__name">{name}</span>
          <span className="seo-review__role">{role}</span>
        </div>
      </div>

      {/* QUOTE */}
      <p className="seo-review__quote">{quote}</p>

      {/* BOTTOM */}
      <div className="seo-review__bottom">
        <div className="seo-review__company">
          <span className="seo-review__icon">
            {companyIcons[company] ?? <SiCodesandbox />}
          </span>
          <span>{company}</span>
        </div>

        <div className="seo-review__rating">
          <span className="seo-review__score">{rating}</span>
          <span className="seo-review__label">Job Satisfaction</span>
        </div>
      </div>
    </div>
  );
}