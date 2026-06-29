import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Public GET single product (by ID or Slug)
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id)
        .populate("category", "name slug")
        .populate("completeTheLook", "name slug basePrice originalPrice images sizes")
        .populate("frequentlyBoughtTogether", "name slug basePrice originalPrice images sizes");
    } else {
      product = await Product.findOne({ slug: id })
        .populate("category", "name slug")
        .populate("completeTheLook", "name slug basePrice originalPrice images sizes")
        .populate("frequentlyBoughtTogether", "name slug basePrice originalPrice images sizes");
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin PUT update product
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
    const data = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update fields if provided
    if (data.name !== undefined) product.name = data.name.trim();
    if (data.images !== undefined) product.images = data.images;
    if (data.videoUrl !== undefined) product.videoUrl = data.videoUrl;
    if (data.description !== undefined) product.description = data.description.trim();
    if (data.details !== undefined) product.details = data.details;
    if (data.basePrice !== undefined) product.basePrice = Number(data.basePrice);
    if (data.originalPrice !== undefined) product.originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
    if (data.sizes !== undefined) product.sizes = data.sizes;
    if (data.colors !== undefined) product.colors = data.colors;
    if (data.category !== undefined) product.category = data.category;
    if (data.fabric !== undefined) product.fabric = data.fabric;
    if (data.washCare !== undefined) product.washCare = data.washCare;
    
    product.isTrending = data.isTrending !== undefined ? !!data.isTrending : product.isTrending;
    product.isBestSeller = data.isBestSeller !== undefined ? !!data.isBestSeller : product.isBestSeller;
    product.isFeatured = data.isFeatured !== undefined ? !!data.isFeatured : product.isFeatured;
    product.isFlashSale = data.isFlashSale !== undefined ? !!data.isFlashSale : product.isFlashSale;
    
    if (data.flashSaleEnd !== undefined) {
      product.flashSaleEnd = data.flashSaleEnd ? new Date(data.flashSaleEnd) : undefined;
    }
    
    if (data.completeTheLook !== undefined) product.completeTheLook = data.completeTheLook;
    if (data.frequentlyBoughtTogether !== undefined) product.frequentlyBoughtTogether = data.frequentlyBoughtTogether;

    if (data.slug) {
      const formattedSlug = data.slug.toLowerCase().replace(/\s+/g, "-").trim();
      if (formattedSlug !== product.slug) {
        const existing = await Product.findOne({ slug: formattedSlug });
        if (existing) {
          return NextResponse.json(
            { error: "Product slug already exists" },
            { status: 400 }
          );
        }
        product.slug = formattedSlug;
      }
    }

    await product.save();
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin DELETE product
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
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
