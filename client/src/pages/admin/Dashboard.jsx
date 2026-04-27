import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Reveal from '../../components/Reveal'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => toast.error('Failed to load stats'))
  }, [])

  const cards = stats ? [
    { label: 'Total Bookings', value: stats.totalBookings, color: 'bg-blue-500', icon: <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
    { label: 'Confirmed', value: stats.confirmedBookings, color: 'bg-green-500', icon: <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { label: 'Cancelled', value: stats.cancelledBookings, color: 'bg-red-500', icon: <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-purple-500', icon: <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z"/></svg> },
    { label: 'Total Buses', value: stats.totalBuses, color: 'bg-yellow-500', icon: <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg> },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'bg-emerald-500', icon: <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  ] : []

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your bus booking platform</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        <Reveal>
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className={`${c.color} text-white rounded-2xl p-5 shadow`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">{c.label}</p>
                  <p className="text-3xl font-extrabold mt-1">{c.value ?? '—'}</p>
                </div>
                {c.icon}
              </div>
            </div>
          ))}
        </div>
        </Reveal>

        {/* Booking status breakdown */}
        {stats && stats.recentBookings?.length > 0 && (
          <Reveal>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5">Popular Routes</h2>
            {(() => {
              const routeMap = {}
              stats.recentBookings.forEach(b => {
                const key = `${b.bus?.from} → ${b.bus?.to}`
                routeMap[key] = (routeMap[key] || 0) + 1
              })
              const routes = Object.entries(routeMap).sort((a, b) => b[1] - a[1])
              const max = routes[0]?.[1] || 1
              return (
                <div className="space-y-3">
                  {routes.map(([route, count]) => (
                    <div key={route} className="flex items-center gap-4">
                      <p className="text-sm font-semibold text-gray-700 w-48 shrink-0">{route}</p>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                      </div>
                      <p className="text-sm font-bold text-gray-500 w-16 text-right shrink-0">{count} booking{count > 1 ? 's' : ''}</p>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
          </Reveal>
        )}

        {/* Recent bookings + Recent users */}
        <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-xs text-red-600 font-bold hover:underline">View All →</Link>
            </div>
            {stats?.recentBookings?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentBookings?.map(b => (
                  <div key={b._id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{b.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{b.bus?.from} → {b.bus?.to}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-800 text-sm">₹{b.totalPrice}</p>
                      <p className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Recent Users</h2>
              <Link to="/admin/users" className="text-xs text-red-600 font-bold hover:underline">View All →</Link>
            </div>
            {stats?.recentUsers?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No users yet</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentUsers?.map(u => (
                  <div key={u._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0 ml-auto">{new Date(u.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </Reveal>

        {/* Quick Actions */}
        <Reveal>
        <div>
          <h2 className="font-bold text-gray-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { to: '/admin/buses',    icon: <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>, label: 'Manage Buses', desc: 'Add, edit or delete buses' },
              { to: '/admin/bookings', icon: <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>, label: 'All Bookings', desc: 'View all customer bookings' },
              { to: '/admin/users',    icon: <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z"/></svg>, label: 'All Users', desc: 'View registered users' },
              { to: '/admin/coupons',  icon: <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M17 17h.01M3 12l9-9 9 9-9 9-9-9z"/></svg>, label: 'Manage Coupons', desc: 'Add, edit or disable coupons' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-red-300 transition group">
                <div className="mb-2">{item.icon}</div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-red-600">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
        </Reveal>

      </div>
    </div>
  )
}
