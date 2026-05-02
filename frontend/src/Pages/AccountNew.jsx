import React, { useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import { LogOut, ShoppingBag, Heart, User, MapPin } from 'lucide-react'

const Account = () => {
  const { user, logout, orders } = useContext(UserContext)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sign in to view your account</h1>
          <a href="/login" className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 transition">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-2">My Account</h1>
            <p className="text-slate-400">Welcome, {user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/20 text-red-400 px-6 py-3 rounded-full hover:bg-red-500/30 transition font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
            <ShoppingBag className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">{orders.length}</h3>
            <p className="text-slate-400">Total Orders</p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
            <Heart className="w-8 h-8 text-red-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">Saved Items</h3>
            <p className="text-slate-400">View your wishlist</p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
            <User className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">Profile</h3>
            <p className="text-slate-400">Edit your details</p>
          </div>
        </div>

        {orders.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {orders.slice(-3).reverse().map((order, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-400">Order #{idx + 1}</p>
                      <p className="text-lg font-bold text-white">${order.total.toFixed(2)}</p>
                    </div>
                    <span className="bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-sm font-semibold">Completed</span>
                  </div>
                  <p className="text-slate-400">{order.items.length} items</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Account
