import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data)
      toast.success('Account created!')
      navigate(data.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-red-600">🚌 GoBus</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['name','Full Name','text','John Doe'],['email','Email','email','you@example.com'],['phone','Phone Number','text','9876543210']].map(([key, label, type, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition" type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-5 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
