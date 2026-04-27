import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '../api/axios'
import toast from 'react-hot-toast'
import BackButton from '../components/BackButton'
import FeedbackModal from '../components/FeedbackModal'
import Reveal from '../components/Reveal'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

function PaymentForm({ bookingId, seats, finalPrice, loading, setLoading, passengers, setPassengers, setConfirmedBookingId, setShowFeedback }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const updatePassenger = (i, field, value) => {
    const updated = [...passengers]
    updated[i] = { ...updated[i], [field]: value }
    setPassengers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const { data } = await api.post('/bookings/payment-intent', { bookingId })
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      })
      if (result.error) { toast.error(result.error.message); setLoading(false); return }
      await api.post('/bookings/confirm', {
        bookingId,
        passengers: passengers.map(p => ({ ...p, age: Number(p.age) })),
      })
      toast.success('Booking confirmed!')
      setConfirmedBookingId(bookingId)
      setShowFeedback(true)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Passenger Details</h3>
        {passengers.map((p, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">Passenger {i + 1} · Seat {seats[i]}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition" placeholder="Full Name" value={p.name} onChange={e => updatePassenger(i, 'name', e.target.value)} required />
              <input className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition" type="number" placeholder="Age" value={p.age} onChange={e => updatePassenger(i, 'age', e.target.value)} required />
              <select className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition" value={p.gender} onChange={e => updatePassenger(i, 'gender', e.target.value)}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-3">Card Details</h3>
        <div className="border-2 border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-red-500 transition bg-white">
          <CardElement options={{ style: { base: { fontSize: '15px', color: '#374151', '::placeholder': { color: '#9ca3af' } } } }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">🔒 Test: <span className="font-mono">4242 4242 4242 4242</span> · Any future date · Any CVC</p>
      </div>

      <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-base hover:bg-red-700 transition disabled:opacity-50 shadow-lg shadow-red-200" disabled={loading}>
        {loading ? 'Processing Payment...' : `Pay Rs.${finalPrice}`}
      </button>
    </form>
  )
}

export default function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [appliedCode, setAppliedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [coupons, setCoupons] = useState([])
  const [couponLoading, setCouponLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState(null)
  const [passengers, setPassengers] = useState(() =>
    state?.seats?.map(() => ({ name: '', age: '', gender: 'Male' })) || []
  )

  useEffect(() => {
    api.get('/coupons').then(({ data }) => setCoupons(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!state) navigate('/')
  }, [state, navigate])

  if (!state) return null

  const { bookingId, bus, date, seats, totalPrice } = state

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent' ? Math.round(totalPrice * appliedCoupon.value / 100) : appliedCoupon.value
    : 0
  const finalPrice = Math.max(0, totalPrice - discount)

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCouponLoading(true)
    try {
      const { data } = await api.post('/coupons/validate', { code, totalPrice })
      setAppliedCoupon(data)
      setAppliedCode(data.code)
      toast.success(data.desc + ' applied!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setAppliedCode('')
    setCouponInput('')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showFeedback && (
        <FeedbackModal
          bookingId={confirmedBookingId}
          onClose={() => { setShowFeedback(false); navigate('/my-bookings') }}
        />
      )}
      <div className="bg-red-600 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <p className="font-bold text-lg">{bus.name}</p>
              <p className="text-red-200 text-sm">{bus.from} to {bus.to} · {date} · {bus.busType}</p>
            </div>
          </div>
        </div>
      </div>

      <Reveal>
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">

        {/* Left — form */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          <Elements stripe={stripePromise}>
            <PaymentForm
              bookingId={bookingId}
              seats={seats}
              finalPrice={finalPrice}
              loading={loading}
              setLoading={setLoading}
              passengers={passengers}
              setPassengers={setPassengers}
              setConfirmedBookingId={setConfirmedBookingId}
              setShowFeedback={setShowFeedback}
            />
          </Elements>
        </div>

        {/* Right — coupon + summary */}
        <div className="w-full md:w-72 space-y-4">

          {/* Coupon */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🎁</span> Apply Coupon
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3">
                <div>
                  <p className="font-bold text-green-700 font-mono">{appliedCode}</p>
                  <p className="text-xs text-green-600 mt-0.5">{appliedCoupon.desc}</p>
                </div>
                <button onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline ml-2">✕ Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="flex-1 min-w-0 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-red-500 transition"
                  placeholder="ENTER CODE"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="shrink-0 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            <div className="mt-3 space-y-2">
              {coupons.map(c => (
                <button key={c.code} onClick={() => setCouponInput(c.code)}
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 rounded-lg px-3 py-2 transition">
                  <span className="font-mono font-bold text-xs text-red-600">{c.code}</span>
                  <span className="text-xs text-gray-500">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fare Summary */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-gray-800 mb-4">Fare Summary</h3>
            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Base Fare ({seats.length} seat{seats.length > 1 ? 's' : ''})</span>
                <span>Rs.{totalPrice}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon ({appliedCode})</span>
                  <span>- Rs.{discount}</span>
                </div>
              )}
              <div className="border-t pt-2.5 flex justify-between font-bold text-gray-900 text-base">
                <span>Total Payable</span>
                <span className="text-red-600">Rs.{finalPrice}</span>
              </div>
            </div>
            {discount > 0 && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-2.5 text-xs text-green-700 font-semibold text-center">
                🎉 You save Rs.{discount} with {appliedCode}!
              </div>
            )}
          </div>

          {/* Assurance & Cancellation */}
          <div className="bg-white rounded-2xl shadow p-5 space-y-3">
            <h3 className="font-bold text-gray-800 mb-1">Booking Assurance</h3>
            {[
              { icon: '❌', title: 'Free Cancellation', desc: 'Cancel anytime before journey for full refund' },
              { icon: '🛡️', title: 'Travel Assurance', desc: 'Covered for delays and trip disruptions' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Your card details are never stored' },
              { icon: '📄', title: 'Instant Ticket', desc: 'PDF ticket sent immediately after payment' },
            ].map(a => (
              <div key={a.title} className="flex gap-3 items-start">
                <span className="text-lg mt-0.5">{a.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      </Reveal>
    </div>
  )
}
