import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();

    // Verify admin authentication session
    let adminPayload;
    try {
      adminPayload = verifyAuth(req);
    } catch (authError) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Find admin user record
    const admin = await Admin.findById(adminPayload.id);
    if (!admin) {
      return NextResponse.json({ error: "Administrator account not found." }, { status: 404 });
    }

    // Check current password correctness
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
