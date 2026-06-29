import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Public GET single category
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin PUT update category
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, slug, image, description, orderIndex } = await req.json();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (name) category.name = name.trim();
    if (image) category.image = image;
    if (description !== undefined) category.description = description.trim();
    if (orderIndex !== undefined) category.orderIndex = Number(orderIndex) || 0;

    if (slug) {
      const formattedSlug = slug.toLowerCase().replace(/\s+/g, "-").trim();
      if (formattedSlug !== category.slug) {
        const existing = await Category.findOne({ slug: formattedSlug });
        if (existing) {
          return NextResponse.json(
            { error: "Category slug already exists" },
            { status: 400 }
          );
        }
        category.slug = formattedSlug;
      }
    }

    await category.save();
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin DELETE category
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
