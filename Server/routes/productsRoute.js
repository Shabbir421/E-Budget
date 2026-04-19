/** @format */

import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../configs/multer.js";
import { authorize, protect } from "../middleware/auth.js";

const ProductRoute = express.Router();

// GET all products
ProductRoute.get("/", getProducts);

// GET single product
ProductRoute.get("/:id", getSingleProduct);

// CREATE product (admin only)
ProductRoute.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  createProduct
);

// UPDATE product (admin only)
ProductRoute.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  updateProduct
);

// DELETE product (admin only)
ProductRoute.delete("/:id", protect, authorize("admin"), deleteProduct);

export default ProductRoute;