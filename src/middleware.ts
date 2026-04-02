import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SERVICES = ["Cloud", "WebDevelopment", "AppDevelopment", "AIModels", "SEO", "Uiux"];

/**
 * Middleware to handle case-sensitive redirects for service routes.
 * Ensures that /cloud -> /Cloud, /seo -> /SEO, etc.
 * This is handled in middleware because next.config.js redirects are case-insensitive
 * by default and would cause infinite loops for these casing corrections.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip internal paths and assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Handle Case-Sensitive Service Redirects
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0];
    const matchingService = SERVICES.find(
      (s) => s.toLowerCase() === firstSegment.toLowerCase()
    );

    // If the path matches a service (case-insensitive) but is not already
    // using the canonical Title Case naming, redirect to the canonical version.
    if (matchingService && firstSegment !== matchingService) {
      const url = request.nextUrl.clone();
      segments[0] = matchingService;
      // Reconstruct path while preserving sub-paths (like /pricing or /[city])
      url.pathname = `/${segments.join("/")}`;
      
      console.log(`[Middleware] Redirecting ${pathname} to ${url.pathname} (Case correction)`);
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

// Limit middleware to top-level routes and sub-paths of services
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
