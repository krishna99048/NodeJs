import React from 'react'
import { Link } from 'react-router-dom'

const Account = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Account dashboard</p>
          <h1 className="text-4xl font-extrabold mt-3">Welcome back, seller</h1>
          <p className="mt-4 text-slate-400 max-w-2xl">Manage your profile, review recent orders, and keep track of store performance from one place.</p>

          <div className="mt-10 space-y-6">
            <section className="rounded-3xl bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <p className="text-slate-300">Update your name, email address, shipping preferences, and business details.</p>
              <Link to="/edit-profile" className="mt-5 inline-flex rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-indigo-400 transition">Edit profile</Link>
            </section>

            <section className="rounded-3xl bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold mb-4">Recent orders</h2>
              <div className="space-y-4 text-slate-300">
                <div className="rounded-3xl bg-slate-950 p-4 border border-white/10">
                  <p className="font-semibold">Order #001892</p>
                  <p className="text-sm text-slate-400">Shipped • 3 items • $138</p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-4 border border-white/10">
                  <p className="font-semibold">Order #001883</p>
                  <p className="text-sm text-slate-400">Processing • 1 item • $42</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
              <p className="text-slate-300">Save products you want to bookmark or promote later.</p>
              <Link to="/wishlist" className="mt-5 inline-flex rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-indigo-500/10 transition">Open wishlist</Link>
            </section>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-slate-900/70 p-8 shadow-lg shadow-black/15">
            <h3 className="text-xl font-semibold text-white mb-4">Account stats</h3>
            <div className="space-y-4 text-slate-300">
              <p className="flex justify-between"><span>Total sales</span><span className="font-semibold">$18.2k</span></p>
              <p className="flex justify-between"><span>Active orders</span><span className="font-semibold">5</span></p>
              <p className="flex justify-between"><span>Favorites</span><span className="font-semibold">12</span></p>
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-900/70 p-8 shadow-lg shadow-black/15">
            <h3 className="text-xl font-semibold text-white mb-4">Customer support</h3>
            <p className="text-slate-300">Need help with an order or product listing? Visit the support page for FAQs and contact options.</p>
            <Link to="/support" className="mt-5 inline-flex rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-indigo-400 transition">Get support</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Account
