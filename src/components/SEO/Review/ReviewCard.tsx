"use client";
import { JSX } from "react";
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
  return (
    <div className="seo-review">
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

        {/* RATING */}
        <div className="seo-review__rating">
          <span className="seo-review__score">{rating}</span>
          <span className="seo-review__label">Job Satisfaction</span>
        </div>
      </div>
    </div>
  );
}