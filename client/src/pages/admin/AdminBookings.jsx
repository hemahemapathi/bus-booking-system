import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Reveal from '../../components/Reveal'

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <p className="text-gray-800 font-semibold text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleteId, setDeleteId] = useState(null)

  const load = () => api.get('/admin/bookings').then(({ data }) => setBookings(data)).catch(() => toast.error('Failed')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/bookings/${id}`)
      toast.success('Booking deleted')
      setDeleteId(null)
      setBookings(b => b.filter(x => x._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed')
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this booking?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
      <div className="bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">All Bookings</h1>
        <p className="text-sm text-gray-400">{bookings.length} total bookings</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-4">
          {['all','confirmed','held','cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${filter === s ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}>
              {s}
            </button>
          ))}
        </div>

        <Reveal>
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Booking ID','User','Bus','Route','Date','Seats','Amount','Status','Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b._id} className={`hover:bg-red-50/30 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{b.bookingId}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{b.user?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-700">{b.bus?.name}</td>
                  <td className="px-5 py-4 text-gray-500">{b.bus?.from} → {b.bus?.to}</td>
                  <td className="px-5 py-4 text-gray-500">{b.date}</td>
                  <td className="px-5 py-4 text-gray-500">{b.seats.join(', ')}</td>
                  <td className="px-5 py-4 font-bold text-gray-800">₹{b.totalPrice}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                      b.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDeleteId(b._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No bookings found</p>}
        </div>
        </Reveal>
      </div>
    </div>
  )
}
