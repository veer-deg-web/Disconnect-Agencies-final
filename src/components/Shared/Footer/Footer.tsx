"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaGithub, FaFacebookF } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    if (token && storedName) {
      setUserName(storedName);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`${pathname}#${id}`);
  };

  const scrollToAny = (ids: string[]) => {
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    router.push(`${pathname}#${ids[0]}`);
  };

  const handleFooterNav = (item: string) => {
    if (item === "Home") {
      router.push("/");
      return;
    }
    if (item === "Feature") {
      scrollToAny(["feature", "features", "services"]);
      return;
    }
    if (item === "Benefits") {
      scrollToAny(["benefits", "benefit"]);
      return;
    }
    if (item === "Pricing") {
      scrollToSection("pricing");
      return;
    }
    if (item === "Testimonials") {
      scrollToAny(["testimonials", "testimonial", "reviews"]);
      return;
    }
    if (item === "FAQ") {
      scrollToAny(["faq"]);
      return;
    }
    if (item === "About Us") {
      router.push("/about");
      return;
    }
    if (item === "Careers") {
      router.push("/careers");
      return;
    }
    if (item === "Blog") {
      router.push("/blog");
      return;
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* BRAND INFO SECTION - COMMENTED OUT AS REQUESTED */}
        {/* 
        <div className={styles.brandInfo}>
          <div 
            className={styles.brandLogo}
            onClick={() => router.push("/")}
          >
            <Image
              src="/assets/Home/HeroNavbar/photo/logo.webp"
              alt="Disconnect"
              width={116}
              height={36}
            />
          </div>
          <p className={styles.brandDesc}>
            Disconnect builds production-grade digital products, platforms, and AI systems. 
            We bridge the gap between complex technology and intuitive user experiences.
          </p>
        </div>
        */}

        {/* NAV LINKS */}
        <nav className={styles.nav}>
          {[
            "Home",
            "Feature",
            "Benefits",
            "Pricing",
            "Testimonials",
            "FAQ",
            // "About Us",
            "Careers",
            "Blog",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleFooterNav(item)}
              className={styles.navBtn}
            >
              {item}
            </button>
          ))}
        </nav>
        
        <div className={styles.socialList}>
          {[
            { Icon: FaInstagram, href: "https://www.instagram.com/disconnect.agencies/", label: "Instagram" },
            { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/disconnect.agencies/", label: "LinkedIn" },
            { Icon: FaGithub, href: "https://github.com/veer-deg", label: "GitHub" },
            { Icon: FaFacebookF, href: "https://www.facebook.com/disconnect.agencies", label: "Facebook" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={styles.socialLink}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* FEEDBACK SECTION FOR LOGGED IN USERS */}
        {userName && (
          <div className={styles.feedbackContainer}>
            <div className={styles.feedbackBox}>
              <h4 className={styles.feedbackTitle}>Enjoying Disconnect?</h4>
              <p className={styles.feedbackText}>
                Have thoughts or suggestions? We&apos;d love to hear from you. Your feedback might be featured directly on our page!
              </p>
              <button
                onClick={() => router.push("/feedback")}
                className={styles.feedbackBtn}
              >
                Write Feedback
              </button>
            </div>
          </div>
        )}

        {/* LEGAL LINKS */}
        <nav className={styles.legalLinks} aria-label="Legal">
          <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
          <span className={styles.legalDot}>·</span>
          <Link href="/disclaimer" className={styles.legalLink}>Disclaimer</Link>
          <span className={styles.legalDot}>·</span>
          <Link href="/terms-and-conditions" className={styles.legalLink}>Terms &amp; Conditions</Link>
        </nav>

        {/* COPYRIGHT */}
        <p className={styles.copy}>
          2025 Copyright © Disconnect Agencies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
