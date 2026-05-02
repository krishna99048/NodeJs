import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StorefrontLayout from "../Components/StorefrontLayout";
import { useProducts } from "../hooks/useProducts";
import {
  formatPrice,
  getCartSummary,
  removeCartItem,
  updateCartQuantity,
} from "../utils/storefront";
import {
  deleteDatabaseCartItem,
  fetchDatabaseCart,
  getApiErrorMessage,
  hasAuthToken,
} from "../utils/customerData";

const Cart = () => {
  const { products } = useProducts();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const summary = useMemo(() => getCartSummary(items), [items]);

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      if (!hasAuthToken()) {
        setError("Please login to view cart data from database.");
        setLoading(false);
        return;
      }

      try {
        const databaseItems = await fetchDatabaseCart(products);
        if (!ignore) {
          setItems(databaseItems);
          setError("");
        }
      } catch (cartError) {
        if (!ignore) {
          setItems([]);
          setError(
            cartError.response?.status === 404
              ? "No cart data found in database."
              : getApiErrorMessage(cartError, "Unable to fetch cart from database.")
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, [products]);

  const changeQuantity = (id, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    if (!hasAuthToken()) {
      const nextItems = updateCartQuantity(id, nextQuantity);
      setItems(nextItems);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeItem = async (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));

    if (!hasAuthToken()) {
      removeCartItem(id);
      return;
    }

    try {
      await deleteDatabaseCartItem(id);
    } catch (cartError) {
      setError(getApiErrorMessage(cartError, "Unable to remove item from database cart."));
    }
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Cart Page</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Shopping cart</h1>
          {error && <p className="mt-3 text-sm font-semibold text-slate-500">{error}</p>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-4">
          {loading ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <h2 className="text-2xl font-black text-slate-950">Loading database cart...</h2>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-5 text-2xl font-black text-slate-950">Your cart is empty</h2>
              <p className="mt-3 text-sm text-slate-500">Add products from the listing page to start checkout.</p>
              <Link
                to="/products"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
              >
                Shop products
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const itemPrice = Math.round(item.price - (item.price * (Number(item.discount) || 0)) / 100);

              return (
                <article key={item.id} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr_auto]">
                  <Link to={`/products/${item.id}`} className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {item.category || item.brand || "Home"}
                    </p>
                    <Link to={`/products/${item.id}`}>
                      <h2 className="mt-2 text-xl font-black text-slate-950 hover:text-emerald-700">{item.name}</h2>
                    </Link>
                    <p className="mt-2 text-sm text-slate-500">{item.brand || "Astra collection"}</p>
                    <p className="mt-4 text-lg font-black text-slate-950">{formatPrice(itemPrice)}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        to="/checkout"
                        state={{ buyNowItem: item }}
                        className="flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-700"
                      >
                        Buy now
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                        aria-label="Remove item"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid h-11 w-32 grid-cols-3 overflow-hidden rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.quantity - 1)}
                        className="flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex items-center justify-center text-sm font-black">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.quantity + 1)}
                        className="flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Order summary</h2>
          <div className="mt-6 grid gap-3 text-sm">
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
              <span>Estimated tax</span>
              <span className="font-bold text-slate-950">{formatPrice(summary.tax)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex justify-between text-lg font-black text-slate-950">
              <span>Total</span>
              <span>{formatPrice(summary.total)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className={`mt-6 flex h-12 items-center justify-center rounded-lg text-sm font-black uppercase tracking-widest ${
              items.length === 0
                ? "pointer-events-none bg-slate-200 text-slate-400"
                : "bg-slate-950 text-white hover:bg-emerald-700"
            }`}
          >
            Checkout
          </Link>
          <Link to="/products" className="mt-3 flex h-11 items-center justify-center rounded-lg border border-slate-200 text-sm font-black text-slate-700 hover:border-slate-950">
            Continue shopping
          </Link>
        </aside>
      </section>
    </StorefrontLayout>
  );
};

export default Cart;
