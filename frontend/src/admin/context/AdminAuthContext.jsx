import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AdminAuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mc_token')
    if (!token) { setLoading(false); return }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.user?.role === 'admin') setAdmin(d.user)
        else setAdmin(null)
      })
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || 'Login failed')
    if (data.user?.role !== 'admin') throw new Error('Admin access nahi hai')
    localStorage.setItem('mc_token', data.token)
    setAdmin(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('mc_token')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)