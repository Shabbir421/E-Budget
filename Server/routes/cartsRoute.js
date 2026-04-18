/** @format */

import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const cartRoute = express.Router();

// 🟢 Get user cart
cartRoute.get("/", protect, getCart);

// 🟡 Add to cart
cartRoute.post("/add", protect, addToCart);

// 🔵 Update cart item (quantity / size)
cartRoute.put("/item/:productId", protect, updateCartItem);

// 🔴 Remove single item
cartRoute.delete("/item/:productId", protect, removeFromCartItem);

// ⚫ Clear entire cart
cartRoute.delete("/", protect, clearCart);

export default cartRoute;
