import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, PackageCheck, Truck } from "lucide-react";
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

const OrderConfirmation = () => {
  const { products } = useProducts();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrder = async () => {
      if (!hasAuthToken()) {
        setError("Please login to view order data from database.");
        setLoading(false);
        return;
      }

      try {
        const orders = await fetchDatabaseOrders(products);
        if (!ignore) {
          setOrder(orders[orders.length - 1] || null);
          setError(orders.length > 0 ? "" : "No order data found in database.");
        }
      } catch (orderError) {
        if (!ignore) {
          setOrder(null);
          setError(
            orderError.response?.status === 404
              ? "No order data found in database."
              : getApiErrorMessage(orderError, "Unable to fetch orders from database.")
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [products]);

  return (
    <StorefrontLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <h1 className="text-3xl font-black text-slate-950">Loading database order...</h1>
          </div>
        ) : !order ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h1 className="mt-5 text-3xl font-black text-slate-950">No recent order found</h1>
            <p className="mt-3 text-sm text-slate-500">
              {error || "Place an order from checkout to see confirmation details here."}
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-700" />
              <p className="mt-5 text-xs font-black uppercase tracking-widest text-emerald-800">Order Confirmation Page</p>
              <h1 className="mt-3 text-4xl font-black text-slate-950">Order confirmed</h1>
              <p className="mt-3 text-sm font-semibold text-slate-600">Order ID: {order.id}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <CalendarDays className="h-5 w-5 text-amber-700" />
                <h2 className="mt-3 text-sm font-black text-slate-950">Placed on</h2>
                <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Truck className="h-5 w-5 text-sky-700" />
                <h2 className="mt-3 text-sm font-black text-slate-950">Estimated delivery</h2>
                <p className="mt-1 text-sm text-slate-500">{formatDate(order.estimatedDelivery)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <PackageCheck className="h-5 w-5 text-emerald-700" />
                <h2 className="mt-3 text-sm font-black text-slate-950">Status</h2>
                <p className="mt-1 text-sm text-slate-500">{order.status}</p>
              </div>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Items</h2>
              <div className="mt-5 grid gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[72px_1fr_auto] gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="h-18 w-18 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-black text-slate-950">{item.name}</h3>
                      <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-slate-950">{formatPrice(getDiscountedPrice(item) * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between border-t border-slate-100 pt-5 text-lg font-black text-slate-950">
                <span>Total paid</span>
                <span>{formatPrice(order.summary.total)}</span>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/account"
                className="flex h-12 flex-1 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black uppercase tracking-widest text-white hover:bg-amber-700"
              >
                View account
              </Link>
              <Link
                to="/products"
                className="flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-black uppercase tracking-widest text-slate-700 hover:border-slate-950"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
};

export default OrderConfirmation;
