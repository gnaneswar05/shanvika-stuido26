import dbConnect from "@/lib/db";
import Setting from "@/lib/models/Setting";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Public GET settings
export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Setting.create({
        whatsappNumber: "+919876543210",
        shippingFee: 100,
        freeShippingThreshold: 2000,
        allowedPincodes: "1100*, 400*, 560*, 600*, 700*",
        promoBanner: "Exclusive Summer Luxury Edition: Free shipping on orders above ₹2000!",
        logoUrl: "/logo.jpg",
        slogan: "Confidence in Every Outfit",
        brandName: "Shanvika Studio",
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin PUT update settings
export async function PUT(req) {
  try {
    await dbConnect();

    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (data.whatsappNumber !== undefined) settings.whatsappNumber = data.whatsappNumber.trim();
    if (data.shippingFee !== undefined) settings.shippingFee = Number(data.shippingFee) || 0;
    if (data.freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(data.freeShippingThreshold) || 0;
    if (data.allowedPincodes !== undefined) settings.allowedPincodes = data.allowedPincodes.trim();
    if (data.promoBanner !== undefined) settings.promoBanner = data.promoBanner.trim();
    if (data.logoUrl !== undefined) settings.logoUrl = data.logoUrl.trim();
    if (data.slogan !== undefined) settings.slogan = data.slogan.trim();
    if (data.brandName !== undefined) settings.brandName = data.brandName.trim();

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
