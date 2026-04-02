"use client";

import { motion } from "framer-motion";

import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import type { ServicePricingPage } from "@/Data/pricingPages";
import styles from "./PricingDetailPage.module.css";

/* ── Reusable animated wrapper ── */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  page: ServicePricingPage;
}

export default function PricingDetailPage({ page }: Props) {
  const vars = {
    "--accent": page.accent,
    "--accent-glow": `${page.accent}40`,
  } as React.CSSProperties;

  return (
    <div className={styles.page} style={vars}>
      {/* ══════════════════ HERO ══════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <FadeUp delay={0}>
            <span className={styles.heroPill}>Pricing</span>
          </FadeUp>

          <FadeUp delay={0.05}>
            <h1 className={styles.heroTitle}>{page.title}</h1>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className={styles.heroSubtitle}>{page.subtitle}</p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className={styles.heroTagline}>
              &ldquo;{page.tagline}&rdquo;
            </p>
          </FadeUp>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ══════════════════ INTRO ══════════════════ */}
      <div className={styles.sectionNarrow}>
        <FadeUp delay={0}>
          <span className={styles.label}>About this service</span>
        </FadeUp>
        <FadeUp delay={0.07}>
          <p className={styles.introText}>{page.intro}</p>
        </FadeUp>
      </div>

      <hr className={styles.divider} />

      {/* ══════════════════ PLANS ══════════════════ */}
      <section className={styles.plansSection}>
        <div className={styles.plansInner}>
          <FadeUp delay={0}>
            <span className={styles.label}>Plans</span>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h2 className={styles.plansHeading}>Choose your scope</h2>
          </FadeUp>

          <div className={styles.plansGrid}>
            {page.plans.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.1}>
                <div
                  className={`${styles.card} ${plan.highlight ? styles.cardHighlight : ""}`}
                >
                  {plan.highlight && (
                    <span className={styles.cardBadge}>Best Value</span>
                  )}

                  <p className={styles.cardName}>{plan.name}</p>
                  <p className={styles.cardPrice}>{plan.price}</p>
                  <p className={styles.cardBestFor}>
                    Best for: {plan.bestFor}
                  </p>

                  <ul className={styles.cardFeatures}>
                    {plan.features.map((f) => (
                      <li key={f}>
                        <span className={styles.checkIcon}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className={styles.cardOutcome}>{plan.outcome}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ══════════════════ PROCESS ══════════════════ */}
      <section className={styles.processSection}>
        <div className={styles.processInner}>
          <FadeUp delay={0}>
            <span className={styles.label}>Process</span>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h2 className={styles.processHeading}>How we work</h2>
          </FadeUp>

          <div className={styles.processList}>
            {page.process.map((step, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className={styles.processStep}>
                  <div className={styles.processNum}>{i + 1}</div>
                  <p className={styles.processText}>{step}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ══════════════════ MAINTENANCE ══════════════════ */}
      <section className={styles.maintenanceSection}>
        <div className={styles.maintenanceInner}>
          <FadeUp delay={0}>
            <span className={styles.label}>Maintenance</span>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h2 className={styles.maintenanceHeading}>
              We don&apos;t disappear after delivery.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className={styles.maintenanceMeta}>
              <strong>{page.maintenance.includedMonths}</strong> included with
              every project.{" "}
              <strong>{page.maintenance.yearlyRate}</strong> ongoing.
            </p>
          </FadeUp>


          <div className={styles.maintenanceGrid}>
            <FadeUp delay={0.12}>
              <div className={styles.maintenanceCard}>
                <p className={styles.maintenanceCardTitle}>
                  ✓ What&apos;s included
                </p>
                <ul className={styles.maintenanceList}>
                  {page.maintenance.included.map((item) => (
                    <li key={item}>
                      <span className={styles.inclIcon}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className={styles.maintenanceCard}>
                <p className={styles.maintenanceCardTitle}>✕ Not included</p>
                <ul className={styles.maintenanceList}>
                  {page.maintenance.notIncluded.map((item) => (
                    <li key={item}>
                      <span className={styles.exclIcon}>✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ══════════════════ TRANSPARENCY ══════════════════ */}
      <section className={styles.transparencySection}>
        <FadeUp delay={0}>
          <div className={styles.transparencyInner}>
            <span className={styles.transparencyIcon}>🔍</span>
            <p className={styles.transparencyText}>{page.transparency}</p>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaInner}>
          <FadeUp delay={0}>
            <h2 className={styles.ctaHeading}>{page.cta.heading}</h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className={styles.ctaSub}>{page.cta.sub}</p>
          </FadeUp>
          <FadeUp delay={0.14}>
            <BookCallButton circleColor={page.accent} />
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className={styles.ctaNote}>
              No commitment required. We&apos;ll discuss your goals first.
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
