import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";
import StorefrontLayout from "../Components/StorefrontLayout";
import { useProducts } from "../hooks/useProducts";
import { addCartItem, getProductId, toggleWishlistItem } from "../utils/storefront";
import { fetchDatabaseWishlist, getApiErrorMessage, hasAuthToken } from "../utils/customerData";

const Wishlist = () => {
  const { products } = useProducts();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleWishlist = (product) => {
    setWishlist(toggleWishlistItem(product));
  };

  useEffect(() => {
    let ignore = false;

    const loadWishlist = async () => {
      if (!hasAuthToken()) {
        if (!ignore) {
          setWishlist([]);
          setError("Please login to view wishlist data from the database.");
          setLoading(false);
        }
        return;
      }

      try {
        const databaseItems = await fetchDatabaseWishlist(products);
        if (!ignore) {
          setWishlist(databaseItems);
          setError(databaseItems.length > 0 ? "" : "No wishlist data found in the database.");
        }
      } catch (wishlistError) {
        if (!ignore) {
          setWishlist([]);
          setError(
            wishlistError.response?.status === 404
              ? "Wishlist GET route is missing or no wishlist data found in the database."
              : getApiErrorMessage(wishlistError, "Unable to fetch wishlist from the database.")
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadWishlist();
  }, [products]);

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">Wishlist Page</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Saved products</h1>
          {error && <p className="mt-3 text-sm font-semibold text-slate-500">{error}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-black text-slate-950">Loading database wishlist...</h2>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-5 text-2xl font-black text-slate-950">Your wishlist is empty</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Save products from the listing or detail pages and come back to them here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard
                key={getProductId(product)}
                product={product}
                isSaved
                onAddToCart={addCartItem}
                onToggleWishlist={handleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
};

export default Wishlist;
