const userModel = require("../models/user_model");
const adminService = require("../services/admin.service");

// Get all users
module.exports.AllUser = async (req, res) => {
  try {
    const users = await adminService.getAllUser();

    return res.status(200).json({
      message: "User Fetch Successfully",
      users,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await adminService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Update user role
module.exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(401).json({
        message: "Access Denied",
      });
    }

    const user = await adminService.updateUserRole({ userId, role });

    if (!user) {
      throw new Error("User Not Found!");
    }

    return res.status(200).json({
      message: "User Role Updated Successfully !!",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Get all orders
module.exports.AllOrders = async (req, res) => {
  try {
    const orders = await adminService.getAllOrders();

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      createdAt: order.createdAt || new Date(),
      status: order.status || "pending",

      customer: order.userId
        ? {
            id: order.userId._id,
            name: order.userId.fullname || "Customer",
            email: order.userId.email || "",
          }
        : {
            id: null,
            name: "Customer",
            email: "",
          },

      items: (order.items || []).map((item) => ({
        id: item.productId?._id || item.productId,
        name: item.productId?.name || "Product",
        image: item.productId?.images?.[0] || "",
        quantity: item.quantity || 1,
        price: item.price || 0,
        total: item.total || item.price * item.quantity || 0,
      })),

      summary: {
        subtotal: order.totalbill || 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: order.totalbill || 0,
      },
    }));

    return res.status(200).json({
      message: "Orders Fetch Successfully",
      orders: formattedOrders,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Get all carts
module.exports.AllCarts = async (req, res) => {
  try {
    const carts = await adminService.getAllCarts();

    return res.status(200).json({
      message: "Carts Fetch Successfully",
      carts,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Get all wishlists
module.exports.AllWishlists = async (req, res) => {
  try {
    const wishlists = await adminService.getAllWishlists();

    return res.status(200).json({
      message: "Wishlists Fetch Successfully",
      wishlists,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};