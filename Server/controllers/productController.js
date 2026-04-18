/** @format */

import Product from "../models/productModel.js";
import cloudinary from "../configs/cloudinary.js";

// =====================
// GET ALL PRODUCTS
// =====================
export const getProducts = async (req, res) => {
  try {
    let {
      page = "1",
      limit = "10",
      category,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));

    const query = {
      isActive: true,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================
// GET SINGLE PRODUCT
// =====================
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================
// CREATE PRODUCT
// =====================
export const createProduct = async (req, res) => {
  try {
    let images = [];

    // Upload images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "E-Budget/products" },
            (error, result) => {
              if (error) return reject(error);
              if (result) {
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            },
          );
          stream.end(file.buffer);
        });
      });

      images = await Promise.all(uploadPromises);
    }

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Sizes
    let sizes = req.body.sizes || [];

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        sizes = sizes.split(",").map((s) => s.trim());
      }
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock) || 0,
      sizes,
      images,
      isFeatured: req.body.isFeatured || false,
      isActive: req.body.isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================
// UPDATE PRODUCT
// =====================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let images = [...existingProduct.images];

    // keep existing images
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        images = existingProduct.images.filter((img) =>
          req.body.existingImages.includes(img.url),
        );
      } else {
        images = existingProduct.images.filter(
          (img) => img.url === req.body.existingImages,
        );
      }
    }

    // upload new images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "E-Budget/products" },
            (error, result) => {
              if (error) return reject(error);
              if (result) {
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            },
          );
          stream.end(file.buffer);
        });
      });

      const newImages = await Promise.all(uploadPromises);
      images = [...images, ...newImages];
    }

    // sizes
    let sizes = req.body.sizes || existingProduct.sizes;

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        sizes = sizes.split(",").map((s) => s.trim());
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name || existingProduct.name,
        description: req.body.description || existingProduct.description,
        price: req.body.price ? Number(req.body.price) : existingProduct.price,
        category: req.body.category || existingProduct.category,
        stock: req.body.stock ? Number(req.body.stock) : existingProduct.stock,
        sizes,
        images,
        isFeatured:
          req.body.isFeatured !== undefined ?
            req.body.isFeatured
          : existingProduct.isFeatured,
        isActive:
          req.body.isActive !== undefined ?
            req.body.isActive
          : existingProduct.isActive,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================
// DELETE PRODUCT
// =====================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // delete images from cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
