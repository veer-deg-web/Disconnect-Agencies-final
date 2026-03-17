import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Blog.distinct("category");
    
    // Default categories if none exist
    const defaults = ["Web Development", "AI & Data", "Engineering", "Cloud", "UI/UX Design", "Mobile Development", "SEO", "Business"];
    const result = Array.from(new Set([...defaults, ...categories])).sort();
    
    return NextResponse.json({ categories: result });
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
