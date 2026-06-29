import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    // Check if an admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: "Setup has already been completed. Admin user already exists." },
        { status: 400 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password || username.trim() === "" || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid inputs. Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username: username.toLowerCase().trim(),
      passwordHash,
    });

    return NextResponse.json(
      { message: "Admin setup completed successfully", admin: { username: newAdmin.username } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
