import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, PackageCheck, Truck } from "lucide-react";
import StorefrontLayout from "../Components/StorefrontLayout";
import { useProducts } from "../hooks/useProducts";
import { formatPrice, getDiscountedPrice } from "../utils/storefront";
import {
  fetchDatabaseOrders,
  getApiErrorMessage,
  hasAuthToken,
} from "../utils/customerData";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "";

const Orders = () => {
  const { products } = useProducts();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      if (!hasAuthToken()) {
        setError("Please login to view orders from database.");
        setLoading(false);
        return;
      }

      try {
        const databaseOrders = await fetchDatabaseOrders(products);
        if (!ignore) {
          setOrders(databaseOrders);
          setError(databaseOrders.length > 0 ? "" : "No orders found in database.");
        }
      } catch (orderError) {
        if (!ignore) {
          setOrders([]);
          setError(
            orderError.response?.status === 404
              ? "No orders found in database."
              : getApiErrorMessage(orderError, "Unable to fetch orders from database.")
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [products]);

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">Order History</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">My Orders</h1>
          {error && <p className="mt-3 text-sm font-semibold text-slate-500">{error}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-black text-slate-950">Loading orders from database...</h2>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-5 text-2xl font-black text-slate-950">No orders yet</h2>
            <p className="mt-3 text-sm text-slate-500">
              Orders placed from checkout will appear here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-950">Order #{order.id}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${
                        order.status === 'confirmed' || order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Ordered on {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Estimated delivery: {formatDate(order.estimatedDelivery)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-black text-slate-950">{formatPrice(order.summary.total)}</p>
                    <p className="mt-1 text-sm text-slate-500">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-black text-slate-950">{item.name}</h3>
                        <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-black text-slate-950">{formatPrice(getDiscountedPrice(item) * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between border-t border-slate-100 pt-4 text-lg font-black text-slate-950">
                  <span>Total</span>
                  <span>{formatPrice(order.summary.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
};

export default Orders;