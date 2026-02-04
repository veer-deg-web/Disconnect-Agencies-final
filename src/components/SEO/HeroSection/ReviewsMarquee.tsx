"use client";

import ReviewCard from "../Review/ReviewCard";

const reviews = [
  {
    name: "Eniola Bakare",
    role: "Full Stack Developer",
    company: "Abstract Studio",
    avatar: "/Section.png",
    rating: "10/10",
    quote: "From start to finish, the process was seamless.",
    highlight: true,
  },
  {
    name: "Sarah Maplas",
    role: "Lead UX Designer",
    company: "Creative Studios",
    avatar: "/Section.png",
    rating: "8/10",
    quote: "Found the perfect balance between design and execution.",
  },
  {
    name: "Jon Bell",
    role: "Data Scientist",
    company: "Code Solutions",
    avatar: "/Section.png",
    rating: "10/10",
    quote: "They understood the goals clearly and delivered.",
  },
];

export default function ReviewsMarquee() {
  return (
    <div className="seo-marquee">
      <div className="seo-marquee__track">
        {[...reviews, ...reviews].map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>
    </div>
  );
}