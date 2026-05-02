import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-slate-950">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
