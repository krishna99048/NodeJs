import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-xl font-extrabold text-white">
          ShopWave
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link to="/products" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Products
          </Link>
          <Link to="/account" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Account
          </Link>
          <Link to="/wishlist" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Wishlist
          </Link>
          <Link to="/cart" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Cart
          </Link>
          <Link to="/support" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Support
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
