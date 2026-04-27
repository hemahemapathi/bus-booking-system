import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

import Reveal from '../components/Reveal'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function DatePicker({ value, onChange, min }) {
  const today = new Date()
  today.setHours(0,0,0,0)
  const minDate = min ? new Date(min) : today

  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const firstDay = new Date(cursor.year, cursor.month, 1).getDay()

  const prevMonth = () => {
    setCursor(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  }
  const nextMonth = () => {
    setCursor(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })
  }

  const select = (day) => {
    const d = new Date(cursor.year, cursor.month, day)
    if (d < minDate) return
    const iso = `${cursor.year}-${String(cursor.month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    onChange(iso)
    setOpen(false)
  }

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Select date'

  const selectedDay = value ? new Date(value + 'T00:00:00') : null

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`w-full border-2 rounded-xl px-4 py-2.5 text-left font-medium flex items-center justify-between transition ${
          open ? 'border-red-500' : 'border-gray-200'
        } ${value ? 'text-gray-800' : 'text-gray-400'}`}>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          {displayValue}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-bold text-gray-800 text-sm">{MONTHS[cursor.month]} {cursor.year}</span>
            <button type="button" onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={'e'+i} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const d = new Date(cursor.year, cursor.month, day)
              const isPast = d < minDate
              const isToday = d.toDateString() === today.toDateString()
              const isSelected = selectedDay && d.toDateString() === selectedDay.toDateString()
              return (
                <button key={day} type="button" onClick={() => select(day)} disabled={isPast}
                  className={`w-8 h-8 mx-auto rounded-full text-xs font-medium transition flex items-center justify-center ${
                    isSelected ? 'bg-red-600 text-white font-bold' :
                    isToday ? 'border-2 border-red-400 text-red-600 font-bold' :
                    isPast ? 'text-gray-300 cursor-not-allowed' :
                    'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}>
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
            <button type="button" onClick={() => { onChange(''); setOpen(false) }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
            <button type="button" onClick={() => select(today.getDate())} className="text-xs text-red-600 font-semibold hover:text-red-700">Today</button>
          </div>
        </div>
      )}
    </div>
  )
}

const ADS = [
  { bg: 'bg-linear-to-br from-red-500 to-rose-600', emoji: '🔥', tag: 'LIMITED OFFER', title: 'Up to 20% Off on Weekend Trips!', desc: 'Book your weekend getaway and save big on select routes.', cta: 'Book Now' },
  { bg: 'bg-linear-to-br from-violet-500 to-purple-600', emoji: '🎁', tag: 'COUPON DEAL', title: 'Save Rs.100 with TRAVEL100', desc: 'Apply at checkout on bookings above Rs.500. Limited time!', cta: 'Grab Deal' },
  { bg: 'bg-linear-to-br from-amber-400 to-orange-500', emoji: '⚡', tag: 'NEW FEATURE', title: 'Instant PDF Tickets', desc: 'Get your ticket PDF immediately after payment. Always ready.', cta: 'Learn More' },
  { bg: 'bg-linear-to-br from-emerald-400 to-teal-600', emoji: '🛡️', tag: 'TRAVEL SAFE', title: 'Free Cancellation Always', desc: 'Cancel any booking before journey for a 100% refund.', cta: 'Book Freely' },
]

function AdBanner({ onCtaClick }) {
  const [active, setActive] = useState(0)
  const timerRef = useRef()

  const startTimer = useRef(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(i => (i + 1) % ADS.length), 3000)
  }).current

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [startTimer])

  const go = (i) => { setActive((i + ADS.length) % ADS.length); startTimer() }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        {/* Slides */}
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${active * 100}%)` }}>
          {ADS.map((ad, i) => (
            <div key={i} className={`${ad.bg} min-w-full text-white`}>
              {/* Mobile layout */}
              <div className="flex md:hidden items-center gap-3 px-5 pt-5 pb-3">
                <span className="text-4xl shrink-0">{ad.emoji}</span>
                <div className="min-w-0">
                  <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full tracking-wide">{ad.tag}</span>
                  <h3 className="text-base font-extrabold mt-1 leading-tight">{ad.title}</h3>
                </div>
              </div>
              <div className="flex md:hidden items-center justify-between gap-3 px-5 pb-5">
                <p className="text-xs text-white/80 flex-1">{ad.desc}</p>
                <button onClick={onCtaClick} className="shrink-0 bg-white text-gray-800 font-bold text-xs px-4 py-2 rounded-xl hover:bg-white/90 transition whitespace-nowrap">
                  {ad.cta} →
                </button>
              </div>
              {/* Desktop layout */}
              <div className="hidden md:flex items-center justify-between gap-6 px-8 py-6">
                <div className="flex items-center gap-5">
                  <span className="text-5xl">{ad.emoji}</span>
                  <div>
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full tracking-wide">{ad.tag}</span>
                    <h3 className="text-lg font-extrabold mt-1.5 mb-0.5">{ad.title}</h3>
                    <p className="text-sm text-white/80">{ad.desc}</p>
                  </div>
                </div>
                <button onClick={onCtaClick} className="shrink-0 bg-white text-gray-800 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition whitespace-nowrap">
                  {ad.cta} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {ADS.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'How do I book a bus ticket?', a: 'Search for your route, select seats, fill passenger details, and pay securely via card. Your ticket is confirmed instantly.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel any confirmed booking from the My Bookings page before the journey date for a full refund.' },
  { q: 'How do I download my ticket?', a: 'Go to My Bookings, find your confirmed booking and click Download Ticket to get a PDF.' },
  { q: 'Is my payment secure?', a: 'Yes, all payments are processed securely through Stripe. We never store your card details.' },
  { q: 'Can I book for multiple passengers?', a: 'Yes, select multiple seats and fill in details for each passenger during checkout.' },
  { q: 'Are there any coupons available?', a: 'Yes! Use FIRST10 for 10% off, SAVE50 for Rs.50 off, or TRAVEL100 for Rs.100 off on bookings above Rs.500.' },
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ from: '', to: '', date: '' })
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [popularRoutes, setPopularRoutes] = useState([])
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/buses/all')
      .then(({ data }) => {
        const seen = new Set()
        const routes = []
        data.forEach(b => {
          const key = b.from + '-' + b.to
          if (!seen.has(key)) { seen.add(key); routes.push({ from: b.from, to: b.to }) }
        })
        setPopularRoutes(routes.slice(0, 4))
      }).catch(() => {})

    if (user?.role === 'admin') {
      api.get('/admin/dashboard')
        .then(({ data }) => setStats(data))
        .catch(() => {})
    }

    api.get('/reviews/recent')
      .then(({ data }) => setReviews(data))
      .catch(() => {})
  }, [user])

  // Re-fetch reviews when user returns to tab
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') api.get('/reviews/recent').then(({ data }) => setReviews(data)).catch(() => {}) }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.get('/buses/search', { params: form })
      navigate('/search', { state: { buses: data, searchParams: form } })
    } catch {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">

      {/* Hero + Search */}
      <div className="bg-red-600 pb-14 pt-10 px-4">
        <h1 className="text-center text-white text-2xl md:text-3xl font-bold mb-1">
          India's No. 1 Online Bus Ticket Booking
        </h1>
        <p className="text-center text-red-200 text-sm mb-8">Book bus tickets easily and travel comfortably</p>

        {/* Search Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">From</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">📍</span>
                  <input className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 font-medium focus:outline-none focus:border-red-500 transition" placeholder="Enter source city" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} required />
                </div>
              </div>

              <button type="button" onClick={() => setForm({ ...form, from: form.to, to: form.from })}
                className="hidden md:flex w-10 h-10 shrink-0 rounded-full border-2 border-gray-200 hover:border-red-400 text-gray-500 hover:text-red-500 transition items-center justify-center text-lg mb-0.5">
                ⇄
              </button>

              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">To</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">📍</span>
                  <input className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 font-medium focus:outline-none focus:border-red-500 transition" placeholder="Enter destination city" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} required />
                </div>
              </div>

              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date of Journey</label>
                <DatePicker
                  value={form.date}
                  onChange={date => setForm({ ...form, date })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button className="w-full md:w-auto bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 whitespace-nowrap" disabled={loading}>
                {loading ? 'Searching...' : 'Search Buses'}
              </button>
            </div>

            <div className="flex md:hidden justify-center mt-2">
              <button type="button" onClick={() => setForm({ ...form, from: form.to, to: form.from })} className="text-sm text-red-500 font-medium">⇄ Swap cities</button>
            </div>
          </form>
        </div>
      </div>

      {/* Real Stats */}
      {stats && (
        <Reveal>
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: stats.totalBuses + '+', label: 'Buses Available' },
              { value: stats.confirmedBookings + '+', label: 'Confirmed Bookings' },
              { value: stats.totalUsers + '+', label: 'Registered Users' },
              { value: 'Rs.' + (stats.totalRevenue ?? 0).toLocaleString(), label: 'Total Revenue' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-extrabold text-red-600">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      )}

      {/* Ad Banner */}
      <Reveal>
        <AdBanner onCtaClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      </Reveal>

      {/* Popular Routes — real data */}
      {popularRoutes.length > 0 && (
        <Reveal>
        <div className="bg-white py-8 px-4">
          <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Popular Routes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularRoutes.map((r) => (
              <button key={r.from + r.to} onClick={() => setForm({ ...form, from: r.from, to: r.to })}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:border-red-400 hover:shadow-md transition group">
                <p className="font-semibold text-gray-800 text-sm group-hover:text-red-600">{r.from}</p>
                <p className="text-xs text-gray-400 my-0.5">to</p>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-red-600">{r.to}</p>
              </button>
            ))}
          </div>
          </div>
        </div>
        </Reveal>
      )}

      {/* What's New */}
      <Reveal>
      <div className="bg-red-50 border-y border-red-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
            <h2 className="text-lg font-bold text-gray-800">What's New</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '💳', title: 'Instant Stripe Payments', desc: 'Pay securely with any card. Booking confirmed in seconds.' },
              { icon: '📄', title: 'PDF Ticket Download', desc: 'Download your ticket as PDF anytime from My Bookings.' },
              { icon: '⭐', title: 'Rate Your Journey', desc: 'Share your travel experience and help other passengers.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-4 border border-red-100 flex gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Reveal>

      {/* How to Book */}
      <Reveal>
      <div className="bg-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">How to Book in 4 Easy Steps</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: '01', icon: '🔍', title: 'Search', desc: 'Enter source, destination and date' },
            { step: '02', icon: '💺', title: 'Select Seat', desc: 'Pick your preferred seat' },
            { step: '03', icon: '💳', title: 'Pay', desc: 'Secure payment via Stripe' },
            { step: '04', icon: '🎟️', title: 'Get Ticket', desc: 'Download your PDF ticket' },
          ].map((s, i) => (
            <div key={s.step} className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{s.step}</div>
              <div className="text-3xl mt-2 mb-2">{s.icon}</div>
              <p className="font-bold text-gray-800 text-sm">{s.title}</p>
              <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
              {i < 3 && <div className="hidden md:block absolute top-1/2 -right-2 text-gray-300 text-lg z-10">→</div>}
            </div>
          ))}
        </div>
        </div>
      </div>
      </Reveal>

      {/* Why Choose Us */}
      <Reveal>
      <div className="bg-gray-800 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold mb-6 text-center">Why Choose GoBus?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🔒', title: 'Secure Payments', desc: 'All transactions encrypted via Stripe' },
              { icon: '❌', title: 'Free Cancellation', desc: 'Cancel anytime before journey date' },
              { icon: '🛡️', title: 'Travel Assurance', desc: 'Covered for delays and cancellations' },
              { icon: '💺', title: 'Seat Choice', desc: 'Pick any available seat you like' },
              { icon: '🕐', title: '24/7 Booking', desc: 'Book tickets anytime, day or night' },
              { icon: '⭐', title: 'Verified Reviews', desc: 'Real reviews from real travellers' },
            ].map(item => (
              <div key={item.title} className="flex gap-3 items-start bg-gray-700 rounded-xl p-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Reveal>

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <Reveal>
        <div className="bg-white py-10 px-4">
          <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-1 text-center">What Our Travellers Say</h2>
          <p className="text-sm text-gray-400 text-center mb-6">Real reviews from verified passengers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {r.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{r.user?.name}</p>
                      <p className="text-xs text-gray-400">{r.bus?.from} → {r.bus?.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-base ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-gray-600 leading-relaxed">"{r.comment}"</p>}
                <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
        </Reveal>
      )}

      {/* FAQs */}
      <Reveal>
      <div className="bg-white border-y py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-50 transition">
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  <span className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      </Reveal>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-4 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white text-xl font-extrabold mb-2">🚌 GoBus</p>
            <p className="text-xs leading-relaxed">India's most trusted online bus ticket booking platform. Travel smart, travel safe.</p>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Quick Links</p>
            <div className="space-y-2 text-xs">
              <Link to="/" className="block hover:text-white transition">Home</Link>
              <Link to="/my-bookings" className="block hover:text-white transition">My Bookings</Link>
              <Link to="/login" className="block hover:text-white transition">Login</Link>
              <Link to="/register" className="block hover:text-white transition">Register</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Popular Routes</p>
            <div className="space-y-2 text-xs">
              {popularRoutes.map(r => (
                <p key={r.from + r.to} className="hover:text-white transition cursor-pointer"
                  onClick={() => { setForm({ ...form, from: r.from, to: r.to }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  {r.from} to {r.to}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Support</p>
            <div className="space-y-2 text-xs">
              <p>📧 support@GoBus.in</p>
              <p>📞 1800-123-4567</p>
              <p>🕐 24/7 Support</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <p>2026 GoBus. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition"><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></span>
            <span className="hover:text-white cursor-pointer transition"><Link to="/terms" className="hover:text-white">Terms of Service</Link></span>
            <span className="hover:text-white cursor-pointer transition"><Link to="/refund" className="hover:text-white">Refund Policy</Link></span>
          </div>
        </div>
      </footer>

    </div>
  )
}
