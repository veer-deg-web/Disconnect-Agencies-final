import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { dbSafeError } from "@/lib/apiErrors";

/* GET /api/blogs/categories — List all categories with counts */
export async function GET() {
  try {
    await dbConnect();
    const categories = await Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
      })),
    });
  } catch (err: unknown) {
    console.error("Blog categories error:", err);
    return dbSafeError(err);
  }
}
