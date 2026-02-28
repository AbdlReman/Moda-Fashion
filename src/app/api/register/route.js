import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { UserSchema } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const connection = await connectToDatabase();

    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const mongooseModule = await import("mongoose");
    const testDb = mongooseModule.default.connection.useDb("test");

    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      TestUser = testDb.model("User", UserSchema);
    }

    const existing = await TestUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await TestUser.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id?.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
