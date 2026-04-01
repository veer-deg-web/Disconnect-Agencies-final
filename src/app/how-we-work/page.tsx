import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "How We Work | Disconnect Agencies",
  description:
    "Learn how Disconnect Agencies operates — simple, transparent, and deeply collaborative. From kickoff to delivery, we build together.",
  keywords: [
    "how we work",
    "Disconnect Agencies process",
    "client collaboration",
    "digital agency workflow",
    "project process",
  ],
  openGraph: {
    title: "How We Work | Disconnect Agencies",
    description:
      "Simple, transparent, and deeply collaborative — discover how Disconnect Agencies brings your vision to life.",
    url: "https://disconnect-agencies-final.vercel.app/how-we-work",
    siteName: "Disconnect Agencies",
    type: "website",
  },
  alternates: {
    canonical: "https://disconnect-agencies-final.vercel.app/how-we-work",
  },
};

const steps = [
  {
    number: "01",
    title: "Getting Started",
    body: "Once we've agreed to move forward, our team doesn't just jump into execution — we start with alignment. We connect with you personally to understand your goals, expectations, and the bigger vision behind your project. This ensures we're not just building features, but creating something meaningful and effective.",
  },
  {
    number: "02",
    title: "On-Table Collaboration (Within 7 Days)",
    body: "Within a maximum of 7 days from confirmation, our team schedules an in-depth working session with you. This is where everything begins to take shape — UI direction, user experience, product flow, and overall vision planning.\n\nWe believe this stage is too important to rush or handle over endless calls. That's why we prefer working closely with you, face-to-face whenever possible, to bring clarity and precision right from the start.",
  },
  {
    number: "03",
    title: "On-Site Engagement",
    body: "Once you're fully ready to proceed, our team arrives to work alongside you. From that moment, your dedicated 7-day collaboration window begins.\n\nSince we operate as a global service provider, travel, accommodation, and food arrangements for the team are handled by the client during this period. This allows us to stay fully focused on your project without distractions.",
  },
  {
    number: "04",
    title: "Defining the Roadmap",
    body: "After this collaborative phase, we finalise everything — from timelines and deliverables to technical scope and execution strategy. You'll receive a clear and realistic delivery schedule, so you always know what's coming and when.",
  },
  {
    number: "05",
    title: "Execution & Delivery",
    body: "With a solid foundation in place, our team moves into development with clarity and confidence. Every step is aligned with what was planned, ensuring smooth progress and high-quality output.",
  },
  {
    number: "06",
    title: "Flexibility & Add-Ons",
    body: "We understand that ideas evolve. If you decide to add new features or expand the scope during the process, we're always open to it. Just keep in mind — additional requirements may impact both the timeline and the overall cost, and we'll communicate those changes clearly before moving ahead.",
  },
];

export default function HowWeWorkPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>Our Process</div>
        <h1 className={styles.title}>How We Work</h1>
        <p className={styles.subtitle}>
          We keep things simple, transparent, and deeply collaborative — because
          great products are built together, not just delivered.
        </p>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        {steps.map((step, index) => (
          <div key={step.number}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {step.number}. {step.title}
              </h2>
              {step.body.split("\n\n").map((para, i) => (
                <p key={i} className={styles.text}>
                  {para}
                </p>
              ))}
            </section>
            {index < steps.length - 1 && <div className={styles.divider} />}
          </div>
        ))}

        <div className={styles.divider} />

        {/* Closing line */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Approach, In One Line</h2>
          <p className={styles.text}>
            We don&apos;t just build products &mdash; we align, collaborate, and
            execute with precision to bring your vision to life.
          </p>
        </section>

        <p className={styles.updatedDate}>
          Disconnect Agencies · Building together, delivering with purpose
        </p>
      </div>
    </main>
  );
}
