"use client";

import "./Reviews.css";

import GradientText from "@/components/GradientText";


/* ---------------- FEATURED REVIEW ---------------- */

const featuredReview = {
  text: (
    <div className="reviews__inline-flex">
  <GradientText
   colors={[
 "#5869E3", "#7C3AED", "#22D3EE"]}
    animationSpeed={8}
    showBorder={false}
    className="gradient-word"
  >
    Disconnect
  </GradientText>

  <span className="review-text">
    completely transformed our app idea into a real product. I didn’t realize
    how much a smooth UI and proper development mattered until I saw the final
    result. Now I feel confident launching and scaling our app.
  </span>
</div>
  ),
  author: "Mary Smith",
  date: "May 16, 2025",
};

/* ---------------- OTHER REVIEWS ---------------- */

const reviews = [
  { name: "John Doe", date: "May 12, 2025" },
  { name: "John Doe", date: "May 12, 2025" },
  { name: "John Doe", date: "May 12, 2025" },
  { name: "John Doe", date: "May 12, 2025" },
];

/* ---------------- TRUSTED BY ---------------- */

function TrustedBy() {
  const images = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  ];

  return (
    <div className="trusted-by">
      <div className="trusted-by__avatars">
        {images.map((src, i) => (
          <div key={i} className="trusted-by__avatar">
            <img src={src} alt="User avatar" />
          </div>
        ))}
      </div>

      <div className="trusted-by__info">
        <div className="reviews__name">{featuredReview.author}</div>
        <div className="reviews__date">{featuredReview.date}</div>
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function Reviews() {
  return (
    <section className="reviews">
      {/* FEATURED REVIEW */}
      <div className="reviews__quote">
        {featuredReview.text}
      </div>

      {/* AUTHOR */}
      <TrustedBy />

      {/* REVIEW STRIP */}
      <div className="reviews__strip">
        {reviews.map((item, index) => (
          <div key={index} className="review-card">
            <div className="review-card__name">{item.name}</div>
            <div className="review-card__date">{item.date}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
