/** @format */

import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// get dashboard stats
// get /api/admin/stats

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find().sort({ createdAt: -1 });

    const totalOrders = orders.length;

    let totalRevenue = 0;

    const validOrders = orders.filter(
      (order) => order.orderStatus !== "cancelled",
    );

    validOrders.forEach((order) => {
      totalRevenue += order.totalAmount;
    });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("orderItems.product");

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        validOrders: validOrders.length,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
