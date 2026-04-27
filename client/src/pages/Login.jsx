import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      toast.success('Welcome back!')
      navigate(data.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-red-600">🚌 GoBus</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-5 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
