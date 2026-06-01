import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from || '/'

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    setLoading(true)
    try {
      await login({ email: form.email, password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left panel — visible on lg+ ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #061a12 0%, #0b2a1a 50%, #0b1120 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,181,116,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,181,116,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col justify-center px-14 py-12 w-full">
          {/* logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="bi bi-capsule text-white text-xl"></i>
            </div>
            <span className="font-display text-2xl font-700 text-white tracking-tight">
              Medi<span className="text-brand-400">Cart</span>
            </span>
          </Link>

          <h2 className="font-display text-4xl font-700 text-white leading-tight mb-4">
            Your Health,<br />
            <span className="shimmer-text">Always Delivered</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-12 max-w-sm">
            Login to order medicines, track deliveries and manage your prescriptions — all in one place.
          </p>

          {/* feature list */}
          <div className="space-y-4">
            {[
              { icon: 'bi-lightning-charge-fill', text: '30-minute express delivery' },
              { icon: 'bi-shield-fill-check',     text: '100% genuine medicines' },
              { icon: 'bi-file-medical-fill',     text: 'Upload & track prescriptions' },
              { icon: 'bi-clock-history',         text: 'Order history & reorder' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className={`bi ${f.icon} text-brand-400 text-sm`}></i>
                </div>
                <span className="text-white/65 text-sm font-500">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10">
        {/* mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
            <i className="bi bi-capsule text-white text-base"></i>
          </div>
          <span className="font-display text-xl font-700 text-gray-900">
            Medi<span className="text-brand-500">Cart</span>
          </span>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-700 text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm">Sign in to your MediCart account</p>
          </div>

          {/* error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mb-6 text-sm font-500">
              <i className="bi bi-exclamation-circle-fill text-red-500 flex-shrink-0"></i>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* email */}
            <div>
              <label className="block text-sm font-600 text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none focus:border-brand-400 focus:bg-white transition-all duration-200 bg-gray-50"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-600 text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-600 text-brand-600 hover:text-brand-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none focus:border-brand-400 focus:bg-white transition-all duration-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 text-base rounded-2xl mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Signing in...</>
              ) : (
                <>Sign In <i className="bi bi-arrow-right"></i></>
              )}
            </button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-600">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* google placeholder */}
          <button className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-600 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-7">
            Don't have an account?{' '}
            <Link to="/register" className="font-700 text-brand-600 hover:text-brand-700 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}