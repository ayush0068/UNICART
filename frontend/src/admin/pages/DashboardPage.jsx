import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { medicineApi } from '../../services/api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authFetch = (path) => {
  const token = localStorage.getItem('mc_token')
  return fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
}

function StatCard({ icon, label, value, sub, color, to, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), delay) }, [delay])

  const inner = (
    <div className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 cursor-default group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms, box-shadow 0.2s ease`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${color}22`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <i className={`bi ${icon} text-xl`} style={{ color }}></i>
      </div>
      <div>
        <p className="text-2xl font-800 text-white">{value ?? <span className="text-white/20">—</span>}</p>
        <p className="text-sm font-600" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</p>}
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-700 uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
      {children}
    </h3>
  )
}

export default function DashboardPage() {
  const [stats,      setStats]      = useState(null)
  const [recentMeds, setRecentMeds] = useState([])
  const [nearExpiry, setNearExpiry] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      medicineApi.getAll({ limit: 5, sort: 'newest' }),
      medicineApi.getCategories(),
      medicineApi.getNearExpiry(30),
      medicineApi.getAll({ limit: 1 }),
    ]).then(([meds, cats, expiry, count]) => {
      setRecentMeds(meds.data || [])
      setNearExpiry(expiry.data || [])
      setStats({
        total:     count.total || 0,
        categories: (cats.data || []).length,
        nearExpiry: (expiry.data || []).length,
        featured:  (meds.data || []).filter(m => m.isFeatured).length,
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div style={{ opacity: 0, animation: 'fadeUp 0.5s ease 0ms forwards' }}>
          <h2 className="text-xl font-bold text-white">Good day! 👋</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Today's Performance Overview of Your MediCart Store
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="bi-capsule-pill"  label="Total Medicines"  value={loading ? '...' : stats?.total}      color="#14b574" delay={0}   to="/admin/medicines" />
          <StatCard icon="bi-grid"          label="Categories"       value={loading ? '...' : stats?.categories}  color="#6366f1" delay={80}  />
          <StatCard icon="bi-calendar-x"    label="Near Expiry"      value={loading ? '...' : stats?.nearExpiry}  color="#f59e0b" delay={160} to="/admin/expiry" sub="Next 30 days" />
          <StatCard icon="bi-star-fill"     label="Featured"         value={loading ? '...' : stats?.featured}    color="#ec4899" delay={240} />
        </div>

        {/* Quick actions */}
        <div style={{ opacity: 0, animation: 'fadeUp 0.5s ease 300ms forwards' }}>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="flex flex-wrap gap-3">
            {[
              { to: '/admin/add-medicine', icon: 'bi-plus-lg',        label: 'Add New Medicine', primary: true },
              { to: '/admin/medicines',    icon: 'bi-pencil-square',   label: 'Manage Medicines' },
              { to: '/admin/expiry',       icon: 'bi-calendar-x',     label: 'Check Expiry' },
            ].map(btn => (
              <Link
                key={btn.to}
                to={btn.to}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-600 transition-all duration-200"
                style={btn.primary ? {
                  background: 'linear-gradient(135deg,#14b574,#0a9460)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(20,181,116,0.3)',
                } : {
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={e => !btn.primary && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => !btn.primary && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <i className={`bi ${btn.icon}`}></i> {btn.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Near Expiry Alert */}
        {!loading && nearExpiry.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', animation: 'fadeUp 0.5s ease 350ms forwards', opacity: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill" style={{ color: '#f59e0b' }}></i>
              <p className="text-sm font-700" style={{ color: '#fbbf24' }}>
                {nearExpiry.length} medicines Next  30 dinon mein expire ho rahi hain!
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {nearExpiry.slice(0, 6).map(m => {
                const days = Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000)
                return (
                  <span key={m._id} className="text-xs px-2.5 py-1 rounded-lg font-600"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                    {m.name} · {days}d
                  </span>
                )
              })}
              {nearExpiry.length > 6 && (
                <Link to="/admin/expiry" className="text-xs px-2.5 py-1 rounded-lg font-600"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                  +{nearExpiry.length - 6} more →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Recent medicines */}
        <div style={{ opacity: 0, animation: 'fadeUp 0.5s ease 400ms forwards' }}>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Recent Medicines</SectionTitle>
            <Link to="/admin/medicines" className="text-xs font-600 transition-colors"
              style={{ color: '#14b574' }}>
              View All →
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {loading ? (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
                    <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
                      <div className="h-2.5 rounded w-1/4" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentMeds.length === 0 ? (
              <div className="py-12 text-center">
                <i className="bi bi-inbox text-3xl" style={{ color: 'rgba(255,255,255,0.15)' }}></i>
                <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>No Medicine Found</p>
                <Link to="/admin/add-medicine" className="text-sm font-600 mt-1 inline-block" style={{ color: '#14b574' }}>
                  Add First Medicine →
                </Link>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {recentMeds.map(m => (
                  <div key={m._id} className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(20,181,116,0.12)', border: '1px solid rgba(20,181,116,0.2)' }}>
                      <i className="bi bi-capsule text-xs" style={{ color: '#14b574' }}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-white truncate">{m.name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.brand} · {m.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-700 text-white">₹{m.price}</p>
                      <p className={`text-[10px] font-600 ${m.stock === 0 ? 'text-red-400' : m.stock <= 10 ? 'text-orange-400' : 'text-green-400'}`}>
                        Stock: {m.stock}
                      </p>
                    </div>
                    <Link to={`/admin/edit-medicine/${m._id}`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                      style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,181,116,0.15)'; e.currentTarget.style.color = '#14b574' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                    >
                      <i className="bi bi-pencil text-xs"></i>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}