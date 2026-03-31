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
          <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
          <p className={styles.text}>
            Using Disconnect's website or services means you've read these Terms and agreed to them. If something here doesn't work for you, don't use the service. That's the honest version.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Services Offered</h2>
          <p className={styles.text}>
            Disconnect builds digital solutions — software development, automation, optimisation, cloud infrastructure. Every engagement runs on a defined project scope, timeline, and contract agreed between Disconnect and the client. No vague handshakes.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Responsibilities</h2>
          <p className={styles.text}>
            Use the platform lawfully. Don't attempt unauthorised access, don't introduce malicious code, and don't do anything that could hurt Disconnect, its clients, or its systems. Whatever information you provide should be accurate and current — if it isn't, that's a problem you own.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intellectual Property Rights</h2>
          <p className={styles.text}>
            What Disconnect creates belongs to Disconnect — content, code, designs, branding — unless a written agreement says otherwise. After full payment, usage rights transfer as laid out in the project agreement. Taking our work and reproducing or distributing it without permission isn't allowed.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Payments and Pricing</h2>
          <p className={styles.text}>
            Pricing is what's agreed in the proposal or contract. Pay on time. If payment is late or doesn't come, Disconnect can pause or end the engagement. Fees already paid aren't refundable unless the agreement specifically says they are.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Delivery and Revisions</h2>
          <p className={styles.text}>
            We hit our deadlines when we can. Sometimes delays happen — client dependencies, third-party tools, things no one saw coming. Those are real and they affect timelines. Revisions are scoped in the agreement; anything outside that scope is an additional conversation, potentially an additional cost.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Services</h2>
          <p className={styles.text}>
            Some of what we build pulls in third-party tools — cloud platforms, analytics services, APIs. Disconnect doesn't control those and isn't responsible for their performance or security. Check their terms if it matters to you.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>
            Disconnect isn't liable for indirect, incidental, or consequential damages from using — or not being able to use — our services. We build things well and take security seriously, but we can't promise every service runs perfectly at all times.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Protection and Privacy</h2>
          <p className={styles.text}>
            Your data is handled as described in our Privacy Disclaimer, which you agreed to by using our services. We take appropriate security measures. No system is completely bulletproof, but we're not cavalier about it either.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Termination of Services</h2>
          <p className={styles.text}>
            Disconnect can suspend or terminate services for breach of these Terms, non-payment, or misuse. Clients can end things too — as defined in the service agreement.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Modifications to Terms</h2>
          <p className={styles.text}>
            These Terms get updated when needed — new services, legal changes, evolving practices. If you keep using Disconnect after an update, you've accepted the new version.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.text}>
            Applicable law governs these Terms. Disputes go to the courts named in the service agreement.
          </p>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <p className={styles.text}>
            Questions about any of this? Reach out through our official website or communication channels. We'll respond properly.
          </p>
          <p className={styles.text}>
            Using Disconnect's services means you've read and agreed to these Terms. We assume you have.
          </p>
        </section>

        <p className={styles.updatedDate}>Last updated: March 2025 · Disconnect Agencies</p>
      </div>
    </main>
  );
}
