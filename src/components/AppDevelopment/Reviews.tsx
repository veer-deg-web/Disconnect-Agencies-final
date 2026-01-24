"use client";

import "./Reviews.css";

const featuredReview = {
  text: `Disconnect completely transformed our app idea into a real product.
I didn’t realize how much a smooth UI and proper development mattered until
I saw the final result. Now I feel confident launching and scaling our app.`,
  author: "Mary Smith",
  date: "May 16, 2025",
  avatar: "/avatar.png", // replace later
};

const reviews = [
  { name: "John Doe", date: "May 12, 2025" },
  { name: "John Doe", date: "May 12, 2025" },
  { name: "John Doe", date: "May 12, 2025" },
  { name: "John Doe", date: "May 12, 2025" },
];

export default function Reviews() {
  return (
    <section className="reviews">
      {/* FEATURED REVIEW */}
      <p className="reviews__quote">
        {featuredReview.text}
      </p>

      <div className="reviews__author">
        <img
          src={featuredReview.avatar}
          alt={featuredReview.author}
          className="reviews__avatar"
        />
        <div>
          <div className="reviews__name">{featuredReview.author}</div>
          <div className="reviews__date">{featuredReview.date}</div>
        </div>
      </div>

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
