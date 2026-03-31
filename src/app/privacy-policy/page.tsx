import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Disconnect Agencies",
  description: "Learn how Disconnect Agencies collects, uses, and protects your personal data across our AI, Web, App, SEO, and Cloud services.",
  keywords: ["privacy policy", "data protection", "personal data", "Disconnect Agencies", "digital agency privacy"],
  openGraph: {
    title: "Privacy Policy | Disconnect Agencies",
    description: "Learn how Disconnect Agencies collects, uses, and protects your personal data.",
    url: "https://disconnect-agencies-final.vercel.app/privacy-policy",
    siteName: "Disconnect Agencies",
    type: "website",
  },
  alternates: {
    canonical: "https://disconnect-agencies-final.vercel.app/privacy-policy",
  },
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
            While delivering high-quality digital solutions — including AI Models &amp; Automation, App Development, Web Development, SEO, UI/UX Design, and Cloud Services — we&apos;re equally committed to handling your information with full transparency and care. This Privacy Policy explains how we collect, use, and protect your data.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use Your Personal Data</h2>
          <p className={styles.text}>
            Disconnect may collect and process personal data to ensure you can access our website, platforms, and services without interruption. When you simply browse our website, you don&apos;t need to identify yourself. However, certain technical details may be collected automatically — such as your IP address, device type, browser details, operating system, and language preferences. This data is aggregated to help us understand traffic patterns, improve performance, enhance user experience, and keep the website secure.
          </p>
          <p className={styles.text}>
            If you register for a service, request a consultation, or access a restricted area, we may collect additional details like your name, email address, company information, and login credentials. This helps us personalise your experience, manage your account, and respond effectively to your needs.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Communication, Support & Service Delivery</h2>
          <p className={styles.text}>
            When you reach out to Disconnect with an inquiry, support request, or service-related discussion, we may process personal and professional information such as your contact details, business role, and the content of your communication. This allows us to provide accurate solutions, deliver technical assistance, and maintain consistently high standards across everything we do — from AI automation to cloud integration.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Marketing and Business Engagement</h2>
          <p className={styles.text}>
            Disconnect may use your data to keep you informed about our services, latest developments, and relevant industry insights. These communications are sent through email or other professional channels, always in line with applicable laws and your stated preferences. You can opt out of marketing communications at any time — no questions asked.
          </p>
          <p className={styles.text}>
            We may also look at engagement patterns to better understand what our clients need, refine our offerings, and deliver more relevant solutions in areas like SEO, UI/UX, and cloud services.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookies and Third-Party Data</h2>
          <p className={styles.text}>
            Our website uses cookies and similar technologies to improve functionality, analyse usage, and personalise your experience. We may also receive limited data from trusted third parties — such as analytics providers or business partners — to help us improve service delivery and performance.
          </p>
          <p className={styles.text}>
            Please note that our website may include links to third-party platforms. Disconnect isn&apos;t responsible for the privacy practices of those external sites, and we encourage you to review their individual policies before engaging with them.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Sharing and Security</h2>
          <p className={styles.text}>
            We do not sell your personal data. Ever. We may share your information with trusted service providers or partners strictly for business operations — and only to the extent necessary. We apply appropriate technical and organisational measures to keep your information safe and protected against unauthorised access, loss, or misuse.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Rights</h2>
          <p className={styles.text}>
            You have the right to access, correct, or request deletion of your personal data at any time. If you have questions about how your data is handled or wish to exercise any of your rights, please reach out to us through our official website or contact channels.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
          <p className={styles.text}>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date. We encourage you to review this page periodically to stay informed about how we protect your information.
          </p>
        </section>

        <p className={styles.updatedDate}>Last updated: March 2025 · Disconnect Agencies</p>
      </div>
    </main>
  );
}
