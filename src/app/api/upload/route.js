import cloudinary from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Auth Check
    try {
      verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Upload to Cloudinary
    // The image can be a base64 data URI (e.g. data:image/webp;base64,...)
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "shanvika_studio",
      resource_type: "auto",
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
