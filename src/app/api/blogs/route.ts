import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitizer";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { dbSafeError } from "@/lib/apiErrors";

/* GET /api/blogs — Public paginated blog listing */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const category = sanitizeInput(searchParams.get("category") || "");
    const search = sanitizeInput(searchParams.get("search") || "");

    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-content -faq")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    console.error("Blogs list error:", err);
    return dbSafeError(err);
  }
}
