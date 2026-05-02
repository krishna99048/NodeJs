import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import ProductCard from "../Components/ProductCard";
import StorefrontLayout from "../Components/StorefrontLayout";
import { useProducts } from "../hooks/useProducts";
import {
  addCartItem,
  formatPrice,
  getDiscountedPrice,
  getProductId,
  getProductImage,
  getProductImages,
  getWishlistItems,
  toggleWishlistItem,
} from "../utils/storefront";

const ProductDetail = () => {
  const { productId } = useParams();
  const { products, loading, error } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [wishlist, setWishlist] = useState(getWishlistItems());
  const [cartMessage, setCartMessage] = useState("");

  const product = useMemo(
    () => products.find((item) => getProductId(item) === productId),
    [products, productId]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => getProductId(item) !== getProductId(product) && item.category === product.category)
      .slice(0, 3);
  }, [product, products]);

  useEffect(() => {
    if (product) setActiveImage(getProductImage(product));
  }, [product]);

  if (!product && !loading) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-black text-slate-950">Product not found</h1>
          <p className="mt-4 text-slate-500">
            This item may have been removed from inventory or the link may be incorrect.
          </p>
          {error && <p className="mt-2 text-sm font-semibold text-slate-500">{error}</p>}
          <Link
            to="/products"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-black text-white"
          >
            Back to products
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-lg bg-white" />
        </div>
      </StorefrontLayout>
    );
  }

  const images = getProductImages(product);
  const price = Number(product.price) || 0;
  const salePrice = getDiscountedPrice(product);
  const discount = Number(product.discount) || 0;
  const saved = wishlist.some((item) => item.id === getProductId(product));

  const handleAddToCart = () => {
    addCartItem(product, quantity);
    setCartMessage(`${quantity} item${quantity > 1 ? "s" : ""} added to cart.`);
  };

  const handleWishlist = (item) => {
    setWishlist(toggleWishlistItem(item));
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm font-semibold text-slate-500 sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-slate-950">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-slate-950">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate text-slate-950">{product.name}</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="grid gap-4">
          <div className="aspect-4/3 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`aspect-square overflow-hidden rounded-lg border bg-white ${
                  activeImage === image ? "border-emerald-600 ring-4 ring-emerald-100" : "border-slate-200"
                }`}
              >
                <img src={image} alt={`${product.name} view`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            {product.brand || "Astra collection"}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">
              <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              {product.rating || "4.6"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
              SKU {product.sku || getProductId(product)}
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">
                Save {discount}%
              </span>
            )}
          </div>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            {product.description || "A carefully selected piece for modern homes, ready to order from live inventory."}
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-4xl font-black text-slate-950">{formatPrice(salePrice)}</p>
              {discount > 0 && price > salePrice && (
                <p className="mt-1 text-sm font-bold text-slate-400 line-through">{formatPrice(price)}</p>
              )}
            </div>
            <p className="mb-2 text-sm font-bold text-slate-500">
              {Number(product.stock) > 0 ? `${product.stock} units available` : "Currently out of stock"}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="grid h-12 grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-white sm:w-36">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex items-center justify-center text-slate-500 hover:bg-slate-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex items-center justify-center text-sm font-black">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                className="flex items-center justify-center text-slate-500 hover:bg-slate-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={Number(product.stock) === 0}
              onClick={handleAddToCart}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-black uppercase tracking-widest text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to cart
            </button>

            <button
              type="button"
              onClick={() => handleWishlist(product)}
              className={`flex h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black ${
                saved
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 bg-white text-slate-600 hover:text-rose-600"
              }`}
            >
              <Heart className={`h-5 w-5 ${saved ? "fill-rose-600" : ""}`} />
              Wishlist
            </button>
          </div>

          {cartMessage && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {cartMessage}
            </p>
          )}

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <Truck className="h-5 w-5 text-sky-600" />
              <h3 className="mt-3 text-sm font-black text-slate-950">Scheduled delivery</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Delivery windows shown at checkout.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <RotateCcw className="h-5 w-5 text-emerald-600" />
              <h3 className="mt-3 text-sm font-black text-slate-950">7 day returns</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Unused items in original packaging.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <h3 className="mt-3 text-sm font-black text-slate-950">Secure payments</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Token based auth is already supported.</p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-950">Related products</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={getProductId(item)}
                  product={item}
                  isSaved={wishlist.some((savedItem) => savedItem.id === getProductId(item))}
                  onAddToCart={addCartItem}
                  onToggleWishlist={handleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </StorefrontLayout>
  );
};

export default ProductDetail;
