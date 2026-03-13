import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Shared/Footer/Footer";
import dbConnect from "@/lib/mongodb";
import { getSiteUrl, SITE_NAME, toAbsoluteUrl } from "@/lib/site";
import {
  buildProfessionalMetaDescription,
  buildProfessionalMetaTitle,
  sanitizeBlogHtmlContent,
} from "@/lib/blogSeo";
import Blog from "@/models/Blog";

interface BlogFaq {
  question: string;
  answer: string;
}

interface BlogDocument {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  content: string;
  tags: string[];
  readingTime: number;
  author: string;
  faq: BlogFaq[];
  createdAt: string;
  updatedAt: string;
}

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  category: string;
}

interface Props {
  params: { slug: string };
}

async function getBlogPageData(slug: string) {
  await dbConnect();

  const blog = await Blog.findOne({ slug, status: "published" }).lean<BlogDocument | null>();

  if (!blog) {
    return null;
  }

  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id },
    status: "published",
    category: blog.category,
  })
    .select("title slug category")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean<RelatedBlog[]>();

  return {
    blog: JSON.parse(JSON.stringify(blog)) as BlogDocument,
    relatedBlogs: JSON.parse(JSON.stringify(relatedBlogs)) as RelatedBlog[],
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getBlogPageData(params.slug);

  if (!data) {
    return {
      title: "Blog Not Found",
      description: "The requested article could not be found.",
    };
  }

  const { blog } = data;
  const canonical = `${getSiteUrl()}/blog/${blog.slug}`;
  const title = buildProfessionalMetaTitle(blog.title, blog.metaTitle);
  const description = buildProfessionalMetaDescription({
    provided: blog.metaDescription,
    excerpt: blog.excerpt,
    content: blog.content,
    title: blog.title,
  });
  const image = toAbsoluteUrl(blog.featuredImage);

  return {
    title,
    description,
    keywords: blog.tags,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const data = await getBlogPageData(params.slug);

  if (!data) {
    notFound();
  }

  const { blog, relatedBlogs } = data;
  const canonical = `${getSiteUrl()}/blog/${blog.slug}`;
  const articleHtml = sanitizeBlogHtmlContent(blog.content || "", {
    fallbackAlt: blog.title,
  });
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.metaDescription,
    image: [toAbsoluteUrl(blog.featuredImage)],
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    mainEntityOfPage: canonical,
    articleSection: blog.category,
    keywords: blog.tags.join(", "),
  };
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: getSiteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${getSiteUrl()}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: canonical,
      },
    ],
  };
  const faqStructuredData =
    blog.faq?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blog.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <main style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}

      <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "120px 24px 80px" }}>
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            color: "rgba(255,255,255,0.55)",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" style={{ color: "inherit", textDecoration: "none" }}>
            Blog
          </Link>
          <span>/</span>
          <Link
            href={`/category/${encodeURIComponent(blog.category)}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {blog.category}
          </Link>
        </nav>

        <header
          style={{
            display: "grid",
            gap: "24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "32px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <span
              style={{
                border: "1px solid rgba(222,94,3,0.35)",
                color: "#DE5E03",
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {blog.category}
            </span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
              {blog.readingTime} min read
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.3rem, 5vw, 4.25rem)",
              lineHeight: 1.05,
              margin: 0,
              maxWidth: "920px",
            }}
          >
            {blog.title}
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: "760px",
              margin: 0,
            }}
          >
            {blog.excerpt}
          </p>

          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              color: "rgba(255,255,255,0.65)",
              fontSize: "14px",
            }}
          >
            <span>By {blog.author}</span>
            <time dateTime={blog.createdAt}>Published {formatDate(blog.createdAt)}</time>
            <time dateTime={blog.updatedAt}>Updated {formatDate(blog.updatedAt)}</time>
          </div>
        </header>

        {blog.featuredImage && (
          <figure style={{ margin: "0 0 40px" }}>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              style={{
                width: "100%",
                maxHeight: "520px",
                objectFit: "cover",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </figure>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "32px",
          }}
        >
          <article
            aria-label={blog.title}
            style={{
              maxWidth: "760px",
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.8,
              fontSize: "17px",
            }}
          >
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            <section
              aria-labelledby="article-navigation"
              style={{
                marginTop: "40px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h2 id="article-navigation" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
                Continue Exploring
              </h2>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/blog" style={{ color: "#DE5E03" }}>
                  Browse all articles
                </Link>
                <Link
                  href={`/category/${encodeURIComponent(blog.category)}`}
                  style={{ color: "#DE5E03" }}
                >
                  More in {blog.category}
                </Link>
              </div>
            </section>

            {blog.tags?.length > 0 && (
              <section
                aria-labelledby="article-tags"
                style={{
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h2 id="article-tags" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
                  Topics Covered
                </h2>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        border: "1px solid rgba(255,255,255,0.14)",
                        borderRadius: "999px",
                        padding: "6px 12px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {blog.faq?.length > 0 && (
              <section
                aria-labelledby="blog-faq"
                style={{
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h2 id="blog-faq" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ display: "grid", gap: "14px" }}>
                  {blog.faq.map((item) => (
                    <details
                      key={item.question}
                      style={{
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "14px",
                        padding: "16px 18px",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <summary style={{ cursor: "pointer", fontWeight: 700 }}>
                        {item.question}
                      </summary>
                      <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.72)" }}>
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>

          {relatedBlogs.length > 0 && (
            <aside
              aria-labelledby="related-articles"
              style={{
                maxWidth: "760px",
                paddingTop: "8px",
              }}
            >
              <h2 id="related-articles" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
                Related Articles
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.slug}
                    href={`/blog/${relatedBlog.slug}`}
                    style={{
                      display: "block",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      padding: "18px 20px",
                      textDecoration: "none",
                      color: "#fff",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span style={{ display: "block", fontSize: "12px", color: "#DE5E03" }}>
                      {relatedBlog.category}
                    </span>
                    <span style={{ display: "block", fontSize: "18px", marginTop: "8px" }}>
                      {relatedBlog.title}
                    </span>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </section>

      <style jsx global>{`
        .blog-content h2 {
          color: #fff;
          font-size: 2rem;
          line-height: 1.2;
          margin: 40px 0 16px;
        }
        .blog-content h3 {
          color: #fff;
          font-size: 1.4rem;
          line-height: 1.3;
          margin: 28px 0 12px;
        }
        .blog-content p,
        .blog-content ul,
        .blog-content ol,
        .blog-content blockquote,
        .blog-content pre,
        .blog-content figure {
          margin: 0 0 20px;
        }
        .blog-content ul,
        .blog-content ol {
          padding-left: 24px;
        }
        .blog-content a {
          color: #de5e03;
          text-decoration: underline;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .blog-content blockquote {
          border-left: 4px solid #de5e03;
          padding: 16px 18px;
          color: rgba(255, 255, 255, 0.76);
          background: rgba(255, 255, 255, 0.03);
        }
        .blog-content pre {
          overflow-x: auto;
          padding: 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <Footer />
    </main>
  );
}
