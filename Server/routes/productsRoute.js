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

//get all products
ProductRoute.get("/", getProducts);

//get single product
ProductRoute.get("/:id", getSingleProduct);

//add new product admin only
ProductRoute.post(
  "/",
  upload.array("images", 5),
  protect,
  authorize("admin"),
  createProduct,
);

// updateProduct admin only
ProductRoute.put(
  "/:id",
  upload.array("images", 5),
  protect,
  authorize("admin"),
  updateProduct,
);

//delete product admin only
ProductRoute.delete("/:id", protect, authorize("admin"), deleteProduct);

export default ProductRoute;
