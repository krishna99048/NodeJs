import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatPrice,
  getDiscountedPrice,
  getProductId,
  getProductImage,
} from "../utils/storefront";

const ProductCard = ({ product, isSaved = false, onAddToCart, onToggleWishlist }) => {
  const id = getProductId(product);
  const price = Number(product.price) || 0;
  const salePrice = getDiscountedPrice(product);
  const discount = Number(product.discount) || 0;
  const imageSrc = getProductImage(product);
  const fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000";

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${id}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          <img
            src={imageSrc || fallbackImage}
            alt={product.name || "Product image"}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNewProduct && (
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-sm">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-sm">
                {discount}% off
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {product.category || "Home"}
          </p>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {product.rating || "4.6"}
          </span>
        </div>

        <Link to={`/products/${id}`} className="block">
          <h3 className="line-clamp-2 min-h-12 text-lg font-black leading-6 text-slate-950 group-hover:text-amber-700">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description || product.brand || "Premium home essential, ready to ship."}
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-black text-slate-950">{formatPrice(salePrice)}</p>
            {discount > 0 && price > salePrice && (
              <p className="text-xs font-semibold text-slate-400 line-through">{formatPrice(price)}</p>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-500">
            {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-[44px_1fr] gap-2">
          <button
            type="button"
            onClick={() => onToggleWishlist?.(product)}
            className={`flex h-11 items-center justify-center rounded-lg border transition ${
              isSaved
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-600"
            }`}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-rose-600" : ""}`} />
          </button>

          <button
            type="button"
            disabled={Number(product.stock) === 0}
            onClick={() => onAddToCart?.(product)}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
