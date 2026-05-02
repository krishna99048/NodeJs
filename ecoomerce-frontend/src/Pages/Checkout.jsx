import { useEffect, useMemo, useState } from "react";
import { CreditCard, LockKeyhole, MapPin, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StorefrontLayout from "../Components/StorefrontLayout";
import api from "../Services/api";
import { useProducts } from "../hooks/useProducts";
import {
  clearCart,
  formatPrice,
  getCartSummary,
  saveLatestOrder,
} from "../utils/storefront";
import { broadcastTabEvent } from "../utils/tabSync";
import {
  fetchDatabaseCart,
  getApiErrorMessage,
  hasAuthToken,
  submitDatabaseOrder,
} from "../utils/customerData";

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const Checkout = () => {
  const { products } = useProducts();
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState("");
  const summary = useMemo(() => getCartSummary(items), [items]);
  const savedUser = getSavedUser();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: savedUser.username || "",
    email: savedUser.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "card",
  });

  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      if (!hasAuthToken()) {
        setCartError("Please login to checkout with database cart data.");
        setLoadingCart(false);
        return;
      }

      if (buyNowItem) {
        setItems([buyNowItem]);
        setLoadingCart(false);
        return;
      }

      try {
        const databaseItems = await fetchDatabaseCart(products);
        if (!ignore) {
          setItems(databaseItems);
          setCartError("");
        }
      } catch (error) {
        if (!ignore) {
          setItems([]);
          setCartError(
            error.response?.status === 404
              ? "No cart data found in database."
              : getApiErrorMessage(error, "Unable to fetch database cart.")
          );
        }
      } finally {
        if (!ignore) setLoadingCart(false);
      }
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, [products, buyNowItem]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);

    const orderPayload = {
      customer: form,
      items,
      summary,
    };
    const backendItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      const backendOrder = await submitDatabaseOrder({ items: backendItems, checkout: orderPayload });

      const order = {
        id:
          backendOrder?._id || backendOrder?.id || backendOrder?.orderId || `LM-${Date.now()}`,
        status: backendOrder?.status || "Confirmed",
        createdAt: backendOrder?.createdAt || new Date().toISOString(),
        estimatedDelivery:
          backendOrder?.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        customer: backendOrder?.customer || form,
        items: backendOrder?.items?.length ? backendOrder.items : items,
        summary: backendOrder?.summary?.total ? backendOrder.summary : summary,
      };

      saveLatestOrder(order);
      clearCart();
      broadcastTabEvent("order-created", {
        orderId: order.id,
        total: order.summary.total,
        customer: order.customer,
      });
      navigate("/order-confirmation");
    } catch (orderError) {
      setCartError(getApiErrorMessage(orderError, "Unable to create order in database."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">Checkout Page</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Secure checkout</h1>
          {cartError && <p className="mt-3 text-sm font-semibold text-slate-500">{cartError}</p>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        {loadingCart ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-950">Loading database cart...</h2>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-950">No items to checkout</h2>
            <p className="mt-3 text-sm text-slate-500">Your cart is empty. Add products before placing an order.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-amber-700" />
                  <h2 className="text-xl font-black text-slate-950">Contact details</h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-600">
                    Full name
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-600">
                    Email
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-600">
                    Phone
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sky-700" />
                  <h2 className="text-xl font-black text-slate-950">Shipping address</h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-600 sm:col-span-2">
                    Address
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="min-h-28 rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-600">
                    City
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-600">
                    State
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-600">
                    Pincode
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-amber-500"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-emerald-700" />
                  <h2 className="text-xl font-black text-slate-950">Payment</h2>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["card", "upi", "cash"].map((method) => (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-black capitalize ${
                        form.paymentMethod === method
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={handleChange}
                        className="accent-amber-600"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-black uppercase tracking-widest text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:bg-slate-400"
              >
                <LockKeyhole className="h-5 w-5" />
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </form>

            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Order summary</h2>
              <div className="mt-6 grid gap-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[64px_1fr] gap-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div>
                      <p className="line-clamp-1 text-sm font-black text-slate-950">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-950">{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Discount</span>
                  <span className="font-bold text-emerald-700">-{formatPrice(summary.discount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-950">{summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax</span>
                  <span className="font-bold text-slate-950">{formatPrice(summary.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-black text-slate-950">
                  <span>Total</span>
                  <span>{formatPrice(summary.total)}</span>
                </div>
              </div>
            </aside>
          </>
        )}
      </section>
    </StorefrontLayout>
  );
};

export default Checkout;
