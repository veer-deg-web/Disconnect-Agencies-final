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
    <section style={{ padding: "140px 24px", maxWidth: "900px", margin: "0 auto" }}>
      {faqs.map((q) => (
        <div
          key={q}
          style={{
            padding: "24px",
            borderRadius: "16px",
            marginBottom: "16px",
          }}
        >
          <span>{q}</span>
          <span style={{ float: "right" }}>+</span>
        </div>
      ))}
    </section>
  );
}
