import dbConnect from "@/lib/db";
import Analytics from "@/lib/models/Analytics";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Public POST track event
export async function POST(req) {
  try {
    await dbConnect();
    const { eventType, targetId, device, referrer } = await req.json();

    if (!eventType || !targetId) {
      return NextResponse.json({ error: "eventType and targetId are required" }, { status: 400 });
    }

    const event = await Analytics.create({
      eventType,
      targetId,
      device: device || "desktop",
      referrer: referrer || "",
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin GET reports and aggregates
export async function GET(req) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basic Counts
    const totalViews = await Analytics.countDocuments({ eventType: "view" });
    const totalClicks = await Analytics.countDocuments({ eventType: "whatsapp_click" });
    const totalSearches = await Analytics.countDocuments({ eventType: "search" });
    const totalWishlist = await Analytics.countDocuments({ eventType: "wishlist_add" });

    // Device distribution
    const devices = await Analytics.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } }
    ]);

    // Top Products Viewed (eventType = "view")
    const topViews = await Analytics.aggregate([
      { $match: { eventType: "view" } },
      { $group: { _id: "$targetId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Populate top products details
    const topProducts = await Promise.all(
      topViews.map(async (item) => {
        const product = await Product.findOne({ slug: item._id })
          .select("name images basePrice category")
          .populate("category", "name");
        return {
          slug: item._id,
          views: item.count,
          product: product || { name: item._id, images: [] },
        };
      })
    );

    // Top Searches
    const topSearches = await Analytics.aggregate([
      { $match: { eventType: "search" } },
      { $group: { _id: "$targetId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return NextResponse.json({
      summary: {
        views: totalViews,
        whatsappClicks: totalClicks,
        searches: totalSearches,
        wishlistAdds: totalWishlist,
      },
      devices: devices.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      topProducts,
      topSearches: topSearches.map(item => ({ query: item._id, count: item.count })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
