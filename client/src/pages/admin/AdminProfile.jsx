import { useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Reveal from '../../components/Reveal'

export default function AdminProfile() {
  const { user, login } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [pwMode, setPwMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })

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
    } finally { setLoading(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match')
    if (pwForm.newPassword.length < 6) return toast.error('Min 6 characters')
    setLoading(true)
    try {
      await api.patch('/auth/profile', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwMode(false)
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-400">Manage your admin account</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        <Reveal>
        {/* Avatar card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-extrabold shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-400">{user?.phone}</p>
            <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
              Admin
            </span>
          </div>
          <button onClick={() => { setEditMode(e => !e); setPwMode(false) }}
            className="shrink-0 text-sm font-bold text-red-600 border-2 border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition">
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        </Reveal>

        {/* Edit form */}
        {editMode && (
          <Reveal>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              {[['Full Name','name','text'],['Phone','phone','text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{label}</label>
                  <input type={type} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              ))}
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

        {/* Change password */}
        <Reveal>
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
              {[['Current Password','currentPassword'],['New Password','newPassword'],['Confirm New Password','confirm']].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{label}</label>
                  <input type="password" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                    value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })} required />
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

        {/* Member since */}
        <Reveal>
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between text-sm text-gray-400">
          <span>Member since</span>
          <span className="font-semibold text-gray-600">
            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        </Reveal>

      </div>
    </div>
  )
}
