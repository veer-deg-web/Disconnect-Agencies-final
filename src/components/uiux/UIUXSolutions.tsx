"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { IconType } from "react-icons";
import {
  SiFigma,
  SiFramer,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiNotion,
  SiJira,
  SiSlack,
  SiWebflow,
  SiGoogleanalytics,
  SiBehance,
} from "react-icons/si";

/* ---------------- DATA ---------------- */

type SolutionItem = {
  icon: IconType;
  title: string;
  subtitle: string;
};

const TOP_ROW: SolutionItem[] = [
  { icon: SiFigma, title: "Figma", subtitle: "Interface Design" },
  { icon: SiFramer, title: "Framer", subtitle: "Interactive Prototypes" },
  { icon: SiAdobephotoshop, title: "Photoshop", subtitle: "Visual Editing" },
  { icon: SiAdobeillustrator, title: "Illustrator", subtitle: "Brand Assets" },
  { icon: SiWebflow, title: "Webflow", subtitle: "No-code Build" },
];

const BOTTOM_ROW: SolutionItem[] = [
  { icon: SiNotion, title: "Notion", subtitle: "Design Docs" },
  { icon: SiJira, title: "Jira", subtitle: "Sprint Workflow" },
  { icon: SiSlack, title: "Slack", subtitle: "Team Collaboration" },
  { icon: SiGoogleanalytics, title: "Analytics", subtitle: "UX Insights" },
  { icon: SiBehance, title: "Behance", subtitle: "Portfolio System" },
];

/* ---------------- COMPONENT ---------------- */

import styles from "./UIUXSolutions.module.css";

/* ---------------- COMPONENT ---------------- */

export default function UIUXSolutions() {
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { margin: "-120px" });

  return (
    <section ref={ref} className={styles.solutionsSection}>
      <div className={styles.container}>
        {/* PILL */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={styles.pill}
        >
          <span className={styles.dot} />
          Solution
        </motion.div>

        {/* HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className={styles.heading}
        >
          All your{" "}
          <span className={styles.designText}>
            design
          </span>{" "}
          needs.
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className={styles.sub}
        >
          Running a successful business means more than just a website.
          We cover all your design needs so you never have to go elsewhere.
        </motion.p>

        {/* MARQUEE */}
        <div className={styles.marqueeWrapper}>
          <SeamlessMarquee items={TOP_ROW} direction="right" />
          <SeamlessMarquee items={BOTTOM_ROW} direction="left" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- SEAMLESS MARQUEE ---------------- */

function SeamlessMarquee({
  items,
  direction,
}: {
  items: SolutionItem[];
  direction: "left" | "right";
}) {
  return (
    <div className={styles.marqueeContainer}>
      <motion.div
        className={styles.marqueeTrack}
        animate={{
          x: direction === "right" ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: 22,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={styles.chip}>
              <div className={styles.marqueeRow}>
                <div className={styles.iconBox}>
                  <Icon size={18} />
                </div>
                <div className={styles.textInfo}>
                  <div className={styles.title}>
                    {item.title}
                  </div>
                  <div className={styles.subtitle}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
