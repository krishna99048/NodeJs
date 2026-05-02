import React, { useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield } from 'lucide-react'
import { UserContext } from '../Context/UserContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useContext(UserContext)
  const [quantity, setQuantity] = useState(1)

  // Sample product data
  const productsMap = {
    1: { id: 1, name: 'Premium Wireless Headphones', price: 199.99, category: 'Audio', rating: 4.8, reviews: 328, image: '🎧', inStock: true },
    2: { id: 2, name: 'Ultra HD 4K Webcam', price: 129.99, category: 'Electronics', rating: 4.6, reviews: 156, image: '📷', inStock: true },
    3: { id: 3, name: 'Ergonomic Desk Lamp', price: 89.99, category: 'Workspace', rating: 4.9, reviews: 92, image: '💡', inStock: true },
    4: { id: 4, name: 'Mechanical Keyboard RGB', price: 159.99, category: 'Accessories', rating: 4.7, reviews: 213, image: '⌨️', inStock: true },
  }

  const product = productsMap[id] || productsMap[1]

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
    alert('Added to cart!')
  }

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link to="/" className="hover:text-indigo-300 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-300 transition">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-12 flex items-center justify-center min-h-96 overflow-hidden">
            <span className="text-9xl animate-bounce">{product.image}</span>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Rating */}
            <p className="text-sm uppercase tracking-wider text-indigo-300 mb-3">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-300">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-2">Price</p>
              <p className="text-5xl font-bold text-white">${product.price.toFixed(2)}</p>
              <p className="text-sm text-green-400 mt-2">✓ In Stock</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-slate-300 mb-4">
                Experience premium quality with this {product.name.toLowerCase()}. Designed for professionals and enthusiasts alike, featuring cutting-edge technology and superior craftsmanship.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>✓ Premium build quality</li>
                <li>✓ Advanced features</li>
                <li>✓ Warranty included</li>
                <li>✓ Fast shipping available</li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 text-center bg-slate-800 border border-white/10 rounded-lg"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full py-4 font-bold text-white hover:shadow-lg hover:shadow-indigo-500/50 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`px-8 py-4 rounded-full transition font-semibold ${
                  isInWishlist(product.id)
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-indigo-400 mt-1" />
                <div>
                  <p className="font-semibold text-white">Fast Shipping</p>
                  <p className="text-sm text-slate-400">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-6 h-6 text-indigo-400 mt-1" />
                <div>
                  <p className="font-semibold text-white">Easy Returns</p>
                  <p className="text-sm text-slate-400">30-day guarantee</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-indigo-400 mt-1" />
                <div>
                  <p className="font-semibold text-white">Secure Payment</p>
                  <p className="text-sm text-slate-400">SSL encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Related Products</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((pid) => (
              pid !== product.id && (
                <Link
                  key={pid}
                  to={`/product/${pid}`}
                  className="group rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur hover:border-indigo-500/50 hover:bg-slate-900/80 transition duration-300 overflow-hidden p-6"
                >
                  <div className="text-6xl mb-4 group-hover:scale-125 transition">
                    🎧
                  </div>
                  <p className="text-sm text-slate-400 mb-2">Audio</p>
                  <h3 className="font-bold text-white line-clamp-2">Related Product</h3>
                  <p className="text-indigo-300 font-semibold mt-4">$99.99</p>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
