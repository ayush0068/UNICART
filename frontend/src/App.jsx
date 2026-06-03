import React, { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }      from './context/AuthContext'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import AdminGuard            from './admin/components/AdminGuard'

// User pages
import HomePage     from './pages/HomePage'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Admin pages
import AdminLoginPage    from './admin/pages/AdminLoginPage'
import DashboardPage     from './admin/pages/DashboardPage'
import MedicinesPage     from './admin/pages/MedicinesPage'
import MedicineFormPage  from './admin/pages/MedicineFormPage'
import NearExpiryPage    from './admin/pages/NearExpiryPage'

function HomeWrapper() {
  const [searchVisible, setSearchVisible] = useState(true)
  const handleSearchVisibility = useCallback((v) => setSearchVisible(v), [])
  return <HomePage searchVisible={searchVisible} onSearchVisibilityChange={handleSearchVisibility} />
}

function ComingSoon({ title }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', flexDirection: 'column', gap: '8px' }}>
      <i className="bi bi-hammer" style={{ fontSize: '2rem' }}></i>
      <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)' }}>{title}</p>
      <p style={{ fontSize: '0.85rem' }}>Jald aane wala hai...</p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── User routes ── */}
            <Route path="/"         element={<HomeWrapper />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Admin login ── */}
            <Route path="/admin" element={<AdminLoginPage />} />

            {/* ── Admin protected routes ── */}
            <Route path="/admin/dashboard"         element={<AdminGuard><DashboardPage /></AdminGuard>} />
            <Route path="/admin/medicines"          element={<AdminGuard><MedicinesPage /></AdminGuard>} />
            <Route path="/admin/add-medicine"       element={<AdminGuard><MedicineFormPage /></AdminGuard>} />
            <Route path="/admin/edit-medicine/:id"  element={<AdminGuard><MedicineFormPage /></AdminGuard>} />
            <Route path="/admin/expiry"             element={<AdminGuard><NearExpiryPage /></AdminGuard>} />
            <Route path="/admin/orders"             element={<AdminGuard><ComingSoon title="Orders" /></AdminGuard>} />
            <Route path="/admin/users"              element={<AdminGuard><ComingSoon title="Users" /></AdminGuard>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  )
}