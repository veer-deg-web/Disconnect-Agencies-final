import styles from "./UIUXFAQ.module.css";

export default function UIUXFAQ() {
  const faqs = [
    "Why wouldn’t I just hire a full-time designer?",
    "Is there a limit to how many requests I can have?",
    "How fast will I receive my designs?",
    "Who are the designers?",
    "What if I don’t like the design?",
    "Are there any refunds if I don’t like the service?",
  ];

  return (
    <section className={styles.section}>
      {faqs.map((q: string) => (
        <div key={q} className={styles.faqItem}>
          <span>{q}</span>
          <span className={styles.plus}>+</span>
        </div>
      ))}
    </section>
  );
}
