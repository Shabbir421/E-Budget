/** @format */

import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const adminRoute = express.Router();

// Admin only access
adminRoute.get("/stats", protect, authorize("admin"), getDashboardStats);

export default adminRoute;
