"use client";

import React from "react";
import Balatro from "@/components/Balatro";
import TeamMemberCard from "@/components/About/TeamMemberCard";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import "./AboutUs.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const teamMembers = [
  {
    name: "Alex Rivera",
    role: "Chief Executive Officer",
    image: "/assets/about/ceo.png",
    description: "Visionary leader driving the agency's mission to redefine digital excellence.",
    detailedDescription: "With over 15 years in the tech industry, Alex has led multiple successful startups before founding Disconnect. He believes in a people-first approach to building cutting-edge solutions.",
    linkedin: "https://linkedin.com/in/alexrivera",
    github: "https://github.com/arivera",
  },
  {
    name: "Elena Chen",
    role: "Chief Technology Officer",
    image: "/assets/about/cto.png",
    description: "Architecting scalable systems and pushing the boundaries of what's possible.",
    detailedDescription: "Elena is a veteran architect specializing in distributed systems and AI. She ensures that every piece of software built by Disconnect is robust, secure, and future-ready.",
    linkedin: "https://linkedin.com/in/elenachen",
    github: "https://github.com/echen-tech",
  },
  {
    name: "Kenji Sato",
    role: "Lead Creative Designer",
    image: "/assets/about/designer.png",
    description: "Crafting immersive visual experiences that captivate and convert.",
    detailedDescription: "Kenji brings an artistic soul to the digital realm. His designs aren't just aesthetically pleasing; they are deeply rooted in user psychology and brand storytelling.",
    linkedin: "https://linkedin.com/in/kenjisato",
    github: "https://github.com/kenjicreates",
  },
  {
    name: "Sarah Jenkins",
    role: "Head of Marketing",
    image: "/assets/about/marketing.png",
    description: "Strategizing growth and amplifying voices in the digital landscape.",
    detailedDescription: "Sarah is a growth-hacking expert who understands the pulse of the market. She bridges the gap between technology and the people who need it most.",
    linkedin: "https://linkedin.com/in/sarahjenkins",
    github: "https://github.com/sjenkins-marketing",
  },
  {
    name: "Marcus Thorne",
    role: "Operations Manager",
    image: "/assets/about/ops.png",
    description: "Ensuring seamless internal workflows and operational excellence.",
    detailedDescription: "Marcus keeps the agency running like a well-oiled machine. His focus on efficiency and project management ensures that every deadline is met with perfection.",
    linkedin: "https://linkedin.com/in/marcusthorne",
    github: "https://github.com/mthorne-ops",
  },
];

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <main className="about-page">
      {/* Brand Logo Top Right */}
      <div className="about-logo" onClick={() => router.push("/")}>
        <Image
          src="/assets/Home/HeroNavbar/photo/logo.webp"
          alt="Disconnect"
          width={116}
          height={36}
          priority
        />
      </div>

      {/* Dynamic Background */}
      <div className="about-background">
        <Balatro
          isRotate={false}
          mouseInteraction={true}
          pixelFilter={745}
          color1="#FF5C00"
          color2="#FF0031"
          color3="#000000"
        />
      </div>

      <div className="about-content">
        <header className="about-header">
          <motion.span 
            className="about-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meet the Agency
          </motion.span>
          <motion.h1 
            className="about-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ShinyText
              text="The Team Behind the Magic"
              speed={3}
              color="#b5b5b5"
              shineColor="#ffffff"
            />
          </motion.h1>
          <motion.p 
            className="about-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ShinyText
               text="We are a group of passionate individuals dedicated to creating extraordinary digital experiences through innovation and design."
               speed={5}
               color="rgba(255, 255, 255, 0.5)"
               shineColor="#ffffff"
               spread={150}
            />
          </motion.p>
        </header>

        <section className="team-grid">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </section>
      </div>
    </main>
  );
}
