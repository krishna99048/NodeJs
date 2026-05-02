import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { UserContext } from '../Context/UserContext'

const Cart = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useContext(UserContext)

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-white mb-2">Shopping Cart</h1>
        <p className="text-slate-400 mb-12">{cartItems.length} items in your cart</p>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 bg-slate-900/50 border border-white/10 rounded-2xl hover:border-indigo-500/30 transition"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center text-4xl">
                      {item.image || '📦'}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`} className="font-bold text-white hover:text-indigo-300 transition">
                        {item.name}
                      </Link>
                      <p className="text-sm text-slate-400 mt-1">{item.category}</p>
                      <p className="text-lg font-bold text-indigo-300 mt-2">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-700 rounded transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-700 rounded transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                      <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 text-indigo-300 hover:text-indigo-200 transition"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>

                <div className="space-y-3 border-t border-b border-white/10 py-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-indigo-300">${total.toFixed(2)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full py-4 font-bold text-white hover:shadow-lg hover:shadow-indigo-500/50 transition"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-white/10 text-slate-300 hover:text-red-400 hover:border-red-400/30 rounded-full transition font-semibold"
                >
                  Clear Cart
                </button>

                {/* Promo Code */}
                <div>
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-slate-100 placeholder-slate-500 mb-2"
                  />
                  <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition font-semibold">
                    Apply Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="w-20 h-20 mx-auto text-slate-600 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-slate-400 mb-8">Add some products to get started!</p>
            <Link
              to="/products"
              className="inline-block bg-linear-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
            <h1 className="text-4xl font-extrabold mt-3">Ready to checkout </h1>
          </div>
          <Link to="/products" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-indigo-500/10 transition">Continue shopping</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-0">
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                </div>
                <span className="text-lg font-bold">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6 rounded-4xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/15">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Order summary</p>
              <div className="mt-4 space-y-3 text-slate-300">
                <p className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></p>
                <p className="flex justify-between"><span>Shipping</span><span>${shipping}</span></p>
                <p className="flex justify-between"><span>Tax</span><span>${tax}</span></p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 text-white text-xl font-semibold flex justify-between">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <Link to="/checkout" className="block rounded-full bg-indigo-500 px-6 py-4 text-center font-semibold text-slate-950 hover:bg-indigo-400 transition">Proceed to checkout</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
