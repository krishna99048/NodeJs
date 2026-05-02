const userModel = require("../models/user_model");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const wishlistModel = require("../models/wishlist.model");

// Show all users
module.exports.getAllUser = async () => {
  return await userModel.find();
};

// Delete user
module.exports.deleteUser = async (id) => {
  return await userModel.findOneAndDelete({ _id: id });
};

// Update user role
module.exports.updateUserRole = async ({ userId, role }) => {
  return await userModel.findOneAndUpdate(
    { _id: userId },
    { role },
    { new: true }
  );
};

// Show all orders
module.exports.getAllOrders = async () => {
  return await orderModel
    .find()
    .populate("userId", "fullname email")
    .populate("items.productId", "name price images")
    .sort({ createdAt: -1 });
};

// Show all carts
module.exports.getAllCarts = async () => {
  return await cartModel
    .find()
    .populate("userId")
    .populate("items.productId");
};

// Show all wishlists
module.exports.getAllWishlists = async () => {
  return await wishlistModel
    .find()
    .populate("userId")
    .populate("productIds");
};