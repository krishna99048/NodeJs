import React from 'react'

const stats = [
  { label: 'Total sales', value: '$18.2k' },
  { label: 'Active listings', value: '42' },
  { label: 'Pending orders', value: '5' },
  { label: 'Customer messages', value: '8' },
]

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Admin dashboard</p>
          <h1 className="text-4xl font-extrabold mt-3">Store management</h1>
          <p className="mt-4 text-slate-400">Monitor performance, approve listings, and manage orders from the admin panel.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/15">
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">{stat.label}</p>
              <p className="mt-5 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-4xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/15">
            <h2 className="text-xl font-semibold mb-4">Inventory</h2>
            <p className="text-slate-300">Review active products, update stock levels, and keep your catalog fresh.</p>
          </div>
          <div className="rounded-4xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/15">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p className="text-slate-300">Track new orders, manage shipments, and resolve customer service requests quickly.</p>
          </div>
          <div className="rounded-4xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/15">
            <h2 className="text-xl font-semibold mb-4">Payments</h2>
            <p className="text-slate-300">Monitor payouts, payment failures, and merchant account status from a single place.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
