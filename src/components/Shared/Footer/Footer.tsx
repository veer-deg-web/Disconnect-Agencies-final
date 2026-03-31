"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaGithub, FaFacebookF } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  


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
        <div className={styles.mainContent}>
          {/* BRAND SECTION */}
          <div className={styles.brandSection}>
            <div 
              className={styles.brandLogo}
              onClick={() => router.push("/")}
            >
              <Image
                src="/assets/Home/HeroNavbar/photo/logo.webp"
                alt="Disconnect"
                width={180}
                height={56}
                priority
              />
            </div>
            <p className={styles.brandDesc}>
              Disconnect builds production-grade digital products, platforms, and AI systems. 
              We bridge the gap between complex technology and intuitive user experiences.
            </p>
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
          </div>

          {/* QUICK LINKS */}
          <div className={styles.navSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <nav className={styles.nav}>
              {[
                "Home",
                "Feature",
                "Benefits",
                "Pricing",
                "Testimonials",
                "FAQ",
                "About Us",
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
          </div>

          {/* CONTACT INFO */}
          <div className={styles.contactSection}>
            <h4 className={styles.sectionTitle}>Contact Us</h4>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <a href="tel:+918585858586" className={styles.contactLink}>+91 8585858586</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <a href="mailto:Career@disconnect.software" className={styles.contactLink}>Career@disconnect.software</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <a href="mailto:Enquiry@disconnect.software" className={styles.contactLink}>Enquiry@disconnect.software</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <a href="mailto:Support@disconnect.software" className={styles.contactLink}>Support@disconnect.software</a>
            </div>
            

          </div>
        </div>
        
        <div className={styles.feedbackBox}>
          <h4 className={styles.feedbackTitleSmall}>Loved our service?</h4>
          <Link href="/feedback" className={styles.feedbackBtnSmall}>
             Write a Review
          </Link>
        </div>



        {/* BOTTOM BAR */}
        <div className={styles.footerBottom}>
          <p className={styles.copy}>
            {new Date().getFullYear()} Copyright © Disconnect Agencies. All rights reserved.
          </p>
          
          <nav className={styles.legalLinks} aria-label="Legal">
            <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.legalDot}>·</span>
            <Link href="/disclaimer" className={styles.legalLink}>Disclaimer</Link>
            <span className={styles.legalDot}>·</span>
            <Link href="/terms-and-conditions" className={styles.legalLink}>Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
