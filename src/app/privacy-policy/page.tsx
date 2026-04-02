import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/legal.module.css";

// ── /privacy-policy ──────────────────────────────────────
// Title (raw):      "Privacy Policy — How We Handle Your Data" [40 chars]
// Title (rendered): 53 chars ✅ | Description: [148 chars] ✅
export const metadata: Metadata = {
  title: "Privacy Policy — How We Handle Your Data",
  description:
    "Learn how Disconnect collects, uses, and protects your personal data across AI, web, app, SEO, and cloud services with full transparency. Explore now.",
  robots: { index: true, follow: false },
  keywords: ["privacy policy", "data protection", "personal data", "Disconnect", "digital agency privacy"],
  openGraph: {
    title: "Privacy Policy — How We Handle Your Data",
    description:
      "How Disconnect collects, uses, and protects your personal data with full transparency.",
    url: "/privacy-policy",
    siteName: "Disconnect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — How We Handle Your Data",
    description:
      "How Disconnect collects, uses, and protects your personal data with full transparency.",
  },
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>Legal</div>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>
          At Disconnect, we take the protection of your personal data seriously. Here&apos;s how we handle your information with full transparency and care.
        </p>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.text}>
            Disconnect handles digital solutions across AI Models & Automation, App Development, Web Development, SEO, UI/UX Design, and Cloud Services. While we do that, we also take the protection of your personal data seriously. This disclaimer explains how we handle your information with transparency.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Collection and Usage</h2>
          <p className={styles.text}>
            When you use our website or services, we collect certain information to make things work. If you&apos;re just browsing, we might see technical details like your IP address, browser type, and how you&apos;re interacting with the site. We use this to keep the platform secure and improve how it performs.
          </p>
          <p className={styles.text}>
            If you reach out to us — through a form, an email, or by signing up for a service — we&apos;ll collect the details you provide: name, contact info, and whatever professional details are needed to get the job done. This helps us communicate with you and deliver the services you signed up for.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Marketing and Cookies</h2>
          <p className={styles.text}>
            We might use your contact info to keep you updated on what&apos;s happening at Disconnect. If you don&apos;t want those updates, you can opt out at any time. We also use cookies to help the website function better and understand traffic. You can manage these through your browser settings.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Links</h2>
          <p className={styles.text}>
            Our site might link to other platforms. We don&apos;t control those, so their privacy practices are their own. Check them out if you&apos;re concerned about how they handle data.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Security</h2>
          <p className={styles.text}>
            We don&apos;t sell your data. We only share it with trusted partners when it&apos;s necessary for our operations. We use standard security measures to protect your information, but remember that no system is 100% bulletproof.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>International Data Transfers</h2>
          <p className={styles.text}>
            We operate globally, which means data sometimes crosses regional borders — for cloud operations, international project work, and so on. When it does, we make sure the appropriate protections are in place.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Rights and Contact Information</h2>
          <p className={styles.text}>
            You can ask to access, update, or delete your personal data at any time, subject to applicable law. If you want to do any of that &mdash; or if something in this disclaimer doesn&apos;t sit right with you &mdash; reach out through our website or official channels. We&apos;ll sort it out.
          </p>
          <p className={styles.text}>
            Using Disconnect&apos;s services means you&apos;ve read this and you&apos;re okay with how we handle things. We&apos;ll keep being straight with you about it.
          </p>
        </section>

        <p className={styles.updatedDate}>Last updated: March 2025 · Disconnect Agencies</p>
      </div>
    </main>
  );
}
