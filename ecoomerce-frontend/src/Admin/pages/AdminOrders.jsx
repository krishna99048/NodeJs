import { useEffect, useState, useCallback } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { ShoppingBag, Eye, Package, Calendar, User, DollarSign } from "lucide-react";
import { fetchDatabaseOrders } from "../../utils/customerData";
import { formatPrice } from "../../utils/storefront";
import { subscribeTabEvents } from "../../utils/tabSync";
import { useProducts } from "../../hooks/useProducts";

const AdminOrders = () => {
  const { products } = useProducts();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderNotification, setOrderNotification] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      const fetchedOrders = await fetchDatabaseOrders(products);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    loadOrders();

    const cleanup = subscribeTabEvents((message) => {
      if (message?.type === "order-created") {
        loadOrders();
        setOrderNotification(`New order received from ${message.payload.customer?.name || "a customer"}.`);
        window.setTimeout(() => setOrderNotification(null), 5000);
      }
    });

    return cleanup;
  }, [loadOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <main className="p-8 lg:p-12">
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-0.5 w-8 bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
                  Order Management
                </span>
              </div>
              {orderNotification && (
                <div className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  {orderNotification}
                </div>
              )}
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Customer Orders <ShoppingBag className="text-emerald-500 h-6 w-6" />
              </h1>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                Monitor and manage all customer purchase transactions.
              </p>
            </div>

            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Total Orders</p>
                <p className="text-xl font-bold text-slate-900 leading-none mt-1">{orders.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <ShoppingBag className="text-amber-500 h-5 w-5" />
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
              <p className="text-slate-600">Orders will appear here once customers start purchasing.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-xl">
                          <Package className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Order #{order.id}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {order.customer?.name || 'Customer'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">{formatPrice(order.summary.total)}</p>
                          <p className="text-sm text-slate-500">{order.items.length} items</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>{order.items.length} products ordered</span>
                          <span>•</span>
                          <span>Total: {formatPrice(order.summary.total)}</span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="border-t border-slate-100 bg-slate-50 p-6">
                      <h4 className="font-bold text-slate-900 mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-900">{item.name}</h5>
                              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Subtotal</p>
                            <p className="font-medium">{formatPrice(order.summary.subtotal)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Discount</p>
                            <p className="font-medium text-emerald-600">-{formatPrice(order.summary.discount)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Shipping</p>
                            <p className="font-medium">{order.summary.shipping === 0 ? 'Free' : formatPrice(order.summary.shipping)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Tax</p>
                            <p className="font-medium">{formatPrice(order.summary.tax)}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                          <span className="font-bold text-slate-900">Total</span>
                          <span className="text-xl font-bold text-slate-900">{formatPrice(order.summary.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;