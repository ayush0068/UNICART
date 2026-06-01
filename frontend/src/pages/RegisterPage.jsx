import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const steps = ['Account', 'Personal', 'Done']

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [step, setStep]     = useState(0)
  const [error, setError]   = useState('')
  const [loading, setLoad]  = useState(false)
  const [showPwd, setShow]  = useState(false)
  const [showCPwd, setShowC]= useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    agreeTerms: false,
  })

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  /* step 0 validation */
  const validateStep0 = () => {
    if (!form.email) return 'Email is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email'
    if (!form.password) return 'Password is required'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  /* step 1 validation */
  const validateStep1 = () => {
    if (!form.name.trim()) return 'Name is required'
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters'
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit Indian phone number'
    if (!form.agreeTerms) return 'Please accept the terms & conditions'
    return null
  }

  const nextStep = () => {
    setError('')
    const err = validateStep0()
    if (err) { setError(err); return }
    setStep(1)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const err = validateStep1()
    if (err) { setError(err); return }
    setLoad(true)
    try {
      await register({
        name:     form.name.trim(),
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      })
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoad(false)
    }
  }

  /* strength meter */
  const pwdStrength = () => {
    const p = form.password
    if (!p) return { score: 0, label: '', color: '' }
    let s = 0
    if (p.length >= 6)  s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^a-zA-Z0-9]/.test(p)) s++
    if (s <= 1) return { score: s, label: 'Weak',   color: 'bg-red-500'    }
    if (s <= 3) return { score: s, label: 'Medium', color: 'bg-yellow-500' }
    return       { score: s, label: 'Strong', color: 'bg-brand-500'  }
  }
  const strength = pwdStrength()

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #061a12 0%, #0b2a1a 50%, #0b1120 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,181,116,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,181,116,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col justify-center px-14 py-12 w-full">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="bi bi-capsule text-white text-xl"></i>
            </div>
            <span className="font-display text-2xl font-700 text-white tracking-tight">
              Medi<span className="text-brand-400">Cart</span>
            </span>
          </Link>

          <h2 className="font-display text-4xl font-700 text-white leading-tight mb-4">
            Join 2 Million+<br />
            <span className="shimmer-text">Healthy Indians</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-12 max-w-sm">
            Create your free account and get medicines delivered to your door in 30 minutes.
          </p>

          <div className="space-y-4">
            {[
              { icon: 'bi-gift-fill',         text: 'Get ₹100 off on your first order' },
              { icon: 'bi-truck',             text: 'Free delivery on orders above ₹499' },
              { icon: 'bi-bell-fill',         text: 'Medicine refill reminders' },
              { icon: 'bi-person-check-fill', text: 'Dedicated health profile' },
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

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10">

        {/* mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
            <i className="bi bi-capsule text-white text-base"></i>
          </div>
          <span className="font-display text-xl font-700 text-gray-900">
            Medi<span className="text-brand-500">Cart</span>
          </span>
        </Link>

        <div className="max-w-md w-full mx-auto">

          {/* ── Step indicator ── */}
          {step < 2 && (
            <div className="flex items-center gap-2 mb-8">
              {steps.slice(0, 2).map((s, i) => (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-600' : 'text-gray-400'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 transition-all duration-300 ${
                      i < step  ? 'bg-brand-500 text-white' :
                      i === step? 'bg-brand-500 text-white ring-4 ring-brand-100' :
                                  'bg-gray-200 text-gray-500'
                    }`}>
                      {i < step ? <i className="bi bi-check text-sm"></i> : i + 1}
                    </div>
                    <span className="text-xs font-600 hidden sm:block">{s}</span>
                  </div>
                  {i < 1 && <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${i < step ? 'bg-brand-500' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mb-5 text-sm font-500">
              <i className="bi bi-exclamation-circle-fill text-red-500 flex-shrink-0"></i>
              {error}
            </div>
          )}

          {/* ── STEP 0: Email + Password ── */}
          {step === 0 && (
            <div>
              <div className="mb-7">
                <h1 className="font-display text-3xl font-700 text-gray-900 mb-1">Create account</h1>
                <p className="text-gray-400 text-sm">Already have one?{' '}
                  <Link to="/login" className="font-700 text-brand-600 hover:text-brand-700">Sign in</Link>
                </p>
              </div>

              <div className="space-y-5">
                {/* email */}
                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    <input name="email" type="email" value={form.email} onChange={handle}
                      placeholder="you@example.com" autoComplete="email"
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none focus:border-brand-400 bg-gray-50 focus:bg-white transition-all duration-200" />
                  </div>
                </div>

                {/* password */}
                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    <input name="password" type={showPwd ? 'text' : 'password'}
                      value={form.password} onChange={handle}
                      placeholder="Min. 6 characters" autoComplete="new-password"
                      className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none focus:border-brand-400 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <button type="button" onClick={() => setShow(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'} text-sm`}></i>
                    </button>
                  </div>
                  {/* strength bar */}
                  {form.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <span className={`text-xs font-600 ${
                        strength.label === 'Weak' ? 'text-red-500' :
                        strength.label === 'Medium' ? 'text-yellow-600' : 'text-brand-600'
                      }`}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* confirm password */}
                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <i className="bi bi-lock-fill absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    <input name="confirmPassword" type={showCPwd ? 'text' : 'password'}
                      value={form.confirmPassword} onChange={handle}
                      placeholder="Re-enter password" autoComplete="new-password"
                      className={`w-full pl-11 pr-12 py-3.5 border-2 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none bg-gray-50 focus:bg-white transition-all duration-200 ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? 'border-red-300 focus:border-red-400'
                          : form.confirmPassword && form.password === form.confirmPassword
                            ? 'border-brand-300 focus:border-brand-400'
                            : 'border-gray-200 focus:border-brand-400'
                      }`} />
                    <button type="button" onClick={() => setShowC(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      <i className={`bi ${showCPwd ? 'bi-eye-slash' : 'bi-eye'} text-sm`}></i>
                    </button>
                    {form.confirmPassword && (
                      <i className={`bi absolute right-10 top-1/2 -translate-y-1/2 text-sm ${
                        form.password === form.confirmPassword ? 'bi-check-circle-fill text-brand-500' : 'bi-x-circle-fill text-red-400'
                      }`}></i>
                    )}
                  </div>
                </div>

                <button type="button" onClick={nextStep}
                  className="w-full btn-primary justify-center py-3.5 text-base rounded-2xl">
                  Continue <i className="bi bi-arrow-right"></i>
                </button>
              </div>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400 font-600">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-600 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* ── STEP 1: Name + Phone ── */}
          {step === 1 && (
            <form onSubmit={submit}>
              <div className="mb-7">
                <h1 className="font-display text-3xl font-700 text-gray-900 mb-1">Your details</h1>
                <p className="text-gray-400 text-sm">Almost there — tell us about yourself</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <i className="bi bi-person absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    <input name="name" type="text" value={form.name} onChange={handle}
                      placeholder="Your full name" autoComplete="name"
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none focus:border-brand-400 bg-gray-50 focus:bg-white transition-all duration-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-600 text-gray-700 mb-1.5">
                    Phone Number <span className="text-gray-400 font-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                      <span className="text-sm font-600 text-gray-500">+91</span>
                      <div className="w-px h-4 bg-gray-300"></div>
                    </div>
                    <input name="phone" type="tel" value={form.phone} onChange={handle}
                      placeholder="10-digit mobile number" maxLength={10}
                      className="w-full pl-16 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-500 text-gray-800 placeholder-gray-400 outline-none focus:border-brand-400 bg-gray-50 focus:bg-white transition-all duration-200" />
                  </div>
                </div>

                {/* terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    form.agreeTerms ? 'bg-brand-500 border-brand-500' : 'border-gray-300 group-hover:border-brand-300'
                  }`}>
                    {form.agreeTerms && <i className="bi bi-check text-white text-xs leading-none"></i>}
                  </div>
                  <input name="agreeTerms" type="checkbox" checked={form.agreeTerms} onChange={handle} className="sr-only" />
                  <span className="text-sm text-gray-600 leading-snug">
                    I agree to MediCart's{' '}
                    <a href="#" className="text-brand-600 font-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-brand-600 font-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => { setStep(0); setError('') }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-700 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <i className="bi bi-arrow-left"></i> Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 btn-primary justify-center py-3.5 text-sm rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Creating...</>
                    ) : (
                      <>Create Account <i className="bi bi-arrow-right"></i></>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 2: Success ── */}
          {step === 2 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-brand-50 border-2 border-brand-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-check-circle-fill text-brand-500 text-4xl"></i>
              </div>
              <h2 className="font-display text-3xl font-700 text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
                Welcome to MediCart. Your account is ready — start ordering medicines now.
              </p>
              <button onClick={() => navigate('/')}
                className="w-full btn-primary justify-center py-3.5 text-base rounded-2xl">
                Go to Home <i className="bi bi-arrow-right"></i>
              </button>
              <button onClick={() => navigate('/login')}
                className="w-full mt-3 flex items-center justify-center py-3.5 text-sm font-600 text-gray-500 hover:text-gray-700 transition-colors">
                Sign in instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}