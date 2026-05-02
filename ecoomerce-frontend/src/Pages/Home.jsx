import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgePercent, Search, Truck } from "lucide-react";
import ProductCard from "../Components/ProductCard";
import StorefrontLayout from "../Components/StorefrontLayout";
import { deals, seasonalBanners } from "../data/storefront";
import { useProducts } from "../hooks/useProducts";
import {
  addCartItem,
  getProductImage,
  getProductId,
  getWishlistItems,
  toggleWishlistItem,
} from "../utils/storefront";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState(getWishlistItems());
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((first, second) => Number(second.isNewProduct) - Number(first.isNewProduct))
      .slice(0, 4);
  }, [products]);

  const dealProducts = useMemo(() => {
    return products
      .filter((product) => Number(product.discount) > 0)
      .sort((a, b) => Number(b.discount) - Number(a.discount))
      .slice(0, 4);
  }, [products]);

  const dynamicCategories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((product) => {
      if (!product.category) return;

      const current = categoryMap.get(product.category);
      categoryMap.set(product.category, {
        name: product.category,
        slug: product.category,
        count: (current?.count || 0) + 1,
        image: current?.image || getProductImage(product),
      });
    });

    return Array.from(categoryMap.values());
  }, [products]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = search.trim();
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
  };

  const handleWishlist = (product) => {
    setWishlist(toggleWishlistItem(product));
  };

  return (
    <StorefrontLayout>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-12">
          <div className="flex min-h-130 flex-col justify-end overflow-hidden rounded-lg bg-slate-950 p-6 text-white sm:p-10">
            <div
              className="absolute inset-0 hidden"
              aria-hidden="true"
            />
            <div className="relative -mx-6 -mt-6 mb-8 h-64 overflow-hidden sm:-mx-10 sm:-mt-10">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1800"
                alt="Seasonal living room collection"
                className="h-full w-full object-cover opacity-90"
              />
            </div>

            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950">
              <BadgePercent className="h-4 w-4" />
              Seasonal sale
            </span>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Astra Home Studio
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Shop furniture, decor, lighting, textiles, and room-ready essentials connected to your product backend.
            </p>

            <form onSubmit={handleSearch} className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search sofas, lamps, rugs..."
                  className="h-14 w-full rounded-lg border border-white/10 bg-white pl-12 pr-4 text-sm font-semibold text-slate-950 outline-none focus:ring-4 focus:ring-emerald-300"
                />
              </div>
              <button className="h-14 rounded-lg bg-emerald-500 px-7 text-sm font-black uppercase tracking-widest text-slate-950 transition hover:bg-white">
                Search
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            {seasonalBanners.map((banner) => (
              <Link
                key={banner.title}
                to={banner.href}
                className="group relative min-h-64 overflow-hidden rounded-lg bg-slate-900 p-6 text-white"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-end">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-300">{banner.label}</p>
                  <h2 className="mt-2 text-2xl font-black">{banner.title}</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">{banner.description}</p>
                  <span className="mt-5 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                    {banner.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-700">Categories</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Shop by room need</h2>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-emerald-700">
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {dynamicCategories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dynamicCategories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-5/4 overflow-hidden bg-slate-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-black text-slate-950">{category.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {category.count} product{category.count > 1 ? "s" : ""} from database
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-black text-slate-950">
              {loading ? "Loading database categories..." : "No database categories yet"}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Categories will be created from your product category field.
            </p>
          </div>
        )}
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Featured Products</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Fresh picks from inventory</h2>
              {error && <p className="mt-2 text-sm font-semibold text-slate-500">{error}</p>}
            </div>
            <Link to="/products" className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-emerald-700">
              Shop collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={getProductId(product)}
                  product={product}
                  isSaved={wishlist.some((item) => item.id === getProductId(product))}
                  onAddToCart={addCartItem}
                  onToggleWishlist={handleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h3 className="text-xl font-black text-slate-950">
                {loading ? "Loading database products..." : "No database products yet"}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                {loading
                  ? "Fetching products from your backend inventory."
                  : "Add products from the admin panel and they will appear here automatically."}
              </p>
            </div>
          )}
        </div>
      </section>

      {dealProducts.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-rose-700">Deals & Offers</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Limited-time discounts</h2>
              </div>
              <Link to="/products?deal=true" className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-rose-700">
                View all deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {dealProducts.map((product) => (
                <ProductCard
                  key={getProductId(product)}
                  product={product}
                  isSaved={wishlist.some((item) => item.id === getProductId(product))}
                  onAddToCart={addCartItem}
                  onToggleWishlist={handleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {deals.map((deal) => (
            <Link
              key={deal.title}
              to={deal.href}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <BadgePercent className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950">{deal.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{deal.description}</p>
              <span className="mt-6 flex items-center gap-2 text-sm font-black text-emerald-700">
                Claim offer
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Fast checkout, saved wishlist, real inventory.</h2>
              <p className="mt-1 text-sm text-slate-400">Your customer pages are ready for the backend products already used by admin.</p>
            </div>
          </div>
          <Link
            to="/products"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-black uppercase tracking-widest text-slate-950 transition hover:bg-emerald-500"
          >
            Start shopping
          </Link>
        </div>
      </section>
    </StorefrontLayout>
  );
};

export default HomePage;
