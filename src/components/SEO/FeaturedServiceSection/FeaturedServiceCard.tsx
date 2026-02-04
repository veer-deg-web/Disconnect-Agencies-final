"use client";

import styles from "./FeaturedServices.module.css";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  role: string;
  type: string;
  date: string;
  featured?: boolean;
};

export default function FeaturedServiceCard({
  icon: Icon,
  title,
  role,
  type,
  date,
  featured,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.icon}>
          <Icon size={18} />
        </div>

        <span className={styles.cardTitle}>{title}</span>

        {featured && <span className={styles.badge}>FEATURED</span>}
      </div>

      <div className={styles.divider} />

      <p className={styles.role}>{role}</p>
      <p className={styles.type}>{type}</p>

      <button className={styles.button}>View details</button>

      <p className={styles.date}>Posted on {date}</p>
    </div>
  );
}