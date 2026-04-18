/** @format */

import express from "express";
import {
  getOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/auth.js";

const orderRoute = express.Router();

orderRoute.get("/", protect, getOrders);
orderRoute.get("/:id", protect, getSingleOrder);
orderRoute.post("/", protect, createOrder);
orderRoute.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
orderRoute.get("/admin/all", protect, authorize("admin"), getAllOrders);

export default orderRoute;
