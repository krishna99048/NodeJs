import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Home,
  LogIn,
  Menu,
  Package,
  PackageCheck,
  Search,
  ShoppingCart,
  User,
  X,
  Headphones,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { getCartItems, getCartSummary, getWishlistItems } from "../utils/storefront";
import { fetchDatabaseCart, fetchDatabaseWishlist } from "../utils/customerData";
import api from "../Services/api";

const navLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Products", path: "/products", icon: Package },
  { label: "Wishlist", path: "/wishlist", icon: Heart, requiresAuth: true },
  { label: "Orders", path: "/orders", icon: PackageCheck, requiresAuth: true },
  { label: "Support", path: "/support", icon: Headphones },
];

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const StorefrontLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [counts, setCounts] = useState({ cart: 0, wishlist: 0 });
  const [authUser, setAuthUser] = useState(getSavedUser());
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    let ignore = false;

    const refreshCounts = async () => {
      if (localStorage.getItem("token")) {
        const [cartItemsResult, wishlistItemsResult] = await Promise.allSettled([
          fetchDatabaseCart(),
          fetchDatabaseWishlist(),
        ]);

        if (ignore) return;

        const cartQuantity =
          cartItemsResult.status === "fulfilled"
            ? cartItemsResult.value.reduce((total, item) => total + (Number(item.quantity) || 1), 0)
            : getCartSummary(getCartItems()).quantity;

        const wishlistCount =
          wishlistItemsResult.status === "fulfilled"
            ? wishlistItemsResult.value.length
            : getWishlistItems().length;

        setCounts({
          cart: cartQuantity,
          wishlist: wishlistCount,
        });
        return;
      }

      setCounts({
        cart: getCartSummary(getCartItems()).quantity,
        wishlist: getWishlistItems().length,
      });
    };

    refreshCounts();
    setAuthUser(getSavedUser());
    window.addEventListener("shop-storage", refreshCounts);
    window.addEventListener("storage", refreshCounts);

    return () => {
      ignore = true;
      window.removeEventListener("shop-storage", refreshCounts);
      window.removeEventListener("storage", refreshCounts);
    };
  }, [location.pathname]);

  useEffect(() => {
    const refreshAuth = () => setAuthUser(getSavedUser());

    refreshAuth();
    window.addEventListener("storage", refreshAuth);

    return () => {
      window.removeEventListener("storage", refreshAuth);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
  };

  const handleLogout = async () => {
    try {
      await api.get("/user/logout");
    } catch {
      // Local logout should still complete if the token is already expired.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthUser(null);
      setCounts({ cart: 0, wishlist: 0 });
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    }
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? "text-emerald-700" : "text-slate-600 hover:text-slate-950"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="bg-emerald-900 px-4 py-2 text-center text-xs font-semibold text-white">
          New arrivals are live — free delivery on orders above Rs. 20,000.
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg font-black text-white">
              A
            </span>
            <span className="text-xl font-black tracking-tight">ASTRA</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 md:block">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search furniture, decor, lighting..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </form>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.filter(item => !item.requiresAuth || isLoggedIn).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className={navClass}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:border-slate-900 hover:text-slate-950 sm:flex"
                  aria-label="Profile"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline">{authUser?.username || "Profile"}</span>
                </Link>
                {authUser?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="hidden h-10 items-center gap-2 rounded-lg bg-emerald-100 px-4 text-sm font-black text-emerald-800 transition hover:bg-emerald-200 sm:flex"
                    title="Admin Dashboard"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden h-10 items-center gap-2 rounded-lg bg-rose-50 px-3 text-sm font-black text-rose-700 transition hover:bg-rose-600 hover:text-white sm:flex"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-emerald-700 sm:flex"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}

            <Link
              to="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-slate-900 hover:text-slate-950 sm:flex"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {counts.wishlist > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-black text-white">
                  {counts.wishlist}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white transition hover:bg-emerald-700"
              aria-label="Cart"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {counts.cart > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-black text-slate-950">
                  {counts.cart}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 lg:hidden"
              aria-label="Open navigation menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 pb-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </form>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
            <nav className="grid gap-1">
              {navLinks.filter(item => !item.requiresAuth || isLoggedIn).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} className={navClass}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
              {isLoggedIn ? (
                <>
                  <NavLink to="/profile" className={navClass}>
                    <User className="h-4 w-4" />
                    {authUser?.username || "Profile"}
                  </NavLink>
                  {authUser?.role === "admin" && (
                    <NavLink to="/admin/dashboard" className={navClass}>
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </NavLink>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-700 transition-colors hover:text-rose-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={navClass}>
                  <LogIn className="h-4 w-4" />
                  Login
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 font-black">
                A
              </span>
              <span className="text-xl font-black">ASTRA</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
              Furniture, decor, lighting, and home essentials for warm modern homes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Shop</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link to="/products" className="hover:text-white">
                All products
              </Link>
              <Link to="/wishlist" className="hover:text-white">
                Wishlist
              </Link>
              <Link to="/cart" className="hover:text-white">
                Cart
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Support</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link to="/support" className="hover:text-white">
                Help center
              </Link>
              <Link to="/account" className="hover:text-white">
                My account
              </Link>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
