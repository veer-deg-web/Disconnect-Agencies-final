// src/components/SEO/CityIntro.tsx
import React from 'react';
import { cityIntroTemplates } from "@/lib/cityIntroTemplates";
import './CityIntro.css';

type Props = {
  service: string;
  cityName: string;
  serviceShortName: string;
};

export function CityIntro({ service, cityName, serviceShortName }: Props) {
  const template = cityIntroTemplates[service];
  const paragraph = template ? template(cityName) : "";

  return (
    <section 
      aria-label={`${serviceShortName} in ${cityName}`}
      className="city-intro-section"
    >
      <h1 className="city-intro-title">
        Premier {serviceShortName} <br /> 
        in <span className="city-intro-highlight">{cityName}</span>
      </h1>
      <p className="city-intro-paragraph">
        {paragraph}
      </p>
    </section>
  );
}
