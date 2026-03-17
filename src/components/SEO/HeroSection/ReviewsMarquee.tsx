"use client";

import ReviewCard from "../Review/ReviewCard";

interface ReviewData {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: string;
  quote: string;
  highlight?: boolean;
}

const reviews = [
  {
    name: "Eniola Bakare",
    role: "Full Stack Developer",
    company: "Abstract Studio",
    avatar: "/assets/SEO/HeroSection/photo/Section.webp",
    rating: "10/10",
    quote: "From start to finish, the process was seamless.",
    highlight: true,
  },
  {
    name: "Sarah Maplas",
    role: "Lead UX Designer",
    company: "Creative Studios",
    avatar: "/assets/SEO/HeroSection/photo/Section.webp",
    rating: "8/10",
    quote: "Found the perfect balance between design and execution.",
  },
  {
    name: "Jon Bell",
    role: "Data Scientist",
    company: "Code Solutions",
    avatar: "/assets/SEO/HeroSection/photo/Section.webp",
    rating: "10/10",
    quote: "They understood the goals clearly and delivered.",
  },
];

export default function ReviewsMarquee() {
  return (
    <div className="seo-marquee">
      <div className="seo-marquee__track">
        {[...reviews, ...reviews].map((r: ReviewData, i: number) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>
    </div>
  );
}