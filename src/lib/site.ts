export const SITE_NAME = "Disconnect";

export function getSiteUrl(): string {
  return (process.env.SITE_URL || "https://disconnect-agencies-final.vercel.app").replace(/\/+$/, "");
}

export function toAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) {
    return `${getSiteUrl()}/uploads/blogs/blog-featured-placeholder.webp`;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
