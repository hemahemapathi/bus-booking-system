import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import BackButton from '../components/BackButton'
import Reveal from '../components/Reveal'

export default function SeatSelection() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { bus, date } = state || {}
  const [bookedSeats, setBookedSeats] = useState([])
  const [seatGenderMap, setSeatGenderMap] = useState({})
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!bus) return navigate('/')
    api.get(`/buses/${bus._id}/seats`, { params: { date } }).then(({ data }) => {
      setBookedSeats(data.bookedSeats)
      setSeatGenderMap(data.seatGenderMap || {})
    })
  }, [])

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return
    setSelectedSeats((prev) => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat])
  }

  const holdCalled = useRef(false)

  const handleHold = async () => {
    if (selectedSeats.length === 0) return toast.error('Select at least one seat')
    if (holdCalled.current) return
    holdCalled.current = true
    setLoading(true)
    try {
      const { data } = await api.post('/bookings/hold', { busId: bus._id, date, seats: selectedSeats })
      navigate('/payment', { state: { bookingId: data.bookingId, bus, date, seats: selectedSeats, totalPrice: data.totalPrice } })
    } catch (err) {
      holdCalled.current = false
      toast.error(err.response?.data?.error || 'Failed to hold seats')
    } finally {
      setLoading(false)
    }
  }

  const getSeatStyle = (seat) => {
    if (selectedSeats.includes(seat))
      return 'bg-blue-500 border-blue-500 text-white'
    if (bookedSeats.includes(seat)) {
      const gender = seatGenderMap[seat]
      if (gender === 'Female') return 'bg-pink-400 border-pink-400 text-white cursor-not-allowed'
      if (gender === 'Other') return 'bg-purple-400 border-purple-400 text-white cursor-not-allowed'
      return 'bg-red-400 border-red-400 text-white cursor-not-allowed' // Male or unknown
    }
    return 'bg-gray-100 border-gray-300 hover:bg-green-100 hover:border-green-400 text-gray-700'
  }

  const totalSeats = bus?.totalSeats || 40
  const rows = Math.ceil(totalSeats / 4)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <p className="font-bold text-lg">{bus?.name}</p>
              <p className="text-red-200 text-sm">{bus?.from} → {bus?.to} · {date} · {bus?.busType}</p>
            </div>
          </div>
        </div>
      </div>

      <Reveal>
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Seat Map */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-gray-700 mb-4">Select Your Seats</h3>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-5 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-gray-100 border border-gray-300 inline-block"></span>Available</span>
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-red-400 inline-block"></span>Male Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-pink-400 inline-block"></span>Female Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-purple-400 inline-block"></span>Other Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-blue-500 inline-block"></span>Selected</span>
          </div>

          {/* Bus front */}
          <div className="flex justify-end mb-3">
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">🚌 Front</span>
          </div>

          {/* Seat grid 2+2 layout */}
          <div className="space-y-2">
            {Array.from({ length: rows }, (_, row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5 text-right">{row + 1}</span>
                <div className="flex gap-2">
                  {[0, 1].map((col) => {
                    const seat = row * 4 + col + 1
                    if (seat > totalSeats) return <div key={col} className="w-9 h-9" />
                    return (
                      <button key={col} onClick={() => toggleSeat(seat)}
                        className={`w-9 h-9 rounded-t-xl text-xs font-semibold border transition ${getSeatStyle(seat)}`}>
                        {seat}
                      </button>
                    )
                  })}
                </div>
                <div className="w-6" />
                <div className="flex gap-2">
                  {[2, 3].map((col) => {
                    const seat = row * 4 + col + 1
                    if (seat > totalSeats) return <div key={col} className="w-9 h-9" />
                    return (
                      <button key={col} onClick={() => toggleSeat(seat)}
                        className={`w-9 h-9 rounded-t-xl text-xs font-semibold border transition ${getSeatStyle(seat)}`}>
                        {seat}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full md:w-72">
          <div className="bg-white rounded-2xl shadow p-5 sticky top-20">
            <h3 className="font-bold text-gray-700 mb-4">Booking Summary</h3>
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Bus</span><span className="font-medium text-gray-800">{bus?.name}</span></div>
              <div className="flex justify-between"><span>Date</span><span className="font-medium text-gray-800">{date}</span></div>
              <div className="flex justify-between"><span>Seats</span><span className="font-medium text-gray-800">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}</span></div>
              <div className="flex justify-between"><span>Price/seat</span><span className="font-medium text-gray-800">₹{bus?.price}</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-red-600">₹{selectedSeats.length * (bus?.price || 0)}</span>
              </div>
            </div>
            <button onClick={handleHold} disabled={loading || selectedSeats.length === 0}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50">
              {loading ? 'Please wait...' : 'Proceed to Book'}
            </button>
          </div>
        </div>
      </div>
      </Reveal>
    </div>
  )
}
