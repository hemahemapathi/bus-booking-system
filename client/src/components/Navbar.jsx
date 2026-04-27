import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef()

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav ref={menuRef} className="bg-red-600 text-white px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center gap-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>
          <span>GoBus</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4 items-center text-sm font-medium">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="hover:text-red-200 transition">Admin Panel</Link>}
              <Link to="/my-bookings" className="hover:text-red-200 transition">My Bookings</Link>
              <Link to="/profile" className="flex items-center gap-2 bg-red-700 px-3 py-1.5 rounded-full hover:bg-red-800 transition">
                <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-xs">
                  {user.name[0].toUpperCase()}
                </div>
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="bg-white text-red-600 px-3 py-1.5 rounded-full font-semibold hover:bg-red-50 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-red-600 px-4 py-1.5 rounded-full font-semibold hover:bg-red-50 transition">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
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
          {user ? (
            <>
              <div className="flex items-center gap-2 py-1">
                <div className="w-7 h-7 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-xs">
                  {user.name[0].toUpperCase()}
                </div>
                <span>{user.name}</span>
              </div>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-200">Admin Panel</Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-200">My Profile</Link>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-200">My Bookings</Link>
              <button onClick={handleLogout} className="text-left bg-white text-red-600 px-4 py-2 rounded-xl font-semibold w-full">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-200">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-white text-red-600 px-4 py-2 rounded-xl font-semibold text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
