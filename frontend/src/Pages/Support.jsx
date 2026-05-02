import React from 'react'
import { Link } from 'react-router-dom'

const faqs = [
  { question: 'How do I track my order?', answer: 'Visit your account dashboard and click “Recent orders” to view the latest status and shipping details.' },
  { question: 'Can I return a product?', answer: 'Yes. Most items can be returned within 30 days. Check the product listing for eligibility and return instructions.' },
  { question: 'How do I contact support?', answer: 'Use the live chat in the account dashboard or send an email to support@example.com.' },
]

const Support = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Support center</p>
          <h1 className="text-4xl font-extrabold mt-3">Help & information</h1>
          <p className="mt-4 text-slate-400">Find answers to common questions or reach out to customer support for additional help.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <h2 className="text-xl font-semibold">{faq.question}</h2>
                <p className="mt-3 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>

          <aside className="space-y-6 rounded-4xl border border-white/10 bg-slate-900/70 p-8 shadow-lg shadow-black/15">
            <h2 className="text-2xl font-semibold">Still need help?</h2>
            <p className="text-slate-300">Our team is available around the clock to answer questions about orders, listings, and policies.</p>
            <Link to="/support" className="inline-flex rounded-full bg-indigo-500 px-6 py-4 text-sm font-semibold text-slate-950 hover:bg-indigo-400 transition">Contact us</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Support
