import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminGuard({ children }) {
  const { isAdmin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060d0a' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg,#14b574,#0a9460)', boxShadow: '0 0 30px rgba(20,181,116,0.4)' }}>
            <i className="bi bi-capsule text-white text-xl"></i>
          </div>
          <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/admin" replace />
  return children
}