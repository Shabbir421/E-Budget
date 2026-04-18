/** @format */

import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// ======================
// GET USER ORDERS
// ======================
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// GET SINGLE ORDER
// ======================
export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Single Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// CREATE ORDER FROM CART
// ======================
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { shippingAddress, paymentMethod } = req.body;

    // get cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let subtotal = 0;

    const orderItems = cart.items.map((item) => {
      const product = item.product;

      subtotal += product.price * item.quantity;

      return {
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
      };
    });

    const shippingCost = 50;
    const tax = subtotal * 0.1;

    const totalAmount = subtotal + shippingCost + tax;

    const order = await Order.create({
      user: userId,
      orderNumber: `ORD-${Date.now()}`,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
    });

    // clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// UPDATE ORDER STATUS
// ======================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatus = [
      "placed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// GET ALL ORDERS (ADMIN)
// ======================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
