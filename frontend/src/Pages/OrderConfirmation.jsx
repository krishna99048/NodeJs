import React from 'react'
import { Link } from 'react-router-dom'

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
      <div className="max-w-4xl mx-auto rounded-4xl border border-white/10 bg-white/5 p-12 shadow-2xl shadow-black/25 text-center">
        <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-200">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-5xl font-extrabold">Order confirmed!</h1>
        <p className="mt-5 text-slate-400 text-lg">Your purchase is complete. We’re preparing your items and will send an email when your order is on the way.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-900/80 p-6 text-left">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Order number</p>
            <p className="mt-3 text-2xl font-semibold">#002194</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-6 text-left">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Delivery</p>
            <p className="mt-3 text-2xl font-semibold">2–4 business days</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/account" className="rounded-full bg-indigo-500 px-8 py-4 text-sm font-semibold text-slate-950 hover:bg-indigo-400 transition">View account</Link>
          <Link to="/products" className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-slate-100 hover:border-indigo-500 transition">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
