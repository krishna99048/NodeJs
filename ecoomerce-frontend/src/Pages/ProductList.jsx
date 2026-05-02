import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import StorefrontLayout from "../Components/StorefrontLayout";
import { useProducts } from "../hooks/useProducts";
import {
  addCartItem,
  getDiscountedPrice,
  getProductId,
  getWishlistItems,
  productMatchesSearch,
  toggleWishlistItem,
} from "../utils/storefront";

const sortProducts = (products, sort) => {
  const items = [...products];

  if (sort === "price-low") return items.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
  if (sort === "price-high") return items.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
  if (sort === "discount") return items.sort((a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0));
  return items.sort((a, b) => Number(b.isNewProduct) - Number(a.isNewProduct));
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState(getWishlistItems());
  const { products, loading, error } = useProducts();

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const dealOnly = searchParams.get("deal") === "true";

  const categoryOptions = useMemo(() => {
    return products
      .map((product) => product.category)
      .filter(Boolean)
      .map((name) => ({ name, slug: name }))
      .filter((category, index, all) => all.findIndex((item) => item.slug === category.slug) === index);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatches = !selectedCategory || product.category === selectedCategory;
      const dealMatches = !dealOnly || Number(product.discount) > 0;
      return categoryMatches && dealMatches && productMatchesSearch(product, search);
    });

    return sortProducts(filtered, sort);
  }, [products, search, selectedCategory, dealOnly, sort]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) next.set(key, value);
    else next.delete(key);

    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSort("featured");
  };

  const handleWishlist = (product) => {
    setWishlist(toggleWishlistItem(product));
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-widest text-amber-700">Product Listing Page</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Shop all products</h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              Browse live backend products with search, category filters, deal filters, sorting, wishlist, and cart actions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-950">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </h2>
            {(selectedCategory || dealOnly || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-black text-rose-600"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Category</h3>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => setFilter("category", "")}
                className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                  !selectedCategory ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                All categories
              </button>
              {categoryOptions.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setFilter("category", category.slug)}
                  className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                    selectedCategory === category.slug
                      ? "bg-slate-950 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-amber-50 p-3 text-sm font-black text-amber-900">
              Deals only
              <input
                type="checkbox"
                checked={dealOnly}
                onChange={(event) => setFilter("deal", event.target.checked ? "true" : "")}
                className="h-5 w-5 accent-amber-600"
              />
            </label>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-black text-slate-950">
                {loading ? "Loading products..." : `${filteredProducts.length} products found`}
              </p>
              {search && <p className="text-sm text-slate-500">Search result for "{search}"</p>}
              {error && <p className="text-sm font-semibold text-slate-500">{error}</p>}
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-amber-500"
            >
              <option value="featured">Featured first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="discount">Biggest discount</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
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
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-2xl font-black text-slate-950">No products found</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Try removing a filter or searching for a different product name.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
              >
                Reset listing
              </Link>
            </div>
          )}
        </div>
      </section>
    </StorefrontLayout>
  );
};

export default ProductList;
