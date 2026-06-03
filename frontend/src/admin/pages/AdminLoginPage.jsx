import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { login, isAdmin } = useAdminAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState(import.meta.env.VITE_ADMIN_EMAIL || '')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
    if (isAdmin) navigate('/admin/dashboard', { replace: true })
  }, [isAdmin, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Email aur password dono chahiye'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060d0a] relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #14b574 0%, transparent 65%)', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #14b574 0%, transparent 65%)', transform: 'translate(40%, 40%)' }} />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#14b574 1px, transparent 1px), linear-gradient(90deg, #14b574 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #14b574, #0a9460)', boxShadow: '0 0 40px rgba(20,181,116,0.4)' }}>
            <i className="bi bi-capsule text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">MediCart Control Center</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm"
              style={{ animation: 'fadeUp 0.3s ease forwards' }}>
              <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-600 text-white/50 uppercase tracking-widest mb-2">
                Admin Email
              </label>
              <div className="relative">
                <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@medicart.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(20,181,116,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-600 text-white/50 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(20,181,116,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-700 text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(20,181,116,0.5)' : 'linear-gradient(135deg, #14b574, #0a9460)',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(20,181,116,0.35)',
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill text-sm"></i>
                  Enter Admin Panel
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Sirf authorized admin hi access kar sakte hain
        </p>
      </div>
    </div>
  )
}