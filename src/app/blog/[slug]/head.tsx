import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { buildProfessionalMetaDescription, buildProfessionalMetaTitle } from "@/lib/blogSeo";

interface Props {
  params: { slug: string };
}

export default async function Head({ params }: Props) {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug: params.slug, status: "published" })
      .select("title excerpt metaTitle metaDescription content")
      .lean();

    if (!blog) {
      return (
        <>
          <title>Blog Article | Disconnect</title>
          <meta
            name="description"
            content="Read professional technology insights and implementation guidance from Disconnect."
          />
        </>
      );
    }

    const title = buildProfessionalMetaTitle(String(blog.title || ""), String(blog.metaTitle || ""));
    const description = buildProfessionalMetaDescription({
      provided: String(blog.metaDescription || ""),
      excerpt: String(blog.excerpt || ""),
      content: String(blog.content || ""),
      title: String(blog.title || ""),
    });

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  } catch {
    return (
      <>
        <title>Blog Article | Disconnect</title>
        <meta
          name="description"
          content="Read professional technology insights and implementation guidance from Disconnect."
        />
      </>
    );
  }
}
