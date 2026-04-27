import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  {
    to: '/admin', label: 'Dashboard',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    to: '/admin/buses', label: 'Buses',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>
  },
  {
    to: '/admin/bookings', label: 'Bookings',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
  },
  {
    to: '/admin/users', label: 'Users',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z"/></svg>
  },
  {
    to: '/admin/coupons', label: 'Coupons',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M17 17h.01M3 12l9-9 9 9-9 9-9-9z"/></svg>
  },
  {
    to: '/admin/profile', label: 'Profile',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
  },
]

function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="w-52 shrink-0 bg-red-600 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-red-500 flex items-center justify-between">
        <div>
          <p className="text-white font-extrabold text-lg tracking-tight">GoBus</p>
          <p className="text-red-200 text-xs mt-0.5">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-red-200 hover:text-white md:hidden">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {LINKS.map(l => {
          const active = location.pathname === l.to
          return (
            <Link key={l.to} to={l.to} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                active ? 'bg-white text-red-600' : 'text-red-100 hover:bg-red-500'
              }`}>
              {l.icon}
              <span>{l.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-red-500 px-3 py-4 space-y-2">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-extrabold text-sm shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-red-200 text-xs truncate">Admin</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-100 hover:bg-red-500 transition text-sm font-semibold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // close on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <div className="flex min-h-screen">

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-52 shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        {/* Mobile top bar */}
        <div className="md:hidden bg-red-600 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <p className="text-white font-extrabold text-base tracking-tight">GoBus Admin</p>
        </div>
        {children}
      </main>
    </div>
  )
}
