import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'
import Reveal from '../components/Reveal'

export default function Profile() {
  const { user, login } = useAuth()
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [pwMode, setPwMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data)).catch(() => {})
    api.get('/reviews/my').then(({ data }) => setReviews(data)).catch(() => {})
  }, [])

  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length
  const totalSpent = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.patch('/auth/profile', form)
      login(data)
      toast.success('Profile updated!')
      setEditMode(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match')
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await api.patch('/auth/profile', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwMode(false)
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-600 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-xl font-bold">My Profile</h1>
            <p className="text-red-200 text-sm">Manage your account details</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">

        <Reveal>
        {/* Avatar + Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-extrabold shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                  {user?.role === 'admin' ? '⚙️ Admin' : '✅ Verified User'}
                </span>
              </div>
            </div>
            <button onClick={() => { setEditMode(e => !e); setPwMode(false) }}
              className="shrink-0 text-sm font-bold text-red-600 border-2 border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition">
              {editMode ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-lg">👤</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-lg">✉️</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-lg">📱</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">Phone</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>
        </Reveal>

        {/* Edit Form */}
        {editMode && (
          <Reveal>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Full Name</label>
                <input className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Phone</label>
                <input className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email</label>
                <input className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  value={user?.email} disabled />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
          </Reveal>
        )}

        {/* Stats */}
        <Reveal>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Confirmed', value: confirmed, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Cancelled', value: cancelled, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Total Spent', value: `Rs.${totalSpent.toLocaleString()}`, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        </Reveal>

        <Reveal>
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-xs text-red-600 font-bold hover:underline">View All →</Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map(b => (
                <div key={b._id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{b.bus?.from} → {b.bus?.to}</p>
                    <p className="text-xs text-gray-400">{b.date} · {b.seats.length} seat{b.seats.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">Rs.{b.totalPrice}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-600' : b.status === 'cancelled' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </Reveal>

        <Reveal>
        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800">Password</h2>
              <p className="text-xs text-gray-400 mt-0.5">Change your account password</p>
            </div>
            <button onClick={() => { setPwMode(p => !p); setEditMode(false) }}
              className="text-sm font-bold text-red-600 border-2 border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition">
              {pwMode ? 'Cancel' : 'Change'}
            </button>
          </div>
          {pwMode && (
            <form onSubmit={handlePassword} className="mt-4 space-y-3">
              {[
                { label: 'Current Password', key: 'currentPassword' },
                { label: 'New Password', key: 'newPassword' },
                { label: 'Confirm New Password', key: 'confirm' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{f.label}</label>
                  <input type="password" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                    value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} required />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
        </Reveal>

        {/* Member Since */}
        <Reveal>
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between text-sm text-gray-400">
          <span>Member since</span>
          <span className="font-semibold text-gray-600">{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        </Reveal>

      </div>
    </div>
  )
}
