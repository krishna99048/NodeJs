import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95 text-slate-400">
      <div className="container mx-auto flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">ShopWave</p>
          <p className="mt-2 text-sm text-slate-500">Modern e-commerce UI built for fast selling.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/support" className="hover:text-white transition">Help</Link>
          <Link to="/products" className="hover:text-white transition">Shop</Link>
          <Link to="/account" className="hover:text-white transition">Account</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
