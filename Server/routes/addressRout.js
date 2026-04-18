/** @format */

import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/auth.js";

const addressRoute = express.Router();

//  Get all user addresses
addressRoute.get("/", protect, getAddresses);

//  Add new address
addressRoute.post("/", protect, addAddress);

//  Update address
addressRoute.put("/:id", protect, updateAddress);

//  Delete address
addressRoute.delete("/:id", protect, deleteAddress);

export default addressRoute;
