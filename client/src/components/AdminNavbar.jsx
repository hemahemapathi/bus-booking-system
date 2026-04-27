import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/buses', label: 'Buses' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/coupons', label: 'Coupons' },
]

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => { setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <nav ref={menuRef} className="bg-red-600 text-white px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/admin" className="text-xl font-extrabold tracking-tight flex items-center gap-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>
          <span>GoBus</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-2 items-center text-sm font-medium">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-1.5 rounded-full transition font-semibold ${
                location.pathname === l.to
                  ? 'bg-white text-red-600'
                  : 'hover:text-red-200'
              }`}>
              {l.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-white/30 mx-1" />
          <div className="flex items-center gap-2 bg-red-700 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span>{user?.name}</span>
          </div>
          <button onClick={() => { logout(); navigate('/') }}
            className="bg-white text-red-600 px-3 py-1.5 rounded-full font-semibold hover:bg-red-50 transition">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t border-red-500 pt-3 flex flex-col gap-3 text-sm font-medium px-2">
          <div className="flex items-center gap-2 py-1">
            <div className="w-7 h-7 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span>{user?.name}</span>
          </div>
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`py-1 ${location.pathname === l.to ? 'text-white font-bold' : 'hover:text-red-200'}`}>
              {l.label}
            </Link>
          ))}
          <button onClick={() => { logout(); navigate('/') }}
            className="text-left bg-white text-red-600 px-4 py-2 rounded-xl font-semibold w-full">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
