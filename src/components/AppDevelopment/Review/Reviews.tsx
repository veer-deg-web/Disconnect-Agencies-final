"use client";

import { useMemo } from "react";
import "./Reviews.css";
import { useDynamicTestimonials, DynamicTestimonial } from "@/lib/useDynamicTestimonials";

/* ---------------- TRUSTED BY ---------------- */

function TrustedBy({ images, author, date }: { images: string[], author: string, date: string }) {
  // Pad with default images if we don't have enough avatars
  const displayImages = [...images];
  const defaults = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  ];
  
  while (displayImages.length < 5) {
    displayImages.push(defaults[displayImages.length]);
  }

  return (
    <div className="trusted-by">
      <div className="trusted-by__avatars">
        {displayImages.slice(0, 5).map((src: string, i: number) => (
          <div key={i} className="trusted-by__avatar">
            <img src={src} alt="User avatar" />
          </div>
        ))}
      </div>

      <div className="trusted-by__info">
        <div className="reviews__name">{author}</div>
        <div className="reviews__date">{date}</div>
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

interface ReviewItem {
  name: string;
  date: string;
}

export default function Reviews() {
  const { testimonials: dynTestimonials } = useDynamicTestimonials("AppDev", true);

  const { featuredReview, reviews, avatars } = useMemo(() => {
    // If no dynamic testimonials, provide a fallback
    if (!dynTestimonials || dynTestimonials.length === 0) {
      return {
        featuredReview: {
           text: "Disconnect has completely transformed our app idea into a real product. I didn’t realize how much a smooth UI and proper development mattered until I saw the final result. Now I feel confident launching and scaling our app.",
           author: "Mary Smith",
           date: "May 16, 2025"
        },
        reviews: [
          { name: "John Doe", date: "May 12, 2025" },
          { name: "John Doe", date: "May 12, 2025" },
          { name: "John Doe", date: "May 12, 2025" },
          { name: "John Doe", date: "May 12, 2025" },
        ],
        avatars: []
      };
    }

    const first = dynTestimonials[0] as DynamicTestimonial;
    const rest = dynTestimonials.slice(1, 5) as DynamicTestimonial[];
    
    // Extract avatars for the "TrustedBy" row
    const availableAvatars = (dynTestimonials as DynamicTestimonial[])
      .map((t: DynamicTestimonial) => t.user.avatar)
      .filter((avatar): avatar is string => Boolean(avatar));

    return {
      featuredReview: {
        text: first.content,
        author: first.user.name,
        date: new Date(first.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      },
      reviews: rest.map((t: DynamicTestimonial) => ({
        name: t.user.name,
        date: new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      })),
      avatars: availableAvatars
    };
  }, [dynTestimonials]);

  return (
    <section className="reviews">
      {/* FEATURED REVIEW */}
      <div className="reviews__quote">
        <div className="reviews__inline-flex">
          <span className="review-text">
            {featuredReview.text}
          </span>
        </div>
      </div>

      {/* AUTHOR */}
      <TrustedBy images={avatars} author={featuredReview.author} date={featuredReview.date} />

      {/* REVIEW STRIP */}
      <div className="reviews__strip">
        {reviews.map((item: ReviewItem, index: number) => (
          <div key={index} className="review-card">
            <div className="review-card__name">{item.name}</div>
            <div className="review-card__date">{item.date}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
