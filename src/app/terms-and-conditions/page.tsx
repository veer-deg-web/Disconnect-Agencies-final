import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | Disconnect Agencies",
  description: "Read the Terms & Conditions for using Disconnect Agencies' website and services — covering intellectual property, payments, data protection, and more.",
  keywords: ["terms and conditions", "terms of service", "Disconnect Agencies", "digital agency terms", "service agreement"],
  openGraph: {
    title: "Terms & Conditions | Disconnect Agencies",
    description: "Read the Terms & Conditions for using Disconnect Agencies' website and services.",
    url: "https://disconnect-agencies-final.vercel.app/terms-and-conditions",
    siteName: "Disconnect Agencies",
    type: "website",
  },
  alternates: {
    canonical: "https://disconnect-agencies-final.vercel.app/terms-and-conditions",
  },
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>Legal</div>
        <h1 className={styles.title}>Terms &amp; Conditions</h1>
        <p className={styles.subtitle}>
          By using Disconnect&apos;s website or services, you confirm that you&apos;ve read, understood, and agreed to be bound by these Terms.
        </p>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Services Offered</h2>
          <p className={styles.text}>
            Disconnect provides professional digital solutions tailored to your business needs — from software development and automation to cloud-based services and optimisation. All services are delivered based on the agreed project scope, timelines, and contractual terms between Disconnect and the client.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Responsibilities</h2>
          <p className={styles.text}>
            You agree to use our website and services only for lawful purposes. Please don&apos;t misuse our platform, attempt unauthorised access, introduce malicious code, or engage in anything that could harm Disconnect, its clients, or its infrastructure. Any information you provide should be accurate, complete, and kept up to date.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intellectual Property Rights</h2>
          <p className={styles.text}>
            All content, designs, code, branding, and materials developed by Disconnect remain our intellectual property unless agreed otherwise in writing. Once full payment is received, clients may receive usage rights as outlined in the project agreement. Unauthorised reproduction, distribution, or modification of our work is strictly prohibited.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Payments and Pricing</h2>
          <p className={styles.text}>
            All services are priced as agreed in proposals or contracts. Payments are expected within the specified timelines. Disconnect reserves the right to pause or terminate services in cases of delayed or non-payment. Unless stated otherwise, fees that have already been paid are non-refundable.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Delivery and Revisions</h2>
          <p className={styles.text}>
            We make every reasonable effort to deliver projects within agreed timelines. That said, delays caused by client-side dependencies, third-party services, or unforeseen circumstances may affect delivery schedules. Revisions are limited to what&apos;s defined in the project agreement — additional changes beyond that scope may come with extra charges.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Services</h2>
          <p className={styles.text}>
            Our solutions may involve third-party tools, platforms, or APIs — such as cloud providers or analytics tools. Disconnect isn&apos;t responsible for the performance, security, or policies of these external services. We encourage clients to review their respective terms before use.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>
            Disconnect won&apos;t be held liable for any indirect, incidental, or consequential damages resulting from your use of — or inability to use — our services. While we strive to deliver high-quality, secure solutions, we can&apos;t guarantee that every service will always be uninterrupted or error-free.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Protection and Privacy</h2>
          <p className={styles.text}>
            We take your data seriously and handle it with care. By using our services, you agree to the collection and use of your data as outlined in our{" "}
            <Link href="/privacy-policy" style={{ color: "#ff6b00" }}>Privacy Policy</Link>.
            We take appropriate security measures to protect your information, though we can&apos;t guarantee absolute security in all scenarios.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Termination of Services</h2>
          <p className={styles.text}>
            Disconnect reserves the right to suspend or terminate services if there&apos;s a breach of these Terms, non-payment, or misuse of our platform. Clients may also end services as defined in their service agreement.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Modifications to Terms</h2>
          <p className={styles.text}>
            We may update these Terms and Conditions from time to time to reflect changes in our services, legal requirements, or business practices. Continuing to use our services after any updates means you accept the revised Terms.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.text}>
            These Terms are governed by and interpreted in accordance with applicable laws of the Republic of India. Any disputes will be subject to the jurisdiction of relevant courts as specified in the service agreement.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <p className={styles.text}>
            If you have any questions or concerns about these Terms and Conditions, you&apos;re welcome to reach out through our official website or designated communication channels.
          </p>
        </section>

        <p className={styles.updatedDate}>Last updated: March 2025 · Disconnect Agencies</p>
      </div>
    </main>
  );
}
