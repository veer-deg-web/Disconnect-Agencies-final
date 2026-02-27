"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SiStripe, SiGooglecloud, SiApple } from "react-icons/si";
import "./ClientFeedback.css";

const easeSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

const videoSwipeVariant: Variants = {
  hidden: { y: "70%" },
  show: {
    y: "0%",
    transition: { duration: 2.4, ease: easeSmooth },
  },
};

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  rating: number;
  image: string;
  logo: ReactNode;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Noah Ramirez",
    position: "SEO Specialist",
    company: "Apple",
    rating: 4.9,
    image: "/assets/WebDevelopment/Testimonial/photo/client1.png",
    logo: <SiApple />,
    text: `Working with Metrilo has been a game-changer. Their innovative strategies helped us triple engagement in just six months.`,
  },
  {
    id: 2,
    name: "Sophia Carter",
    position: "Marketing Lead",
    company: "Google Cloud",
    rating: 4.8,
    image: "/assets/WebDevelopment/Testimonial/photo/client1.png",
    logo: <SiGooglecloud />,
    text: `Disconnect’s execution and attention to detail is unmatched.`,
  },
  {
    id: 3,
    name: "Daniel Kim",
    position: "Founder",
    company: "Stripe",
    rating: 5.0,
    image: "/assets/WebDevelopment/Testimonial/photo/client1.png",
    logo: <SiStripe />,
    text: `The team truly understands premium digital experiences.`,
  },
];

export default function ClientFeedback() {
  const [active, setActive] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, 8000); // 5 seconds

  return () => clearInterval(interval);
}, []);

  return (
    <section className="feedback-section">
      <h2 className="section-heading">
        Client feedback in their words
      </h2>

      <div className="carousel-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="feedback-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* LEFT IMAGE */}
            <motion.div
              className="feedback-left"
              variants={videoSwipeVariant}
              initial="hidden"
              animate="show"
            >
              <img
                src={testimonials[active].image}
                alt={testimonials[active].name}
                className="feedback-image"
              />
            </motion.div>

            {/* RIGHT TEXT */}
            <motion.div
              className="feedback-right"
              initial={{ opacity: 0, y: "50%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 1.2, ease: easeSmooth }}
            >
              <div className="rating">
                <span className="star">★</span>
                <span>{testimonials[active].rating} / 5</span>
              </div>

              <p className="feedback-text">
                "{testimonials[active].text}"
              </p>

              {/* Bottom Right Block */}
              <div className="company-block">
                <div className="company-logo">
                  {testimonials[active].logo}
                </div>

                <div className="company-name">
                  {testimonials[active].company}
                </div>

                <div className="person-name">
                  {testimonials[active].name}
                </div>

                <div className="person-position">
                  {testimonials[active].position}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* DOTS */}
        <div className="dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`dot ${active === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}