import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, PackageCheck, Pencil, ShoppingCart, UserRound } from "lucide-react";
import StorefrontLayout from "../Components/StorefrontLayout";
import api from "../Services/api";
import { useProducts } from "../hooks/useProducts";
import {
  formatPrice,
  getCartSummary,
} from "../utils/storefront";
import {
  fetchDatabaseCart,
  fetchDatabaseOrders,
  fetchDatabaseWishlist,
  getApiErrorMessage,
  hasAuthToken,
} from "../utils/customerData";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const Account = () => {
  const { products } = useProducts();
  const [user, setUser] = useState(readUser());
  const [message, setMessage] = useState("");
  const [cartSummary, setCartSummary] = useState(getCartSummary([]));
  const [wishlistCount, setWishlistCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        const response = await api.get("/user/profile");
        setUser(response.data?.user || response.data || readUser());
      } catch (profileError) {
        setMessage(profileError.response?.data?.message || "Showing saved account data.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchAccountData = async () => {
      if (!hasAuthToken()) return;

      try {
        const [cartItems, wishlistItems, orders] = await Promise.all([
          fetchDatabaseCart(products).catch(() => []),
          fetchDatabaseWishlist(products).catch(() => []),
          fetchDatabaseOrders(products).catch(() => []),
        ]);

        if (!ignore) {
          setCartSummary(getCartSummary(cartItems));
          setWishlistCount(wishlistItems.length);
          setLatestOrder(orders[orders.length - 1] || null);
        }
      } catch (accountError) {
        if (!ignore) {
          setMessage(getApiErrorMessage(accountError, "Unable to fetch account data from database."));
        }
      }
    };

    fetchAccountData();

    return () => {
      ignore = true;
    };
  }, [products]);

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">User Account Pages</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">My account</h1>
          {message && <p className="mt-3 text-sm font-semibold text-slate-500">{message}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!user ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <UserRound className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-5 text-2xl font-black text-slate-950">Sign in to manage your account</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Login to view profile details, saved wishlist, cart activity, and recent orders.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/login" className="flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white">
                Login
              </Link>
              <Link to="/joinus" className="flex h-11 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-black text-slate-700">
                Create account
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-amber-100 text-3xl font-black text-amber-800">
                {(user.username || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">{user.username || "Customer"}</h2>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              <p className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-600">
                {user.role || "user"}
              </p>

              <div className="mt-6 grid gap-3">
                <Link to="/profile" className="flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-black text-white">
                  View profile
                </Link>
                <Link to="/edit-profile" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-black text-slate-700">
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </Link>
              </div>
            </aside>

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Link to="/cart" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <ShoppingCart className="h-6 w-6 text-sky-700" />
                  <p className="mt-4 text-3xl font-black text-slate-950">{cartSummary.quantity}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">Items in cart</p>
                </Link>
                <Link to="/wishlist" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <Heart className="h-6 w-6 text-rose-600" />
                  <p className="mt-4 text-3xl font-black text-slate-950">{wishlistCount}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">Saved items</p>
                </Link>
                <Link to="/orders" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <PackageCheck className="h-6 w-6 text-emerald-700" />
                  <p className="mt-4 text-3xl font-black text-slate-950">{latestOrder ? "1+" : "0"}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">Total orders</p>
                </Link>
              </div>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">Recent order</h2>
                  <Link to="/orders" className="text-sm font-bold text-slate-700 hover:text-emerald-700">
                    View all orders →
                  </Link>
                </div>
                {latestOrder ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="text-sm font-black text-slate-950">Order {latestOrder.id}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {latestOrder.items.length} item{latestOrder.items.length > 1 ? "s" : ""} ordered
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-lg font-black text-slate-950">{formatPrice(latestOrder.summary.total)}</p>
                      <p className="text-sm font-bold text-emerald-700">{latestOrder.status}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Orders placed from checkout will appear here.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
};

export default Account;
