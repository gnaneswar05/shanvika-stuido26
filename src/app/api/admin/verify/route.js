import dbConnect from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Admin from "@/lib/models/Admin";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const decoded = getAuthUser(req);
    
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await Admin.findById(decoded.id).select("-passwordHash");
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, admin });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
