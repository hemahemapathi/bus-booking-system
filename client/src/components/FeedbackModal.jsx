import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className={`text-4xl transition ${s <= (hovered || value) ? 'text-yellow-400' : 'text-gray-200'}`}
        >★</button>
      ))}
    </div>
  )
}

const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent!']

export default function FeedbackModal({ onClose, bookingId = null }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return toast.error('Please select a rating')
    setLoading(true)
    try {
      if (bookingId) {
        await api.post('/reviews', { bookingId, rating, comment })
      } else {
        // General site feedback — store in localStorage
        const feedbacks = JSON.parse(localStorage.getItem('siteFeedbacks') || '[]')
        feedbacks.push({ rating, comment, date: new Date().toISOString() })
        localStorage.setItem('siteFeedbacks', JSON.stringify(feedbacks))
      }
      setSubmitted(true)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
      <div className="text-5xl mb-3 flex justify-center">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">Thank You!</h3>
          <p className="text-sm text-gray-500 mb-5">Your feedback helps us improve.</p>
          <button onClick={onClose} className="w-full bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="bg-red-600 rounded-t-2xl px-6 py-5 text-center text-white">
          <p className="mb-1">
            <svg className="w-7 h-7 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>
          </p>
          <h3 className="text-lg font-bold">{bookingId ? 'Rate Your Journey' : 'How was your experience?'}</h3>
          <p className="text-red-200 text-xs mt-1">{bookingId ? 'Share your travel experience' : 'Help us serve you better'}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center">
            <StarPicker value={rating} onChange={setRating} />
            <p className="text-sm font-semibold text-gray-600 mt-2 h-5">{labels[rating]}</p>
          </div>
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition resize-none"
            rows={3}
            placeholder="Tell us more (optional)..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
              Skip
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 text-sm">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
