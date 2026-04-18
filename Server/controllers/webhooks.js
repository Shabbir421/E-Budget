/** @format */

import { verifyWebhook } from "@clerk/express/webhooks";
import express from "express";
import User from "../models/userModel.js";

export const clerkWebhook = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = await User.findOne({ clerkId: evt.data.id });

      const userData = {
        clerkId: evt.data.id,
        email: evt.data?.email_addresses[0]?.email_address,
        name: evt.data?.first_name + " " + evt.data?.last_name,
        image: evt.data?.image_url,
      };

      if (user) {
        await User.findOneAndUpdate({ clerkId: evt.data.id }, userData);
      } else {
        await User.create(userData);
      }
    }

    return res.json({
      success: true,
      message: "webhook verified successfully",
    });
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return res.status(400).json({ error: "Error verifying webhook" });
  }
};
