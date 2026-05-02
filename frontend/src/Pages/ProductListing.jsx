import React, { useState, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Filter, ChevronDown } from 'lucide-react'
import { UserContext } from '../Context/UserContext'

const ProductListing = () => {
  const [searchParams] = useSearchParams()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useContext(UserContext)
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [showFilters, setShowFilters] = useState(false)

  const allProducts = [
    { id: 1, name: 'Premium Wireless Headphones', price: 199.99, category: 'Audio', rating: 4.8, reviews: 328, image: '🎧' },
    { id: 2, name: 'Ultra HD 4K Webcam', price: 129.99, category: 'Electronics', rating: 4.6, reviews: 156, image: '📷' },
    { id: 3, name: 'Ergonomic Desk Lamp', price: 89.99, category: 'Workspace', rating: 4.9, reviews: 92, image: '💡' },
    { id: 4, name: 'Mechanical Keyboard RGB', price: 159.99, category: 'Accessories', rating: 4.7, reviews: 213, image: '⌨️' },
    { id: 5, name: 'Studio Monitor 32"', price: 449.99, category: 'Electronics', rating: 4.8, reviews: 87, image: '🖥️' },
    { id: 6, name: 'USB-C Hub Multiport', price: 49.99, category: 'Accessories', rating: 4.5, reviews: 145, image: '🔌' },
    { id: 7, name: 'Portable SSD 1TB', price: 129.99, category: 'Storage', rating: 4.9, reviews: 203, image: '💾' },
    { id: 8, name: 'Laptop Stand Aluminum', price: 79.99, category: 'Workspace', rating: 4.7, reviews: 118, image: '🖥️' },
  ]

  // Filter products
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''
  const categoryFilter = searchParams.get('category') || ''

  let filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery)
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-2">
            {searchQuery && `Search Results for "${searchQuery}"`}
            {categoryFilter && `${categoryFilter}`}
            {!searchQuery && !categoryFilter && 'All Products'}
          </h1>
          <p className="text-slate-400">Showing {filteredProducts.length} products</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center justify-between">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-white mb-4">Price Range</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-slate-100"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Category</label>
                <div className="space-y-2">
                  {['All', 'Audio', 'Electronics', 'Workspace', 'Accessories', 'Storage'].map((cat) => (
                    <button
                      key={cat}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                        (cat === 'All' && !categoryFilter) || categoryFilter === cat
                          ? 'bg-indigo-500 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 flex items-center gap-2 bg-indigo-500 rounded-full px-6 py-2 text-white font-semibold"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            {filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur hover:border-indigo-500/50 hover:bg-slate-900/80 transition duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-linear-to-r from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                      <span className="text-6xl group-hover:scale-125 transition duration-300">
                        {product.image}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-300 transition">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <p className="text-2xl font-bold text-white mb-4">${product.price.toFixed(2)}</p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full py-3 font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/50 transition"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add
                        </button>
                        <button
                          onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                          className={`px-4 py-3 rounded-full transition ${
                            isInWishlist(product.id)
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* View Details */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block w-full text-center mt-4 text-indigo-300 hover:text-indigo-200 transition text-sm font-semibold"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl text-slate-400 mb-4">No products found</p>
                <Link to="/" className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-600 transition">
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListing
  }

  nst ProductListing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.33em] text-indigo-300">Discover products</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-4">Shop the latest collections</h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">Browse curated product categories, compare deals, and find items that fit your business and lifestyle.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-indigo-500/30">
              <div className="flex items-center justify-between mb-5">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-indigo-200">{product.category}</span>
                <span className="text-xs text-slate-400">{product.badge}</span>
              </div>
              <div className="h-40 rounded-3xl bg-slate-900 mb-6 flex items-center justify-center text-slate-500">Product image</div>
              <h2 className="text-2xl font-semibold text-white mb-2">{product.name}</h2>
              <p className="text-slate-400 mb-6">{product.description}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xl font-bold">{product.price}</span>
                <Link
                  to={`/product/${product.id}`}
                  className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-indigo-400 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductListing
