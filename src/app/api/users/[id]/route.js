import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User, { UserSchema } from "@/models/User";
import mongoose from "mongoose";

// Force dynamic rendering since this route uses database and dynamic params
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectToDatabase();

    // Switch to 'test' database using useDb() (doesn't create new connection)
    const mongooseModule = await import("mongoose");
    const testDb = mongooseModule.default.connection.useDb("test");

    // Get or create User model for test database
    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      // Register the model on test database - use the exported schema directly
      TestUser = testDb.model("User", UserSchema);
    }

    // Fetch user from test database
    let user;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await TestUser.findById(id).lean();
    } else {
      user = await TestUser.findOne({ _id: id }).lean();
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove passwordHash
    const { passwordHash, ...userWithoutPassword } = user;
    return NextResponse.json({
      ...userWithoutPassword,
      id: user._id.toString(),
      likeCount: user.likedBy?.length || 0, // Number of people who liked this profile
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error?.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const connection = await connectToDatabase();
    const dbName = connection.connection?.name;
    console.log("Edit User - Current database:", dbName);

    if (dbName !== "test") {
      console.error(
        "❌ WARNING: Not connected to test database! Current:",
        dbName,
      );
    }

    const form = await request.formData();

    // Extract form fields
    const firstName = form.get("firstName")?.toString() || "";
    const lastName = form.get("lastName")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const country = form.get("country")?.toString() || "";
    const education = form.get("education")?.toString() || "";
    const height = form.get("height")?.toString() || "";
    const weight = form.get("weight")?.toString() || "";
    const dateOfBirth = form.get("dateOfBirth")?.toString() || "";
    const maritalStatus = form.get("maritalStatus")?.toString() || "";
    const gender = form.get("gender")?.toString() || "";
    const ethnicity = form.get("ethnicity")?.toString() || "";
    const religion = form.get("religion")?.toString() || "";
    const hobbies = form.get("hobbies")?.toString() || "";
    const qualifications = form.get("qualifications")?.toString() || "";
    const occupation = form.get("occupation")?.toString() || "";
    const aboutMe = form.get("aboutMe")?.toString() || "";
    const role = form.get("role")?.toString() || "user";

    // Get files
    const profilePhotoFile = form.get("profilePhoto");
    const identityDocumentFile = form.get("identityDocument");

    console.log("Files received:", {
      hasProfilePhoto: !!profilePhotoFile,
      hasIdentityDocument: !!identityDocumentFile,
      profilePhotoType: profilePhotoFile?.constructor?.name,
      profilePhotoSize: profilePhotoFile?.size,
      identityDocType: identityDocumentFile?.constructor?.name,
      identityDocSize: identityDocumentFile?.size,
    });

    // Ensure connected first
    await connectToDatabase();

    // Switch to 'test' database using useDb() (doesn't create new connection)
    const mongooseModule = await import("mongoose");
    const testDb = mongooseModule.default.connection.useDb("test");

    // Get or create User model for test database
    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      // Register the model on test database - use the exported schema directly
      TestUser = testDb.model("User", UserSchema);
    }

    // Find user in test database
    let user;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await TestUser.findById(id).lean();
    } else {
      user = await TestUser.findOne({ _id: id }).lean();
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Upload new files to Cloudinary if provided
    let profilePhotoUrl = user.profilePhotoUrl || "";
    let profilePhotoPublicId = user.profilePhotoPublicId || "";
    let identityDocumentUrl = user.identityDocumentUrl || "";
    let identityDocumentPublicId = user.identityDocumentPublicId || "";

    // Check Cloudinary configuration before proceeding
    const cloudinaryConfig = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
    };

    console.log("Cloudinary config check:", {
      cloudName: cloudinaryConfig.cloudName ? "SET" : "MISSING",
      apiKey: cloudinaryConfig.apiKey ? "SET" : "MISSING",
      apiSecret: cloudinaryConfig.apiSecret,
    });

    if (
      !cloudinaryConfig.cloudName ||
      !cloudinaryConfig.apiKey ||
      cloudinaryConfig.apiSecret === "MISSING"
    ) {
      return NextResponse.json(
        {
          message: "Cloudinary configuration is missing",
          error:
            "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file",
        },
        { status: 500 },
      );
    }

    const { uploadToCloudinary, deleteFromCloudinary } =
      await import("@/lib/cloudinary");

    // Check if profile photo file was uploaded
    const hasProfilePhoto =
      profilePhotoFile &&
      (profilePhotoFile instanceof File ||
        (typeof profilePhotoFile === "object" &&
          (profilePhotoFile.size > 0 || profilePhotoFile.length > 0)));

    if (hasProfilePhoto) {
      try {
        const fileInfo = {
          name: profilePhotoFile.name || profilePhotoFile.filename || "unknown",
          size: profilePhotoFile.size || profilePhotoFile.length || 0,
          type:
            profilePhotoFile.type || profilePhotoFile.contentType || "unknown",
          constructor: profilePhotoFile.constructor?.name || "unknown",
        };

        console.log("Uploading profile photo to Cloudinary...", fileInfo);

        if (fileInfo.size === 0) {
          throw new Error("File is empty (size: 0)");
        }

        // Delete old photo if exists (non-blocking)
        if (user.profilePhotoPublicId) {
          try {
            await deleteFromCloudinary(user.profilePhotoPublicId);
            console.log("Deleted old profile photo from Cloudinary");
          } catch (deleteError) {
            console.warn(
              "Could not delete old profile photo (non-fatal):",
              deleteError.message,
            );
          }
        }

        // Upload new photo
        const result = await uploadToCloudinary(
          profilePhotoFile,
          "matrimonial/profile-photos",
        );

        // Verify we got a Cloudinary URL
        if (!result || !result.url) {
          throw new Error("No URL returned from Cloudinary upload");
        }

        if (
          !result.url.includes("cloudinary.com") ||
          result.url.includes("localhost")
        ) {
          throw new Error(`Invalid Cloudinary URL returned: ${result.url}`);
        }

        profilePhotoUrl = result.url;
        profilePhotoPublicId = result.public_id;
        console.log(
          "✅ Profile photo uploaded successfully to Cloudinary:",
          result.url,
        );
      } catch (error) {
        console.error("❌ Error uploading profile photo:", {
          message: error.message,
          stack: error.stack,
          file: {
            name: profilePhotoFile?.name,
            size: profilePhotoFile?.size,
            type: profilePhotoFile?.type,
          },
        });
        return NextResponse.json(
          {
            message: "Failed to upload profile photo",
            error: error?.message || "Unknown error",
            details:
              process.env.NODE_ENV === "development" ? error.stack : undefined,
          },
          { status: 500 },
        );
      }
    }

    // Check if identity document file was uploaded
    const hasIdentityDocument =
      identityDocumentFile &&
      (identityDocumentFile instanceof File ||
        (typeof identityDocumentFile === "object" &&
          (identityDocumentFile.size > 0 || identityDocumentFile.length > 0)));

    if (hasIdentityDocument) {
      try {
        const fileInfo = {
          name:
            identityDocumentFile.name ||
            identityDocumentFile.filename ||
            "unknown",
          size: identityDocumentFile.size || identityDocumentFile.length || 0,
          type:
            identityDocumentFile.type ||
            identityDocumentFile.contentType ||
            "unknown",
          constructor: identityDocumentFile.constructor?.name || "unknown",
        };

        console.log("Uploading identity document to Cloudinary...", fileInfo);

        if (fileInfo.size === 0) {
          throw new Error("File is empty (size: 0)");
        }

        // Delete old document if exists (non-blocking)
        if (user.identityDocumentPublicId) {
          try {
            await deleteFromCloudinary(user.identityDocumentPublicId);
            console.log("Deleted old identity document from Cloudinary");
          } catch (deleteError) {
            console.warn(
              "Could not delete old identity document (non-fatal):",
              deleteError.message,
            );
          }
        }

        // Upload new document
        const result = await uploadToCloudinary(
          identityDocumentFile,
          "matrimonial/identity-documents",
        );

        // Verify we got a Cloudinary URL
        if (!result || !result.url) {
          throw new Error("No URL returned from Cloudinary upload");
        }

        if (
          !result.url.includes("cloudinary.com") ||
          result.url.includes("localhost")
        ) {
          throw new Error(`Invalid Cloudinary URL returned: ${result.url}`);
        }

        identityDocumentUrl = result.url;
        identityDocumentPublicId = result.public_id;
        console.log(
          "✅ Identity document uploaded successfully to Cloudinary:",
          result.url,
        );
      } catch (error) {
        console.error("❌ Error uploading identity document:", {
          message: error.message,
          stack: error.stack,
          file: {
            name: identityDocumentFile?.name,
            size: identityDocumentFile?.size,
            type: identityDocumentFile?.type,
          },
        });
        return NextResponse.json(
          {
            message: "Failed to upload identity document",
            error: error?.message || "Unknown error",
            details:
              process.env.NODE_ENV === "development" ? error.stack : undefined,
          },
          { status: 500 },
        );
      }
    }

    // Update user - ONLY if we have Cloudinary URLs (not localhost)
    const updateData = {
      firstName,
      lastName,
      email,
      country,
      education,
      height,
      weight,
      dateOfBirth,
      maritalStatus,
      gender,
      ethnicity,
      religion,
      hobbies,
      qualifications,
      occupation,
      aboutMe,
      role,
    };

    // Only update image URLs if they are Cloudinary URLs
    if (
      profilePhotoUrl &&
      profilePhotoUrl.includes("cloudinary.com") &&
      !profilePhotoUrl.includes("localhost")
    ) {
      updateData.profilePhotoUrl = profilePhotoUrl;
      updateData.profilePhotoPublicId = profilePhotoPublicId;
      console.log("Updating profilePhotoUrl in database:", profilePhotoUrl);
    }

    if (
      identityDocumentUrl &&
      identityDocumentUrl.includes("cloudinary.com") &&
      !identityDocumentUrl.includes("localhost")
    ) {
      updateData.identityDocumentUrl = identityDocumentUrl;
      updateData.identityDocumentPublicId = identityDocumentPublicId;
      console.log(
        "Updating identityDocumentUrl in database:",
        identityDocumentUrl,
      );
    }

    console.log("Final update data:", {
      ...updateData,
      profilePhotoUrl: updateData.profilePhotoUrl ? "SET (hidden)" : "NOT SET",
      identityDocumentUrl: updateData.identityDocumentUrl
        ? "SET (hidden)"
        : "NOT SET",
    });

    // Debug: Show what we're about to save
    console.log("═══════════════════════════════════════════════");
    console.log("Edit User - updateData BEFORE saving:");
    console.log("Has profilePhotoUrl:", !!updateData.profilePhotoUrl);
    console.log("Has identityDocumentUrl:", !!updateData.identityDocumentUrl);
    console.log("updateData keys:", Object.keys(updateData));
    console.log("═══════════════════════════════════════════════");

    // Update user in test database
    const updatedUser = await TestUser.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    // Debug: Show what was actually saved
    console.log("═══════════════════════════════════════════════");
    console.log("✅ User updated in test.users database:", updatedUser._id);
    console.log("Edit User - AFTER saving (from database):");
    console.log(
      "profilePhotoUrl:",
      updatedUser.profilePhotoUrl || "EMPTY/MISSING",
    );
    console.log(
      "profilePhotoPublicId:",
      updatedUser.profilePhotoPublicId || "EMPTY/MISSING",
    );
    console.log(
      "identityDocumentUrl:",
      updatedUser.identityDocumentUrl || "EMPTY/MISSING",
    );
    console.log(
      "identityDocumentPublicId:",
      updatedUser.identityDocumentPublicId || "EMPTY/MISSING",
    );

    // Verify saved data matches what we intended to save
    if (updateData.profilePhotoUrl && !updatedUser.profilePhotoUrl) {
      console.error(
        "❌ WARNING: profilePhotoUrl was in updateData but NOT saved to database!",
      );
    }
    if (updateData.identityDocumentUrl && !updatedUser.identityDocumentUrl) {
      console.error(
        "❌ WARNING: identityDocumentUrl was in updateData but NOT saved to database!",
      );
    }
    console.log("═══════════════════════════════════════════════");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Failed to update user" },
        { status: 500 },
      );
    }

    const { passwordHash, ...userResponse } = updatedUser;

    // Verify the saved URLs are Cloudinary URLs
    if (
      userResponse.profilePhotoUrl &&
      userResponse.profilePhotoUrl.includes("localhost")
    ) {
      console.error("WARNING: Profile photo URL is localhost, not Cloudinary!");
    }
    if (
      userResponse.identityDocumentUrl &&
      userResponse.identityDocumentUrl.includes("localhost")
    ) {
      console.error(
        "WARNING: Identity document URL is localhost, not Cloudinary!",
      );
    }

    return NextResponse.json({
      ...userResponse,
      id: userResponse._id.toString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error?.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    // Switch to 'test' database using useDb() (doesn't create new connection)
    const mongooseModule = await import("mongoose");
    const testDb = mongooseModule.default.connection.useDb("test");

    // Get or create User model for test database
    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      // Register the model on test database - use the exported schema directly
      TestUser = testDb.model("User", UserSchema);
    }

    // Delete user from test database
    const user = await TestUser.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user", error: error?.message },
      { status: 500 },
    );
  }
}
