"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MorphingLoginButton } from "./HeroContent";

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

    // ❌ removed old Pricing route
    // if (item === "Pricing") router.push("/pricing");

    if (item === "Book A Call") router.push("/book-call");
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

  return (
    <>
      <style>
        {`
          .nav {
            box-sizing: border-box;
            width: 100%;
          }

          .nav-links {
            align-items: center;
          }

          @media (max-width: 1200px) {
            .nav {
              padding: 0 24px !important;
            }

            .nav-links {
              gap: 28px !important;
            }
          }

          @media (max-width: 980px) {
            .nav {
              padding: 0 18px !important;
            }

            .nav-links {
              gap: 18px !important;
              font-size: 13px !important;
            }
          }

          @media (max-width: 860px) {
            .nav {
              max-width: 100% !important;
              padding: 0 14px !important;
              height: 64px !important;
            }

            .nav-links,
            .login-btn {
              display: none !important;
            }

            .hamburger {
              display: flex !important;
            }
          }

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

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          maxWidth: "100vw",
          overflowX: "clip",
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
          <div
            style={{ flexShrink: 0, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <Image
              src="/assets/Home/HeroNavbar/photo/logo.webp"
              alt="Disconnect"
              width={116}
              height={36}
              priority
            />
          </div>

          {/* DESKTOP LINKS */}
          <ul
            className="nav-links"
            style={{
              display: "flex",
              gap: "40px",
              listStyle: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {["Home", "Pricing", "Services", "Benefit", "Book A Call"].map(
              (item) => (
                <li
                  key={item}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      "rgba(255,255,255,0.7)")
                  }
                >
                  {item === "Services" ? (
                    <button
                      type="button"
                      onClick={handleServicesClick}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        font: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      Services
                    </button>
                  ) : item === "Pricing" ? (
                    <button
                      type="button"
                      onClick={handlePricingClick}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        font: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      Pricing
                    </button>
                  ) : (
                    <span onClick={() => handleNavigate(item)}>
                      {item}
                    </span>
                  )}
                </li>
              )
            )}
          </ul>

          {/* DESKTOP CTA */}
          <div className="login-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Replaced static avatar with unified MorphingLoginButton from HeroContent */}
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
              padding: 0,
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              position: "relative",
              overflow: "visible",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "24px",
                height: "2px",
                background: "#fff",
                transition: "0.25s",
                transform: open
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : "translate(-50%, calc(-50% - 7px)) rotate(0deg)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "24px",
                height: "2px",
                background: "#fff",
                opacity: open ? 0 : 1,
                transition: "0.25s",
                transform: "translate(-50%, -50%)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "24px",
                height: "2px",
                background: "#fff",
                transition: "0.25s",
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
            style={{
              background: "#000",
              padding: "20px 16px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
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
                  {item === "Services" ? (
                    <button
                      type="button"
                      onClick={handleServicesClick}
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        font: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      Services
                    </button>
                  ) : item === "Pricing" ? (
                    <button
                      type="button"
                      onClick={handlePricingClick}
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        font: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      Pricing
                    </button>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {userAvatar ? (
                        <img src={userAvatar} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff' }}>
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", display: "flex", flexDirection: "column" }}>
                        <span>Hi, {userName}</span>
                        {userRole === "admin" && (
                          <span style={{
                            fontSize: "10px",
                            background: "rgba(124,58,237,0.3)",
                            color: "#a78bfa",
                            border: "1px solid rgba(124,58,237,0.5)",
                            borderRadius: "4px",
                            padding: "1px 5px",
                            fontWeight: 600,
                            marginTop: "2px",
                            width: "fit-content"
                          }}>ADMIN</span>
                        )}
                      </span>
                    </div>
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
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href="/profile"
                      onClick={() => setOpen(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 500,
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        flex: 1,
                        justifyContent: "center"
                      }}
                    >
                      👤 Profile
                    </a>
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
                        flex: 1,
                        justifyContent: "center"
                      }}
                    >
                      ⚙️ Admin Panel
                    </a>
                  )}
                  </div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
