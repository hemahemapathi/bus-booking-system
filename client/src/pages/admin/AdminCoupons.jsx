import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Reveal from '../../components/Reveal'

const EMPTY = { code: '', type: 'flat', value: '', desc: '', min: 0, active: true }

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

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchCoupons = () =>
    api.get('/coupons/all').then(({ data }) => setCoupons(data)).catch(() => toast.error('Failed to load coupons'))

  useEffect(() => { fetchCoupons() }, [])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true) }
  const openEdit = (c) => { setForm({ code: c.code, type: c.type, value: c.value, desc: c.desc, min: c.min, active: c.active }); setEditId(c._id); setShowForm(true) }
  const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await api.patch(`/coupons/${editId}`, { ...form, value: Number(form.value), min: Number(form.min) })
        toast.success('Coupon updated')
      } else {
        await api.post('/coupons', { ...form, value: Number(form.value), min: Number(form.min) })
        toast.success('Coupon created')
      }
      cancel()
      fetchCoupons()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`)
      toast.success('Coupon deleted')
      setDeleteId(null)
      fetchCoupons()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const toggleActive = async (c) => {
    try {
      await api.patch(`/coupons/${c._id}`, { active: !c.active })
      fetchCoupons()
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this coupon?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manage Coupons</h1>
          <p className="text-sm text-gray-400">Add, edit or disable discount coupons</p>
        </div>
        <button onClick={openAdd} className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition">
          + Add Coupon
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Form */}
        {showForm && (
          <Reveal>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4">{editId ? 'Edit Coupon' : 'New Coupon'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Code</label>
                <input className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-red-500 transition"
                  placeholder="e.g. SAVE50" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required disabled={!!editId} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Type</label>
                <select className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="flat">Flat (Rs. off)</option>
                  <option value="percent">Percent (% off)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                  {form.type === 'percent' ? 'Discount %' : 'Discount Amount (Rs.)'}
                </label>
                <input type="number" min="1" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  placeholder={form.type === 'percent' ? '10' : '50'} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Min. Order (Rs.)</label>
                <input type="number" min="0" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  placeholder="0" value={form.min} onChange={e => setForm({ ...form, min: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Description</label>
                <input className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  placeholder="e.g. Flat Rs.50 off on any booking" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-red-600" />
                  <span className="text-sm text-gray-700 font-medium">Active (visible to users)</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-50">
                  {loading ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button type="button" onClick={cancel} className="px-6 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 hover:border-gray-300 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
          </Reveal>
        )}

        {/* Coupon list */}
        {coupons.length === 0 ? (
          <Reveal>
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">No coupons yet. Click "+ Add Coupon" to create one.</div>
          </Reveal>
        ) : (
          <div className="space-y-3">
            {coupons.map(c => (
              <Reveal key={c._id}>
              <div key={c._id} className={`bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4 transition ${!c.active && 'opacity-50'}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <p className="font-extrabold text-red-600 font-mono text-base">{c.code}</p>
                    <p className="text-xs text-red-400">{c.type === 'percent' ? `${c.value}% off` : `Rs.${c.value} off`}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.desc}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Min. order: Rs.{c.min} · {c.active ? <span className="text-green-600 font-medium">Active</span> : <span className="text-gray-400">Inactive</span>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(c)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${c.active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {c.active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => openEdit(c)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(c._id)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                    Delete
                  </button>
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
