import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import AdminLayout from './components/AdminLayout'
import FeedbackModal from './components/FeedbackModal'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchResults from './pages/SearchResults'
import SeatSelection from './pages/SeatSelection'
import Payment from './pages/Payment'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import AdminBuses from './pages/admin/AdminBuses'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminProfile from './pages/admin/AdminProfile'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import RefundPolicy from './pages/legal/RefundPolicy'
import Chatbot from './components/Chatbot'
import { useEffect, useState } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppLayout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Toaster position="top-right" />
      {!isAdmin && <Chatbot />}
    </>
  )
}

function ExitIntentHandler({ children }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    // Don't show on login/register pages
    if (['/login', '/register'].includes(location.pathname)) return

    const alreadyShown = sessionStorage.getItem('feedbackShown')
    if (alreadyShown) return

    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) {
        setShowFeedback(true)
        sessionStorage.setItem('feedbackShown', 'true')
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [location.pathname])

  return (
    <>
      {children}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ExitIntentHandler>
          <AppLayout />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/seats" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/buses" element={<AdminRoute><AdminLayout><AdminBuses /></AdminLayout></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminLayout><AdminBookings /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><AdminLayout><AdminProfile /></AdminLayout></AdminRoute>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund" element={<RefundPolicy />} />
          </Routes>
        </ExitIntentHandler>
      </BrowserRouter>
    </AuthProvider>
  )
}
