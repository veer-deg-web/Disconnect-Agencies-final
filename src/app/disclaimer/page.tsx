import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/legal.module.css";

// ── /disclaimer ──────────────────────────────────────────
// Title (raw):      "Disclaimer — Legal Notice & Site Terms" [38 chars]
// Title (rendered): 51 chars ✅ | Description: [156 chars] ✅
export const metadata: Metadata = {
  title: "Disclaimer — Legal Notice & Site Terms",
  description:
    "Read the official disclaimer for Disconnect covering site access, intellectual property, liability limitations, and legal terms for all digital services. Explore now.",
  robots: { index: true, follow: false },
  keywords: ["disclaimer", "Disconnect", "digital agency disclaimer", "terms of access", "legal notice"],
  openGraph: {
    title: "Disclaimer — Legal Notice & Site Terms",
    description:
      "Official disclaimer for Disconnect — site access, IP, liability, and legal terms.",
    url: "/disclaimer",
    siteName: "Disconnect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer — Legal Notice & Site Terms",
    description:
      "Official disclaimer for Disconnect — site access, IP, liability, and legal terms.",
  },
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>Legal</div>
        <h1 className={styles.title}>Disclaimer</h1>
        <p className={styles.subtitle}>
          This website and all its content is owned and operated by Disconnect &mdash; a digital agency offering services in AI, Web &amp; App Development, SEO, UI/UX Design, and Cloud Solutions.
        </p>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>General Information</h2>
          <p className={styles.text}>
            The Site is not meant to be accessed, distributed, or used by anyone in jurisdictions where doing so would be against local laws or regulations, or would create additional compliance obligations for Disconnect or its affiliates. It&apos;s your responsibility to make sure that your access to and use of this Site is legally permitted in your location.
          </p>
          <p className={styles.text}>
            The content on this Site may be updated, revised, or taken down at any time without prior notice. All materials should be treated as accurate only as of when they were originally published. While we do our best to keep things reliable, the Site may contain errors, omissions, or outdated information. Any case studies, project outcomes, or performance results shared here are purely for informational purposes and shouldn&apos;t be taken as promises of future results.
          </p>
          <p className={styles.text}>
            The information on this Site also doesn&apos;t constitute professional advice. We encourage you to speak with qualified experts before making any business, legal, or financial decisions.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>By Using This Site, You Confirm</h2>
          <ul className={styles.list}>
            <li>Accessing this Site and its content is legally permitted in your jurisdiction.</li>
            <li>The information here doesn&apos;t constitute an offer, solicitation, or recommendation for any securities, investments, or financial products.</li>
            <li>Nothing on this Site should be read as an advertisement or public offering of any financial instruments.</li>
            <li>No regulatory authority has reviewed or approved the content on this Site.</li>
            <li>You won&apos;t copy, share, or distribute the Site&apos;s content in any form without prior authorisation.</li>
          </ul>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Prohibited Activities</h2>
          <p className={styles.text}>You agree not to:</p>
          <ul className={styles.list}>
            <li>Interrupt or attempt to disrupt the Site&apos;s normal functioning in any way.</li>
            <li>Gain or attempt to gain unauthorised access to any part of the Site.</li>
            <li>Post or transmit any unlawful, harmful, defamatory, or offensive content.</li>
            <li>Alter, obscure, or remove any notices or information displayed on the Site.</li>
            <li>Use the Site or its content to harass, defame, or violate the rights of any individual or organisation.</li>
          </ul>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Permitted Use of Materials</h2>
          <p className={styles.text}>
            Disconnect allows users to view and download materials from the Site strictly for personal, non-commercial use. This permission doesn&apos;t transfer any ownership rights and comes with the following conditions:
          </p>
          <ul className={styles.list}>
            <li>All copyright, trademark, and proprietary notices must be kept intact on downloaded materials.</li>
            <li>Materials must not be modified, reproduced, publicly displayed, or used for commercial purposes.</li>
            <li>Materials must not be passed on to others unless they agree to abide by these same terms.</li>
          </ul>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intellectual Property</h2>
          <p className={styles.text}>
            All content on this Site is protected under applicable copyright and intellectual property laws. You agree to respect these laws and not allow any unauthorised use or duplication of materials. Unless explicitly stated &mdash; Disconnect does not grant any rights under patents, trademarks, copyrights, or trade secrets.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>
            In no event shall Disconnect or its affiliates be liable for any direct, indirect, incidental, consequential, or punitive damages &mdash; including loss of data, revenue, or business opportunities &mdash; arising from your use of or inability to use this Site or its services, even if we were made aware of the possibility of such damages.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.text}>
            These terms are governed by the laws of the Republic of India. Any disputes arising from the use of this Site will fall under the exclusive jurisdiction of the competent courts &mdash; By continuing to use this Site, you confirm that you&apos;ve read, understood, and voluntarily agreed to these terms.
          </p>
        </section>

        <p className={styles.updatedDate}>Last updated: March 2025 · Disconnect Agencies</p>
      </div>
    </main>
  );
}
