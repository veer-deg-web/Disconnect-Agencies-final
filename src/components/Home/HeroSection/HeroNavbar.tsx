"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MorphingLoginButton } from "./HeroContent";
import styles from "./HeroNavbar.module.css";

export default function HeroNavbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => {
      const nextUserName = localStorage.getItem("userName");
      const nextUserAvatar = localStorage.getItem("userAvatar") || null;
      const nextUserRole = localStorage.getItem("userRole") ?? "user";

      setUserName((prev) => (prev === nextUserName ? prev : nextUserName));
      setUserAvatar((prev) => (prev === nextUserAvatar ? prev : nextUserAvatar));
      setUserRole((prev) => (prev === nextUserRole ? prev : nextUserRole));
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") sync();
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userAvatar");
    setUserName(null);
    setUserAvatar(null);
    setUserRole("user");
    setOpen(false);
    router.push("/");
  };

  const handleNavigate = (item: string) => {
    setOpen(false);

    if (item === "Home") {
      router.push("/");
      return;
    }

    if (item === "Benefit") {
      const section =
        document.getElementById("benefits") ||
        document.getElementById("benefit");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      router.push(`${pathname}#benefits`);
      return;
    }

    if (item === "Book A Call") router.push("/book-call");
    if (item === "About Us") router.push("/about");
    if (item === "login") router.push("/auth");
  };

  const handlePricingClick = () => {
    setOpen(false);
    const section = document.getElementById("pricing");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`${pathname}#pricing`);
  };

  const handleServicesClick = () => {
    setOpen(false);
    const section = document.getElementById("services");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/?scroll=services");
  };

  // Hide Navbar on /auth and /admin pages
  if (pathname === "/auth" || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = ["Home", "Pricing", "Services", "Benefit", "Book A Call"]
    .filter(item => !(item === "Pricing" && (pathname === "/" || pathname?.startsWith("/Cloud"))));

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* LOGO */}
          <div
            className={styles.logo}
            onClick={() => router.push("/")}
          >
            <Image
              src="/assets/logo.png"
              alt="Disconnect"
              width={162}
              height={54}
              priority
            />
          </div>

          {/* DESKTOP LINKS */}
          <ul className={styles.navLinks}>
            {navItems.map((item) => (
                <li key={item} className={styles.navItem}>
                  {item === "Services" ? (
                    <button
                      type="button"
                      onClick={handleServicesClick}
                      className={styles.navButton}
                      aria-label="Scroll to services"
                    >
                      Services
                    </button>
                  ) : item === "Pricing" ? (
                    <button
                      type="button"
                      onClick={handlePricingClick}
                      className={styles.navButton}
                      aria-label="Scroll to pricing"
                    >
                      Pricing
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavigate(item)}
                      className={styles.navButton}
                      aria-label={`Navigate to ${item}`}
                    >
                      {item}
                    </button>
                  )}
                </li>
              )
            )}
          </ul>

          {/* DESKTOP CTA */}
          <div className={styles.loginBtnWrap}>
            {userName && userRole === 'admin' && (
              <a href="/admin" className={styles.adminLink}>
                Admin
              </a>
            )}
            <MorphingLoginButton />
          </div>

          {/* HAMBURGER */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={styles.hamburger}
          >
            <span
              className={styles.hamburgerLine}
              style={{
                transform: open
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : "translate(-50%, calc(-50% - 7px)) rotate(0deg)",
              }}
            />
            <span
              className={styles.hamburgerLine}
              style={{
                opacity: open ? 0 : 1,
                transform: "translate(-50%, -50%)",
              }}
            />
            <span
              className={styles.hamburgerLine}
              style={{
                transform: open
                  ? "translate(-50%, -50%) rotate(-45deg)"
                  : "translate(-50%, calc(-50% + 7px)) rotate(0deg)",
              }}
            />
          </button>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={styles.mobileMenu}
            >
              {navItems.map((item) => (
                <div key={item} className={styles.mobileItem}>
                  {item === "Services" ? (
                    <button
                      type="button"
                      onClick={handleServicesClick}
                      className={styles.mobileButton}
                      aria-label="Scroll to services"
                    >
                      Services
                    </button>
                  ) : item === "Pricing" ? (
                    <button
                      type="button"
                      onClick={handlePricingClick}
                      className={styles.mobileButton}
                      aria-label="Scroll to pricing"
                    >
                      Pricing
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavigate(item)}
                      className={styles.mobileButton}
                      aria-label={`Navigate to ${item}`}
                    >
                      {item}
                    </button>
                  )}
                </div>
              ))}

              {/* Login / Logout in mobile menu */}
              <div className={styles.mobileAuth}>
                {userName ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div className={styles.mobileAuthHeader}>
                      <div className={styles.mobileUserInfo}>
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt="Profile"
                            width={32}
                            height={32}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className={styles.mobileAvatar}>
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={styles.mobileUserText}>
                          <span>Hi, {userName}</span>
                          {userRole === "admin" && (
                            <span className={styles.mobileAdminBadge}>ADMIN</span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={styles.mobileLogout}
                      >
                        Logout
                      </button>
                    </div>
                    <div className={styles.mobileLinksRow}>
                      <a
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className={styles.mobileProfileLink}
                      >
                        👤 Profile
                      </a>
                      {userRole === "admin" && (
                        <a
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className={styles.mobileAdminLink}
                        >
                          ⚙️ Admin Panel
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOpen(false); router.push("/auth"); }}
                    className={`${styles.mobileButton} ${styles.mobileLoginText}`}
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
