/** @format */

import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import ProductRoute from "./routes/productsRoute.js";
import cartRoute from "./routes/cartsRoute.js";
import orderRoute from "./routes/ordersRoute.js";
import cloudinary from "./configs/cloudinary.js";
import addressRoute from "./routes/addressRout.js";
import adminRoute from "./routes/adminRoute.js";
import { seedProducts } from "./scripts/seedProducts.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

//! database
await connectDB();

//! Webhooks
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

//! Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//! Routes
app.get("/", async (req, res) => {
  res.send("Servggggzzer is Live!");
});

//! Routes created
app.use("/api/products", ProductRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/addresses", addressRoute);
app.use("/api/admin", adminRoute);

await makeAdmin();

//seed dummy products
await seedProducts(process.env.MONGODB_URI);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
