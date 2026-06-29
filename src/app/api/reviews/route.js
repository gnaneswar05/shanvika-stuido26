import dbConnect from "@/lib/db";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { verifyAuth, getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET reviews. If public, gets approved reviews for a specific product.
// If admin, can retrieve all reviews or filter by status.
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product");
    const status = searchParams.get("status") || "approved";

    const filter = {};
    if (productId) filter.product = productId;

    // Check if user is admin
    const admin = getAuthUser(req);
    if (!admin) {
      // Force public users to only see approved reviews
      filter.status = "approved";
    } else if (status && status !== "all") {
      filter.status = status;
    }

    const reviews = await Review.find(filter)
      .populate("product", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Public POST create review (supports admin bypass auto-approval)
export async function POST(req) {
  try {
    await dbConnect();
    const { product, name, rating, comment } = await req.json();

    if (!product || !name || !rating || !comment) {
      return NextResponse.json(
        { error: "Product ID, name, rating, and comment are required." },
        { status: 400 }
      );
    }

    // Check if caller is admin for auto-approval
    let status = "pending";
    try {
      verifyAuth(req);
      status = "approved";
    } catch (authError) {
      // Keep pending for public customer review submission
    }

    const review = await Review.create({
      product,
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      status,
    });

    // Recalculate average rating if auto-approved
    if (status === "approved") {
      const productReviews = await Review.find({
        product: review.product,
        status: "approved",
      });
      
      const count = productReviews.length;
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 5;

      await Product.findByIdAndUpdate(review.product, {
        ratings: averageRating,
        reviewsCount: count,
      });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin PUT moderate review
export async function PUT(req) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, status } = await req.json();

    if (!reviewId || !status || !["pending", "approved"].includes(status)) {
      return NextResponse.json(
        { error: "Review ID and valid status (pending or approved) are required." },
        { status: 400 }
      );
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    review.status = status;
    await review.save();

    // Recalculate product rating if approved
    if (status === "approved") {
      const productReviews = await Review.find({
        product: review.product,
        status: "approved",
      });
      
      const count = productReviews.length;
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 5;

      await Product.findByIdAndUpdate(review.product, {
        ratings: averageRating,
        reviewsCount: count,
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin DELETE review
export async function DELETE(req) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Recalculate product rating
    const productReviews = await Review.find({
      product: review.product,
      status: "approved",
    });
    
    const count = productReviews.length;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 5;

    await Product.findByIdAndUpdate(review.product, {
      ratings: averageRating,
      reviewsCount: count,
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
