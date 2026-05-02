import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Star, ShoppingBag, Zap, Tag } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Featured Products Data
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      category: 'Audio',
      price: '$199.99',
      originalPrice: '$299.99',
      image: '🎧',
      badge: 'Best Seller',
      rating: 4.8,
      reviews: 328,
    },
    {
      id: 2,
      name: 'Ultra HD 4K Webcam',
      category: 'Tech',
      price: '$129.99',
      originalPrice: '$179.99',
      image: '📷',
      badge: 'Hot Deal',
      rating: 4.6,
      reviews: 156,
    },
    {
      id: 3,
      name: 'Ergonomic Desk Lamp',
      category: 'Workspace',
      price: '$89.99',
      originalPrice: '$129.99',
      image: '💡',
      badge: 'New',
      rating: 4.9,
      reviews: 92,
    },
    {
      id: 4,
      name: 'Mechanical Keyboard RGB',
      category: 'Accessories',
      price: '$159.99',
      originalPrice: '$229.99',
      image: '⌨️',
      badge: 'Popular',
      rating: 4.7,
      reviews: 213,
    },
  ]

  // Categories Data
  const categories = [
    { name: 'Audio', icon: '🎧', color: 'from-blue-500 to-blue-600' },
    { name: 'Electronics', icon: '📱', color: 'from-purple-500 to-purple-600' },
    { name: 'Workspace', icon: '💻', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Accessories', icon: '🎒', color: 'from-pink-500 to-pink-600' },
    { name: 'Home', icon: '🏠', color: 'from-green-500 to-green-600' },
    { name: 'Fashion', icon: '👕', color: 'from-yellow-500 to-yellow-600' },
  ]

  // Deals & Offers Data
  const deals = [
    {
      id: 1,
      title: 'Summer Mega Sale',
      subtitle: 'Up to 50% off on all electronics',
      discount: '50%',
      color: 'from-orange-500 to-red-500',
      icon: '🌞',
    },
    {
      id: 2,
      title: 'Bundle Bonanza',
      subtitle: 'Buy 2 get 1 free on accessories',
      discount: 'FREE',
      color: 'from-purple-500 to-pink-500',
      icon: '🎁',
    },
    {
      id: 3,
      title: 'Flash Deal',
      subtitle: 'Limited time: 35% off workspace items',
      discount: '35%',
      color: 'from-cyan-500 to-blue-500',
      icon: '⚡',
    },
  ]

  // Seasonal Banners Data
  const banners = [
    {
      id: 1,
      title: 'Exclusive Weekend Offer',
      subtitle: 'Amazing discounts on premium products',
      cta: 'Shop Now',
      gradient: 'from-yellow-400 via-red-500 to-pink-500',
      icon: '🔥',
    },
    {
      id: 2,
      title: 'Spring Collection Launch',
      subtitle: 'New arrivals this season - Fresh styles & innovation',
      cta: 'Explore',
      gradient: 'from-green-400 to-blue-500',
      icon: '🌸',
    },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Main Search & Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        <div className="container mx-auto px-6">
          {/* Search Bar */}
          <div className="mb-12">
            <div className="mx-auto max-w-2xl">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-slate-900 rounded-full border border-white/10 p-4 flex items-center gap-4">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search for products, categories, deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-linear-to-r from-indigo-500 to-purple-500 rounded-full px-6 py-2 font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/50 transition"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Welcome to <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ShopWave</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover amazing products, exclusive deals, and seasonal offers all in one place
            </p>
          </div>
        </div>
      </section>

      {/* Seasonal Banners */}
      <section className="container mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-linear-to-r ${banner.gradient} rounded-2xl p-8 md:p-12 text-white shadow-2xl hover:shadow-2xl hover:scale-105 transition duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-lg opacity-90">{banner.subtitle}</p>
                </div>
                <span className="text-4xl md:text-6xl">{banner.icon}</span>
              </div>
              <Link
                to="/products"
                className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-8 py-3 font-semibold hover:bg-white/30 transition"
              >
                {banner.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">Shop by Category</h2>
          <p className="text-slate-400">Browse our curated collections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className={`bg-linear-to-br ${category.color} rounded-xl p-6 text-center hover:scale-105 transition duration-300 shadow-lg hover:shadow-xl group cursor-pointer`}
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition">{category.icon}</div>
              <p className="font-semibold text-white">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals & Offers Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">Hot Deals & Offers</h2>
          <p className="text-slate-400">Don't miss these amazing limited-time offers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to="/products"
              className={`bg-linear-to-br ${deal.color} rounded-2xl p-8 text-white shadow-2xl hover:shadow-2xl hover:scale-105 transition duration-300 group overflow-hidden relative`}
            >
              <div className="absolute top-4 right-4 text-4xl group-hover:scale-125 transition">{deal.icon}</div>
              <div className="relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold mb-4">
                  {deal.discount} OFF
                </div>
                <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                <p className="text-white/90 mb-6">{deal.subtitle}</p>
                <button className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 font-semibold hover:bg-white/30 transition">
                  View Deal →
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">Featured Products</h2>
          <p className="text-slate-400">Best sellers and customer favorites</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur hover:border-indigo-500/50 hover:bg-slate-900/80 transition duration-300 overflow-hidden"
            >
              {/* Product Image Area */}
              <div className="relative h-48 bg-linear-to-r from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-6xl group-hover:scale-125 transition duration-300">
                  {product.image}
                </span>

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 bg-indigo-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white">
                    <Zap className="w-3 h-3" />
                    {product.badge}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white">
                    Save 33%
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                  {product.category}
                </p>
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-300 transition">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-white">{product.price}</span>
                  <span className="text-sm text-slate-400 line-through">
                    {product.originalPrice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    // Add to cart logic here
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full py-3 font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/50 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Browse our complete collection and find exactly what you're looking for
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse All Products
            </Link>
            <Link
              to="/joinus"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition"
            >
              <Tag className="w-5 h-5" />
              Join & Get Discounts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home