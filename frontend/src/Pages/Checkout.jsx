import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, Lock } from 'lucide-react'
import { UserContext } from '../Context/UserContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, user, addOrder } = useContext(UserContext)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const order = {
      items: cartItems,
      shipping: formData.address,
      total,
      subtotal,
      tax,
      shippingCost: shipping,
      customerInfo: formData,
    }
    addOrder(order)
    navigate('/order-confirmation')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-slate-400 mb-8">Add items to your cart before checking out</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-white mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      s <= step
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`h-1 w-8 mx-2 ${s < step ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>}
                </div>
              ))}
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Truck className="w-6 h-6" />
                    Shipping Address
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-full transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="w-6 h-6" />
                    Payment Method
                  </h2>

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      name="cardCVC"
                      placeholder="CVC"
                      value={formData.cardCVC}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-white/10 text-white font-bold py-3 rounded-full hover:border-white/30 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-full transition"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Lock className="w-6 h-6" />
                    Review & Confirm
                  </h2>

                  <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-white">Shipping To:</h3>
                    <p className="text-slate-300">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zip}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 border border-white/10 text-white font-bold py-3 rounded-full hover:border-white/30 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white">Order Summary</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-slate-300">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
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

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-indigo-300">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
                  <input type="text" placeholder="City" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  <input type="text" placeholder="Postal code" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-900/70 p-6">
              <h2 className="text-xl font-semibold mb-4">Payment method</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Card number" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" placeholder="Expiry date" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  <input type="text" placeholder="CVV" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/15">
            <h2 className="text-xl font-semibold mb-4">Order summary</h2>
            <div className="space-y-4 text-slate-300">
              <div className="flex justify-between"><span>Minimal Desk Organizer</span><span>$42</span></div>
              <div className="flex justify-between"><span>Wireless Speaker</span><span>$158</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$12</span></div>
            </div>
            <div className="border-t border-white/10 pt-4 mt-4 text-white text-xl font-semibold flex justify-between">
              <span>Total</span><span>$212</span>
            </div>
            <Link
              to="/order-confirmation"
              className="mt-6 block rounded-full bg-indigo-500 px-6 py-4 text-center font-semibold text-slate-950 hover:bg-indigo-400 transition"
            >
              Place order
            </Link>
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-900/70 p-6 text-slate-300">
            <h3 className="text-lg font-semibold mb-2">Need help?</h3>
            <p className="leading-7">Our support team is available 24/7 to help with questions about orders, returns, and product details.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
