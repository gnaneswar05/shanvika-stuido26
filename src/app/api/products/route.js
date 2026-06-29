import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Public GET products with search, filters, pagination
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // Filter params
    const query = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;
    const size = searchParams.get("size") || "";
    const isTrending = searchParams.get("isTrending") === "true";
    const isBestSeller = searchParams.get("isBestSeller") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";
    const isFlashSale = searchParams.get("isFlashSale") === "true";
    const sort = searchParams.get("sort") || "newest";

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    const filter = {};

    // Text search
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { fabric: { $regex: query, $options: "i" } },
      ];
    }

    // Category filter
    if (categorySlug) {
      const categoryObj = await Category.findOne({ slug: categorySlug });
      if (categoryObj) {
        filter.category = categoryObj._id;
      } else {
        // Return empty if category is valid but not found
        return NextResponse.json({ products: [], totalPages: 0, currentPage: page, totalProducts: 0 });
      }
    }

    // Price range filter (basePrice)
    filter.basePrice = { $gte: minPrice };
    if (maxPrice !== Infinity) {
      filter.basePrice.$lte = maxPrice;
    }

    // Size filter
    if (size) {
      filter["sizes.size"] = size;
    }

    // Boolean flags
    if (isTrending) filter.isTrending = true;
    if (isBestSeller) filter.isBestSeller = true;
    if (isFeatured) filter.isFeatured = true;
    if (isFlashSale) filter.isFlashSale = true;

    // Sorting
    let sortObj = { createdAt: -1 }; // newest default
    if (sort === "price_asc") sortObj = { basePrice: 1 };
    else if (sort === "price_desc") sortObj = { basePrice: -1 };
    else if (sort === "trending") sortObj = { isTrending: -1, createdAt: -1 };
    else if (sort === "bestseller") sortObj = { isBestSeller: -1, createdAt: -1 };
    else if (sort === "rating") sortObj = { ratings: -1 };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin POST create product
export async function POST(req) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.name || !data.slug || !data.images || data.images.length === 0 || !data.basePrice || !data.category || !data.description) {
      return NextResponse.json(
        { error: "Required fields missing: name, slug, images, basePrice, category, and description are mandatory." },
        { status: 400 }
      );
    }

    const formattedSlug = data.slug.toLowerCase().replace(/\s+/g, "-").trim();
    const existing = await Product.findOne({ slug: formattedSlug });
    if (existing) {
      return NextResponse.json(
        { error: "Product slug already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: data.name.trim(),
      slug: formattedSlug,
      images: data.images,
      videoUrl: data.videoUrl || "",
      description: data.description.trim(),
      details: data.details || [],
      basePrice: Number(data.basePrice),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      sizes: data.sizes || [],
      colors: data.colors || [],
      category: data.category,
      fabric: data.fabric || "Premium Luxury Fabric",
      washCare: data.washCare || "Dry Clean Only",
      isTrending: !!data.isTrending,
      isBestSeller: !!data.isBestSeller,
      isFeatured: !!data.isFeatured,
      isFlashSale: !!data.isFlashSale,
      flashSaleEnd: data.flashSaleEnd ? new Date(data.flashSaleEnd) : undefined,
      completeTheLook: data.completeTheLook || [],
      frequentlyBoughtTogether: data.frequentlyBoughtTogether || [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
