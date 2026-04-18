import { clerkClient } from "@clerk/express";
import User from "../models/userModel.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error("ADMIN_EMAIL is not defined in .env");
    }

    // 1. Find user in MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found in MongoDB");
      return;
    }

    if (!user.clerkId) {
      console.log("Clerk ID missing for user");
      return;
    }

    // 2. Update MongoDB role
    await User.updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    // 3. Update Clerk metadata
    await clerkClient.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        role: "admin",
      },
    });

    console.log("✅ User promoted to admin successfully");
  } catch (error) {
    console.error("Error making user admin:", error);
  }
};

export default makeAdmin;