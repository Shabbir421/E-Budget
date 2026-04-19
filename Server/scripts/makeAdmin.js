/** @format */

import { clerkClient } from "@clerk/express";
import User from "../models/userModel.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error("ADMIN_EMAIL is not defined in .env");
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true },
    );

    if (!updatedUser) {
      console.log("User not found in MongoDB");
      return;
    }

    if (!updatedUser.clerkId) {
      console.log("Clerk ID missing for user");
      return;
    }

    await clerkClient.users.updateUserMetadata(updatedUser.clerkId, {
      publicMetadata: {
        role: "admin",
      },
    });

    console.log("User promoted to admin successfully");
    console.log("Updated role:", updatedUser.role);
  } catch (error) {
    console.error("Error making user admin:", error);
  }
};

export default makeAdmin;
