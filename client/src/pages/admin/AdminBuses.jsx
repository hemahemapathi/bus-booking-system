import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Reveal from '../../components/Reveal'
const empty = { name: '', operator: '', from: '', to: '', departureTime: '', arrivalTime: '', duration: '', price: '', totalSeats: 40, busType: 'AC Sleeper', amenities: '', rating: 4.5 }

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

export default function AdminBuses() {
  const [buses, setBuses] = useState([])
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = () => api.get('/admin/buses').then(({ data }) => setBuses(data)).catch(() => toast.error('Failed to load buses'))

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), totalSeats: Number(form.totalSeats), rating: Number(form.rating), amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean) }
    try {
      if (editId) { await api.put(`/admin/buses/${editId}`, payload); toast.success('Bus updated') }
      else { await api.post('/admin/buses', payload); toast.success('Bus created') }
      setForm(empty); setEditId(null); setShowForm(false); load()
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }

  const handleEdit = (bus) => {
    setForm({ ...bus, amenities: bus.amenities.join(', ') })
    setEditId(bus._id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/admin/buses/${id}`); toast.success('Deleted'); setDeleteId(null); load() }
    catch { toast.error('Delete failed') }
  }

  const fields = [
    ['name','Bus Name'],['operator','Operator'],['from','From City'],['to','To City'],
    ['departureTime','Departure (HH:MM)'],['arrivalTime','Arrival (HH:MM)'],
    ['duration','Duration (e.g. 7h 30m)'],['price','Price (₹)'],
    ['totalSeats','Total Seats'],['rating','Rating (0-5)'],
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this bus?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manage Buses</h1>
          <p className="text-sm text-gray-400">{buses.length} buses in system</p>
        </div>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(!showForm) }}
          className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-700 transition">
          {showForm ? '✕ Cancel' : '+ Add Bus'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {showForm && (
          <Reveal>
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="font-bold text-gray-700 mb-4">{editId ? 'Edit Bus' : 'Add New Bus'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fields.map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Bus Type</label>
                <select className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500" value={form.busType} onChange={e => setForm({ ...form, busType: e.target.value })}>
                  {['AC Sleeper','Non-AC Sleeper','AC Seater','Non-AC Seater','Volvo'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Amenities (comma separated)</label>
                <input className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, Charging Point, Water Bottle" />
              </div>
              <div className="md:col-span-3">
                <button className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-700 transition">
                  {editId ? 'Update Bus' : 'Create Bus'}
                </button>
              </div>
            </form>
          </div>
          </Reveal>
        )}

        <Reveal>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Bus Name','Route','Type','Timings','Price','Seats','Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, i) => (
                <tr key={bus._id} className={`hover:bg-red-50/30 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{bus.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{bus.operator}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium">{bus.from} → {bus.to}</td>
                  <td className="px-5 py-4"><span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold">{bus.busType}</span></td>
                  <td className="px-5 py-4 text-gray-500">{bus.departureTime} – {bus.arrivalTime}</td>
                  <td className="px-5 py-4 font-bold text-gray-800">₹{bus.price}</td>
                  <td className="px-5 py-4 text-gray-500">{bus.totalSeats}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(bus)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => setDeleteId(bus._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {buses.length === 0 && <p className="text-center text-gray-400 py-12">No buses found</p>}
        </div>
        </Reveal>
      </div>
    </div>
  )
}
