"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MorphingLoginButton } from "./HeroContent";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_SMOOTH as any,
      delay: 0.1,
    },
  },
};

const navLinkVariants = {
  initial: { color: "rgba(255,255,255,0.7)" },
  hover: {
    color: "#fff",
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" } as any,
  },
  tap: { scale: 0.95 },
};

export default function HeroNavbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => {
      setUserName(localStorage.getItem("userName"));
      setUserRole(localStorage.getItem("userRole") ?? "user");
    };
    sync();
    const interval = setInterval(sync, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUserName(null);
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

    // ❌ removed old Pricing route
    // if (item === "Pricing") router.push("/pricing");

    if (item === "Benefit") router.push("/benefit");
    if (item === "Book A Call") router.push("/book-call");
    if (item === "login") router.push("/auth");
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .nav {
              max-width: 100% !important;
              padding: 0 16px !important;
            }

            .nav-links,
            .login-btn {
              display: none !important;
            }

            .hamburger {
              display: flex !important;
            }
          }
        `}
      </style>

      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(12px)",
        }}
      >
        <nav
          className="nav"
          style={{
            maxWidth: "1320px",
            height: "70px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <motion.div
            style={{ flexShrink: 0, cursor: "pointer" }}
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.png"
              alt="Disconnect"
              width={116}
              height={36}
              priority
            />
          </motion.div>

          {/* DESKTOP LINKS */}
          <ul
            className="nav-links"
            style={{
              display: "flex",
              gap: "40px",
              listStyle: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
              (item) => (
                <motion.li
                  key={item}
                  variants={navLinkVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  style={{ cursor: "pointer" }}
                >
                  {/* ✅ SERVICES SCROLL */}
                  {item === "Services" ? (
                    <Link
                      href="/#services"
                      onClick={() => setOpen(false)}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      Services
                    </Link>
                  ) : item === "Pricing" ? (
                    /* ✅ PRICING SCROLL (CURRENT PAGE) */
                    <Link
                      href={`${pathname}#pricing`}
                      onClick={() => setOpen(false)}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      Pricing
                    </Link>
                  ) : (
                    <span onClick={() => handleNavigate(item)}>
                      {item}
                    </span>
                  )}
                </motion.li>
              )
            )}
          </ul>

          {/* DESKTOP CTA */}
          <div className="login-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {userName && userRole === 'admin' && (
              <a
                href="/admin"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#a78bfa',
                  textDecoration: 'none',
                  border: '1px solid rgba(124,58,237,0.45)',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  background: 'rgba(124,58,237,0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Admin
              </a>
            )}
            <MorphingLoginButton />
          </div>

          {/* HAMBURGER */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="hamburger"
            style={{
              display: "none",
              width: "44px",
              height: "44px",
              padding: "10px",
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexDirection: "column",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                transition: "0.25s",
                transform: open
                  ? "rotate(45deg) translateY(8px)"
                  : "none",
              }}
            />
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                opacity: open ? 0 : 1,
                transition: "0.25s",
              }}
            />
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#fff",
                transition: "0.25s",
                transform: open
                  ? "rotate(-45deg) translateY(-8px)"
                  : "none",
              }}
            />
          </button>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                background: "#000",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden", // Ensures smooth height transition
              }}
            >
              <div style={{ padding: "20px 16px" }}>
                {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
                  (item) => (
                    <div
                      key={item}
                      style={{
                        padding: "14px 0",
                        fontSize: "16px",
                        color: "#fff",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                      }}
                    >
<<<<<<< HEAD
                      {item === "Services" ? (
                        <Link
                          href="/#services"
                          onClick={() => setOpen(false)}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          Services
                        </Link>
                      ) : item === "Pricing" ? (
                        <Link
                          href={`${pathname}#pricing`}
                          onClick={() => setOpen(false)}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          Pricing
                        </Link>
                      ) : (
                        <span onClick={() => handleNavigate(item)}>
                          {item}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
=======
                      Services
                    </Link>
                  ) : item === "Pricing" ? (
                    <Link
                      href={`${pathname}#pricing`}
                      onClick={() => setOpen(false)}
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      Pricing
                    </Link>
                  ) : (
                    <span onClick={() => handleNavigate(item)}>
                      {item}
                    </span>
                  )}
                </div>
              )
            )}
            {/* Login / Logout in mobile menu */}
            <div
              style={{
                padding: "14px 0",
                fontSize: "16px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {userName ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                      Hi, {userName}
                      {userRole === "admin" && (
                        <span style={{
                          marginLeft: "6px",
                          fontSize: "10px",
                          background: "rgba(124,58,237,0.3)",
                          color: "#a78bfa",
                          border: "1px solid rgba(124,58,237,0.5)",
                          borderRadius: "4px",
                          padding: "1px 5px",
                          fontWeight: 600,
                          verticalAlign: "middle",
                        }}>ADMIN</span>
                      )}
                    </span>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: "rgba(255,80,80,0.15)",
                        border: "1px solid rgba(255,100,100,0.4)",
                        color: "#ff8080",
                        borderRadius: "999px",
                        padding: "6px 18px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                  {userRole === "admin" && (
                    <a
                      href="/admin"
                      onClick={() => setOpen(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#a78bfa",
                        fontSize: "14px",
                        fontWeight: 600,
                        textDecoration: "none",
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.35)",
                        borderRadius: "8px",
                        padding: "8px 14px",
                      }}
                    >
                      ⚙️ Admin Panel
                    </a>
                  )}
                </div>
              ) : (
                <span
                  onClick={() => { setOpen(false); router.push("/auth"); }}
                  style={{ color: "rgba(255,170,90,0.9)", fontWeight: 600 }}
                >
                  Login
                </span>
              )}
            </div>
          </div>
        )}
      </header>
>>>>>>> 48b7a3addeb201b8a37908428e5dc004fd4ba25e
    </>
  );
}