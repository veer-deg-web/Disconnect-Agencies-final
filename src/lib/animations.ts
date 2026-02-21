/**
 * Shared animation utilities for Framer Motion components.
 * Centralizes ease curves, common variants, and performance helpers.
 */

/* =======================
   EASE CURVES
======================= */

/** The primary cubic bezier used throughout — smooth deceleration */
export const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* =======================
   COMMON VARIANTS
======================= */

/** Fade up from below (most common entrance animation) */
export const fadeUp = (duration = 0.8, delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: EASE_SMOOTH, delay },
    },
});

/** Slide in from the left */
export const fadeLeft = (duration = 0.8, delay = 0) => ({
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration, ease: EASE_SMOOTH, delay },
    },
});

/** Parent container that staggers its children */
export const staggerContainer = (stagger = 0.18, delayChildren = 0.15) => ({
    hidden: {},
    visible: {
        transition: { staggerChildren: stagger, delayChildren },
    },
});

/* =======================
   PERFORMANCE HELPERS
======================= */

/** Style hint for GPU-accelerated transform + opacity animations */
export const WILL_CHANGE_TRANSFORM: React.CSSProperties = {
    willChange: "transform, opacity",
};

/** Style hint for GPU-accelerated transform-only animations (e.g. marquees) */
export const WILL_CHANGE_TRANSFORM_ONLY: React.CSSProperties = {
    willChange: "transform",
};
