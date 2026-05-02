import React from "react";
import { Routes, Route } from "react-router-dom";

// User Pages
import Home from "./Pages/Home";
import Login from "./Pages/login";
import JoinUs from "./Pages/Joinus";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import ProductList from "./Pages/ProductList";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Account from "./Pages/Account";
import Orders from "./Pages/Orders";
import Wishlist from "./Pages/Wishlist";
import Support from "./Pages/Support";

// Admin Pages
import Dashboard from "./Admin/pages/Dashboard";
import User from "./Admin/pages/User";
import Product from "./Admin/pages/Product";
import AddProduct from "./Admin/pages/AddProduct";
import AdminOrders from "./Admin/pages/AdminOrders";

// Admin Route
import AdminRoutes from "./Admin/Routes/AdminRoutes";

const App = () => {
  return (
    <Routes>

      {/* User */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/account" element={<Account />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/support" element={<Support />} />
      <Route path="/login" element={<Login />} />
      <Route path="/joinus" element={<JoinUs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminRoutes><Dashboard /></AdminRoutes>} />
      <Route path="/admin/users" element={<AdminRoutes><User /></AdminRoutes>} />
      <Route path="/admin/products" element={<AdminRoutes><Product /></AdminRoutes>} />
      <Route path="/admin/add-product" element={<AdminRoutes><AddProduct /></AdminRoutes>} />
      <Route path="/admin/orders" element={<AdminRoutes><AdminOrders /></AdminRoutes>} />

    </Routes>
  );
};

export default App;
