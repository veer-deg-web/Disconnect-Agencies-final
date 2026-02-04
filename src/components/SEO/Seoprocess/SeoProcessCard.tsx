"use client";

type SEOProcessCardProps = {
  step: string;
  title: string;
  description: string;
};

export default function SEOProcessCard({
  step,
  title,
  description,
}: SEOProcessCardProps) {
  return (
    <div className="seo-step-card">
      <span className="seo-step-card__step">{step}</span>
      <h3 className="seo-step-card__title">{title}</h3>
      <p className="seo-step-card__desc">{description}</p>
    </div>
  );
}