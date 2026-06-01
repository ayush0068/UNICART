import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('mc_token') || null)
  const [loading, setLoading] = useState(true)   // initial auth check

  /* ── on mount: verify stored token ── */
  useEffect(() => {
    const verify = async () => {
      const stored = localStorage.getItem('mc_token')
      if (!stored) { setLoading(false); return }
      try {
        const res  = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
          setToken(stored)
        } else {
          localStorage.removeItem('mc_token')
          setToken(null)
        }
      } catch {
        localStorage.removeItem('mc_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  /* ── register ── */
  const register = useCallback(async ({ name, email, phone, password }) => {
    const res  = await fetch(`${API}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, phone, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || 'Registration failed')
    localStorage.setItem('mc_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  /* ── login ── */
  const login = useCallback(async ({ email, password }) => {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || 'Login failed')
    localStorage.setItem('mc_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  /* ── logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem('mc_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}