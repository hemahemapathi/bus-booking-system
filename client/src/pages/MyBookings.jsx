import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import StarRating from '../components/StarRating'
import BackButton from '../components/BackButton'
import Reveal from '../components/Reveal'

function CancelModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">🚌</div>
          <h3 className="text-lg font-bold text-gray-800">Cancel Booking?</h3>
          <p className="text-sm text-gray-500 mt-1">This action cannot be undone. Your seat will be released.</p>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">Keep Booking</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition">Yes, Cancel</button>
        </div>
      </div>
    </div>
  )
}

function ReviewModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return toast.error('Please select a rating')
    setLoading(true)
    try {
      await api.post('/reviews', { bookingId: booking._id, rating, comment })
      toast.success('Review submitted!')
      onSubmitted(booking._id)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Rate Your Journey</h3>
        <p className="text-sm text-gray-500 mb-4">{booking.bus?.name} · {booking.bus?.from} to {booking.bus?.to}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
            <StarRating value={rating} onChange={setRating} size="lg" />
            <p className="text-xs text-gray-400 mt-1">{['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][rating]}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Your Review (optional)</p>
            <textarea className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition resize-none" rows={3} placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)
  const [reviewBooking, setReviewBooking] = useState(null)
  const [reviewedIds, setReviewedIds] = useState(new Set())
  const timers = useRef([])

  const scheduleReminders = async (list) => {
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (Notification.permission === 'default') await Notification.requestPermission()

    const now = Date.now()

    list.filter(b => b.status === 'confirmed' && b.bus?.departureTime && b.date).forEach((b) => {
      const [h, m] = b.bus.departureTime.split(':').map(Number)
      const [year, month, day] = b.date.split('-').map(Number)
      const dep = new Date(year, month - 1, day, h, m, 0).getTime()
      const oneHourBefore = dep - 60 * 60 * 1000
      const title = '🚌 GoBus — Trip Reminder'
      const body = `Your bus ${b.bus.name} departs at ${b.bus.departureTime} today. Get ready!`

      // Already within the 1hr window right now — notify immediately
      if (now >= oneHourBefore && now < dep) {
        toast(`🔔 ${body}`, { duration: 10000, style: { background: '#1e293b', color: '#fff', fontWeight: 600 } })
        if (Notification.permission === 'granted') new Notification(title, { body, icon: '/favicon.svg' })
        return
      }

      // Schedule for exactly 1hr before departure (tab must stay open)
      const delay = oneHourBefore - now
      if (delay > 0) {
        const t = setTimeout(() => {
          toast(`🔔 ${body}`, { duration: 10000, style: { background: '#1e293b', color: '#fff', fontWeight: 600 } })
          if (Notification.permission === 'granted') new Notification(title, { body, icon: '/favicon.svg' })
        }, delay)
        timers.current.push(t)
      }
    })
  }

  useEffect(() => {
    Promise.all([api.get('/bookings/my'), api.get('/reviews/my')])
      .then(([bRes, rRes]) => {
        setBookings(bRes.data)
        setReviewedIds(new Set(rRes.data.map(r => r.booking)))
        scheduleReminders(bRes.data)
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const downloadTicket = async (bookingId) => {
    try {
      const res = await api.get('/bookings/ticket/' + bookingId, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = 'ticket-' + bookingId + '.pdf'; a.click()
      toast.success('Ticket downloaded!')
    } catch { toast.error('Download failed') }
  }

  const handleCancel = async () => {
    try {
      await api.patch('/bookings/cancel/' + cancelId)
      setBookings(prev => prev.map(b => b._id === cancelId ? { ...b, status: 'cancelled' } : b))
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancel failed')
    } finally { setCancelId(null) }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading your bookings...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {cancelId && <CancelModal onConfirm={handleCancel} onClose={() => setCancelId(null)} />}
      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} onSubmitted={(id) => setReviewedIds(prev => new Set([...prev, id]))} />}

      <div className="bg-red-600 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-red-200 text-sm">View and manage your bus tickets</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {bookings.length === 0 ? (
          <Reveal>
            <div className="bg-white rounded-2xl shadow p-16 text-center">
              <div className="text-5xl mb-4">🎟️</div>
              <p className="text-gray-500 text-lg">No bookings yet</p>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Reveal key={b._id}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`h-1 ${b.status === 'confirmed' ? 'bg-green-500' : b.status === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{b.bus?.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{b.status.toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-gray-500">{b.bus?.from} to {b.bus?.to} · {b.date}</p>
                      <p className="text-sm text-gray-500 mt-1">Seats: <span className="font-medium text-gray-700">{b.seats.join(', ')}</span></p>
                      <p className="text-xs text-gray-400 mt-1 font-mono">{b.bookingId}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-extrabold text-gray-900">Rs.{b.totalPrice}</p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {b.status === 'confirmed' && (
                          <button onClick={() => downloadTicket(b.bookingId)} className="flex items-center gap-1 bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                            Download
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button onClick={() => setCancelId(b._id)} className="border border-red-400 text-red-500 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {b.status === 'confirmed' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {reviewedIds.has(b._id) ? (
                        <p className="text-sm text-green-600">Reviewed this journey</p>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">How was your journey?</p>
                          <button onClick={() => setReviewBooking(b)} className="text-sm text-yellow-600 font-semibold hover:text-yellow-700 transition">
                            Rate and Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
