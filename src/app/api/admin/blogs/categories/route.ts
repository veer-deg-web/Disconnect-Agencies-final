export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAdminToken } from "@/lib/adminAuth";
import { apiError, dbSafeError, ErrorCode } from "@/lib/apiErrors";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const categories = await Blog.distinct("category");

    // Default categories if none exist
    const defaults = ["Web Development", "AI & Data", "Engineering", "Cloud", "UI/UX Design", "Mobile Development", "SEO", "Business"];
    const result = Array.from(new Set([...defaults, ...categories])).sort();

    return NextResponse.json({ categories: result });
  } catch (err: unknown) {
    console.error("Admin blog categories error:", err);
    return dbSafeError(err);
  }
}
