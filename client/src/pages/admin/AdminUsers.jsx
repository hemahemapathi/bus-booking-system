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

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  const load = () => api.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => toast.error('Failed')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('User deleted')
      setDeleteId(null)
      setUsers(u => u.filter(x => x._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed')
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
      <div className="bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">All Users</h1>
        <p className="text-sm text-gray-400">{users.length} registered users</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <Reveal>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['User','Email','Phone','Role','Joined','Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} className={`hover:bg-red-50/30 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4 text-gray-500">{u.phone}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    {u.role !== 'admin' && (
                      <button onClick={() => setDeleteId(u._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 py-12">No users found</p>}
        </div>
        </Reveal>
      </div>
    </div>
  )
}
