"use client";

import { useEffect, useRef } from "react";
import "./OurWorkStack.css";

export default function OurWorkStack() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const vh = window.innerHeight;

      // shared progress for the whole section
      const progress =
        (scrollY - sectionTop) / (sectionHeight - vh);
      const clamped = Math.max(0, Math.min(1, progress));

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // THIS is the correct stacking math
        const localProgress = clamped * 3 - index;

        let translateY = vh;

        if (localProgress >= 1) {
          translateY = 0;
        } else if (localProgress > 0) {
          translateY = vh * (1 - localProgress);
        }

        card.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="our-work-section">
      <div className="our-work-sticky">
        {/* IMAGE 1 */}
        <div
          ref={(el) => {
            cardsRef.current[0] = el;
          }}
          className="our-work-card"
          style={{ zIndex: 1 }}
        >
          <img src="/Stack1.png" alt="Work 1" />
        </div>

        {/* IMAGE 2 */}
        <div
          ref={(el) => {
            cardsRef.current[1] = el;
          }}
          className="our-work-card"
          style={{ zIndex: 2 }}
        >
          <img src="/Stack2.png" alt="Work 2" />
        </div>

        {/* IMAGE 3 */}
        <div
          ref={(el) => {
            cardsRef.current[2] = el;
          }}
          className="our-work-card"
          style={{ zIndex: 3 }}
        >
          <img src="/Stack3.png" alt="Work 3" />
        </div>
      </div>
    </section>
  );
}