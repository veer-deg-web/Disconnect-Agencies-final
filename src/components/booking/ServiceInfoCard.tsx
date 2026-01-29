"use client";

import { serviceData, CategoryType } from "@/components/data/serviceData";
import "./ServiceInfoCard.css";

interface ServiceInfoCardProps {
  category: CategoryType;
}

export default function ServiceInfoCard({ category }: ServiceInfoCardProps) {
  const data = serviceData[category];

  return (
    <div className="service-card">
      <img
        src={data.image}
        className="service-card__image"
        alt={data.title}
      />

      <h2 className="service-card__title">{data.title}</h2>

      <div className="service-card__meta">
        <p>📂 Category – {data.title}</p>
        <p>⏱ Duration – {data.duration}</p>
        <p>💬 Meeting details will be emailed after confirmation</p>
        <p>💲 Starts from {data.price}</p>
      </div>

      <p className="service-card__note">
        Hey looking forward to getting on a call,
        would appreciate it if you can give me some pre-context
        before the event!
      </p>
    </div>
  );
}