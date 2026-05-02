import React from 'react'
import { Link } from 'react-router-dom'

const wishlistItems = [
  { id: 'studio-lamp', name: 'Studio Lamp', price: '$35', status: 'Popular choice' },
  { id: 'travel-bag', name: 'Travel Bag', price: '$64', status: 'Must-have' },
]

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Wishlist</p>
          <h1 className="text-4xl font-extrabold mt-3">Saved favorites</h1>
          <p className="mt-4 text-slate-400">Keep track of products you love and add them to your cart when you’re ready.</p>
        </div>

        <div className="space-y-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">{item.status}</p>
                <h2 className="text-2xl font-semibold mt-2">{item.name}</h2>
                <p className="text-slate-400 mt-2">{item.price}</p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <Link to={`/product/${item.id}`} className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-indigo-400 transition">View product</Link>
                <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 hover:bg-white/10 transition">Move to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
