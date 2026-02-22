"use client";

import { motion } from "framer-motion";
import "./HeroBackground.css";

export default function HeroBackground() {
    return (
        <motion.div
            className="hero-bg-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* Base Dot Pattern */}
            <motion.div
                className="hero-bg-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
            />

            {/* Glow Effects */}
            <motion.div
                className="hero-bg-glow-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 0.4 }}
            />
            <motion.div
                className="hero-bg-glow-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 0.6 }}
            />

            {/* Decorative Diagonal Line */}
            <motion.div
                className="hero-bg-diagonal"
                initial={{ opacity: 0, scaleX: 0, x: "-50%", y: "-50%", rotate: 35 }}
                animate={{ opacity: 1, scaleX: 1, x: "-50%", y: "-50%", rotate: 35 }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            />

            {/* Decorative Curved Element */}
            <motion.div
                className="hero-bg-curve"
                initial={{ opacity: 0, pathLength: 0, rotate: -5 }}
                animate={{ opacity: 1, pathLength: 1, rotate: 0 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
            />

            {/* Final Blending Overlay */}
            <motion.div
                className="hero-bg-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
            />
        </motion.div>
    );
}
