/** @format */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    sizes: [
      {
        type: String, // e.g. S, M, L, XL
      },
    ],

    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Shoes", "Bags", "Other"],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
