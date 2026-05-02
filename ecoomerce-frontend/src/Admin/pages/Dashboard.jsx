import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { Users, Package, ShoppingBag, TrendingUp, Sparkles, Plus } from "lucide-react";
import api from "../../Services/api";
import { fetchDatabaseOrders } from "../../utils/customerData";
import { formatPrice } from "../../utils/storefront";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    todayOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const usersRes = await api.get("/admin/all/user");
        const usersCount = usersRes.data.users?.length || 0;

        const productsRes = await api.get("/product/all");
        const productsCount = productsRes.data.products?.length || productsRes.data?.length || 0;

        const orders = await fetchDatabaseOrders([]);
        const ordersCount = orders.length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today;
        }).length;

        setStats({
          users: usersCount,
          products: productsCount,
          orders: ordersCount,
          todayOrders
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
      {/* Sidebar Integration */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 lg:p-12">
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-0.5 w-8 bg-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">
                  Management Console
                </span>
              </div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-3">
                ASTRA <Sparkles className="text-amber-500 h-6 w-6" />
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Welcome back. Your luxury empire is performing beautifully today.
              </p>
            </div>

            {/* <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
              <Plus size={16} /> Add New Product
            </button> */}
          </div>

          {/* Key Performance Indicators (KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

            {/* Total Users Card */}
            <div className="group relative bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                <Users size={140} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mb-6">
                  <Users size={22} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                  Community Size
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2 tracking-tighter">
                  {loading ? "..." : stats.users}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter bg-emerald-50 w-fit px-3 py-1 rounded-full">
                  <TrendingUp size={12} /> +12% vs last month
                </div>
              </div>
            </div>

            {/* Total Products Card */}
            <div className="group relative bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                <Package size={140} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mb-6">
                  <Package size={22} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-600 transition-colors">
                  Inventory
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2 tracking-tighter">
                  {loading ? "..." : stats.products}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 w-fit px-3 py-1 rounded-full">
                  Premium Skus Active
                </div>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="group relative bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                <ShoppingBag size={140} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mb-6">
                  <ShoppingBag size={22} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                  Sales Volume
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2 tracking-tighter">
                  {loading ? "..." : stats.orders}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter bg-emerald-50 w-fit px-3 py-1 rounded-full">
                  {loading ? "..." : `${stats.todayOrders} Orders Today`}
                </div>
              </div>
            </div>

          </div>

          {/* Recent Activity / Orders Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 italic">Recent Global Orders</h3>
                <p className="text-slate-500 mt-2">Live order data pulled directly from the backend database.</p>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-slate-900 transition-colors">View All Logs</button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Loading recent orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="min-w-150 text-center py-20 border-2 border-dashed border-slate-100 rounded-4xl">
                <p className="text-slate-300 font-serif italic text-lg tracking-wide">
                  No recent order activity found in the database yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-sm uppercase tracking-widest text-slate-400">
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="bg-slate-50 rounded-3xl border border-slate-100">
                        <td className="px-4 py-4 font-semibold text-slate-900">#{order.id}</td>
                        <td className="px-4 py-4 text-slate-600">{order.customer?.name || order.customer?.email || "Guest"}</td>
                        <td className="px-4 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-4 py-4 text-slate-600">{order.items?.length || 0}</td>
                        <td className="px-4 py-4 font-semibold text-slate-900">{formatPrice(order.summary?.total || 0)}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                            {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
