"use client";

import React from "react";
import ColorBends from "@/components/ColorBends";
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
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1", "#ffffff"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
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
          <motion.div 
            className="about-description-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="about-description">
              Disconnect Software builds technology that actually works for the businesses using it. We specialise in AI Models & Automation, App Development, Web Development, SEO, UI/UX Design, and Cloud Services — not because it's a good list to put on a website, but because these are the areas where we've built real capability and done work we're proud of.
            </p>
            <p className="about-description">
              Most agencies talk about strategy. We put it next to execution and make sure they match. Whether that's an intelligent automation system cutting down hours of manual work, a user interface that stops people from bouncing, or a cloud setup that scales without drama — the benchmark is always whether it actually solves the problem.
            </p>
            <p className="about-description">
              We don't work with everyone. We work with businesses that are serious about what they're building and want a partner who'll be straight with them — about what's possible, what it'll cost, and what it'll take. We're not here to sell a project and disappear.
            </p>
            <p className="about-description">
              Internally, the team runs on curiosity. New tools, new methods, emerging frameworks — we stay close to what's developing because that's what keeps our work relevant. When something better comes along, we adapt. Our clients benefit from that without having to track it themselves.
            </p>
          </motion.div>
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
