import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import StarRating from '../components/StarRating'
import Reveal from '../components/Reveal'

function ReviewsModal({ bus, onClose }) {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    api.get(`/reviews/bus/${bus._id}`).then(({ data }) => setReviews(data)).catch(() => setReviews([]))
  }, [bus._id])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">{bus.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(bus.rating)} size="sm" />
              <span className="text-sm text-gray-500">{bus.rating} · {reviews?.length || 0} reviews</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4">
          {reviews === null ? (
            <p className="text-center text-gray-400 py-8">Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No reviews yet</p>
          ) : reviews.map((r) => (
            <div key={r._id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    {r.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-sm text-gray-800">{r.user?.name}</span>
                </div>
                <StarRating value={r.rating} size="sm" />
              </div>
              {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import BackButton from '../components/BackButton'

export default function SearchResults() {
  const { state } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const buses = state?.buses || []
  const { from, to, date } = state?.searchParams || {}
  const [activeType, setActiveType] = useState('All')
  const [reviewBus, setReviewBus] = useState(null)

  const handleSelect = (bus) => {
    if (!user) { toast.error('Please login to book'); return navigate('/login') }
    navigate('/seats', { state: { bus, date } })
  }

  const busTypes = ['All', ...new Set(buses.map(b => b.busType))]
  const filtered = activeType === 'All' ? buses : buses.filter(b => b.busType === activeType)
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''

  return (
    <div className="min-h-screen bg-gray-100">
      {reviewBus && <ReviewsModal bus={reviewBus} onClose={() => setReviewBus(null)} />}

      <div className="bg-red-600 text-white px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3">
            <BackButton />
            <span className="font-bold text-lg">{from}</span>
            <span className="text-xl">→</span>
            <span className="font-bold text-lg">{to}</span>
            <span className="text-red-300 hidden sm:inline">|</span>
            <span className="text-sm text-red-200">{formatDate(date)}</span>
            <button onClick={() => navigate('/')} className="ml-auto bg-white text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-red-50">
              Modify
            </button>
          </div>
        </div>
      </div>

      {buses.length > 0 && (
        <div className="bg-white border-b shadow-sm px-4 py-3 overflow-x-auto">
          <div className="max-w-5xl mx-auto flex gap-2">
            {busTypes.map(type => (
              <button key={type} onClick={() => setActiveType(type)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  activeType === type ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-600'
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-5">
        <p className="text-gray-500 text-sm mb-4">{filtered.length} buses found</p>

        {filtered.length === 0 ? (
          <Reveal>
          <div className="bg-white rounded-2xl shadow p-16 text-center">
            <div className="text-5xl mb-4">🚌</div>
            <p className="text-gray-500 text-lg">No buses found for this route.</p>
            <button onClick={() => navigate('/')} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700">Search Again</button>
          </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {filtered.map((bus) => (
              <Reveal key={bus._id}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{bus.name}</h3>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{bus.busType}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{bus.operator}</p>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-800">{bus.departureTime}</p>
                        <p className="text-xs text-gray-400">{from}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-xs text-gray-400 mb-1">{bus.duration}</p>
                        <div className="w-full flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                          <div className="flex-1 h-0.5 bg-gray-200"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-800">{bus.arrivalTime}</p>
                        <p className="text-xs text-gray-400">{to}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {bus.amenities.map((a) => (
                        <span key={a} className="text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">✓ {a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:min-w-[130px]">
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-extrabold text-gray-900">₹{bus.price}</p>
                      <p className="text-xs text-gray-400">per seat</p>
                    </div>
                    <button onClick={() => setReviewBus(bus)}
                      className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg hover:bg-yellow-100 transition">
                      <span className="text-yellow-500 font-bold text-sm">★ {bus.rating}</span>
                      <span className="text-xs text-gray-400 underline">reviews</span>
                    </button>
                    <button onClick={() => handleSelect(bus)}
                      className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-700 transition text-sm whitespace-nowrap">
                      View Seats
                    </button>
                  </div>
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
