"use client";

import React from "react";
import "./HeroBackground.css";

export default function HeroBackground() {
    return (
        <div className="hero-bg-container">
            {/* Base Dot Pattern */}
            <div className="hero-bg-dots" />

            {/* Glow Effects */}
            <div className="hero-bg-glow-1" />
            <div className="hero-bg-glow-2" />

            {/* Decorative Diagonal Line */}
            <div className="hero-bg-diagonal" />

            {/* Decorative Curved Element */}
            <div className="hero-bg-curve" />

            {/* Final Blending Overlay */}
            <div className="hero-bg-overlay" />
        </div>
    );
}
