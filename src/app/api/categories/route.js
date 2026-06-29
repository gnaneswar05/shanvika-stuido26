import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Public GET all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ orderIndex: 1, name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin POST create category
export async function POST(req) {
  try {
    await dbConnect();
    
    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, image, description, orderIndex } = await req.json();

    if (!name || !slug || !image) {
      return NextResponse.json(
        { error: "Name, slug, and image are required" },
        { status: 400 }
      );
    }

    const formattedSlug = slug.toLowerCase().replace(/\s+/g, "-").trim();
    
    // Check if slug exists
    const existing = await Category.findOne({ slug: formattedSlug });
    if (existing) {
      return NextResponse.json(
        { error: "Category slug already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name: name.trim(),
      slug: formattedSlug,
      image,
      description: description?.trim() || "",
      orderIndex: Number(orderIndex) || 0,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
