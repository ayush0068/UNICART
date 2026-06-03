import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { medicineApi } from '../../services/api'

const CATEGORIES = [
  'All','Pain Relief','Fever','Antibiotics','Vitamins & Supplements',
  'Diabetes','Heart Care','Skincare','Baby Care','Ayurveda',
  'Cold & Cough','Digestive','Eye Care','Dental','Mental Wellness',
  'Sports & Fitness','Nutrition','Sexual Wellness','Lab Tests','Other',
]

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-600 shadow-xl"
      style={{
        background: type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(20,181,116,0.9)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
        animation: 'fadeUp 0.3s ease forwards',
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
      <i className={`bi ${type === 'error' ? 'bi-x-circle-fill' : 'bi-check-circle-fill'}`}></i>
      {msg}
    </div>
  )
}

export default function MedicinesPage() {
  const [medicines,  setMedicines]  = useState([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(1)
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('All')
  const [deletingId, setDeletingId] = useState(null)
  const [toast,      setToast]      = useState(null)
  const LIMIT = 15

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), [])

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT, sort: 'newest' }
    if (search)             params.search   = search
    if (category !== 'All') params.category = category
    medicineApi.getAll(params)
      .then(res => { setMedicines(res.data || []); setTotal(res.total || 0) })
      .catch(() => showToast('Load karne mein error', 'error'))
      .finally(() => setLoading(false))
  }, [page, search, category, showToast])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => { setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" `)) return
    setDeletingId(id)
    try {
      await medicineApi.remove(id)
      showToast(`"${name}" hata di gayi`)
      load()
    } catch { showToast('Delete nahi hua', 'error') }
    finally  { setDeletingId(null) }
  }

  const toggleFeatured = async (med) => {
    try {
      await medicineApi.update(med._id, { isFeatured: !med.isFeatured })
      showToast(`Featured ${!med.isFeatured ? 'ON' : 'OFF'} kar diya`)
      load()
    } catch { showToast('Update nahi hua', 'error') }
  }

  const pages = Math.ceil(total / LIMIT)

  return (
    <AdminLayout>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-5" style={{ opacity: 0, animation: 'fadeUp 0.4s ease forwards' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Medicines</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {total} medicines total
            </p>
          </div>
          <Link
            to="/admin/add-medicine"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 text-white"
            style={{ background: 'linear-gradient(135deg,#14b574,#0a9460)', boxShadow: '0 4px 16px rgba(20,181,116,0.3)' }}
          >
            <i className="bi bi-plus-lg"></i>
            <span className="hidden sm:inline">New Medicine</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}></i>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Medicine Name, brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(20,181,116,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0a0f0c' }}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Medicine','Category','MFD / EXP','Batch','Price','Stock','Status',''].map((h, i) => (
                    <th key={i} className={`px-4 py-3 text-left text-[10px] font-700 uppercase tracking-widest ${
                      i === 2 || i === 3 ? 'hidden lg:table-cell' : i === 1 ? 'hidden md:table-cell' : i === 5 ? 'hidden sm:table-cell' : ''
                    }`} style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3.5 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
                      </td>
                    ))}
                  </tr>
                )) : medicines.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <i className="bi bi-inbox text-4xl block mb-2" style={{ color: 'rgba(255,255,255,0.1)' }}></i>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>No Medicine Found</p>
                    </td>
                  </tr>
                ) : medicines.map(m => {
                  const expired = m.expiryDate && new Date(m.expiryDate) < new Date()
                  const nearExp = m.expiryDate && !expired && Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000) <= 30

                  return (
                    <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(20,181,116,0.1)', border: '1px solid rgba(20,181,116,0.15)' }}>
                            <i className="bi bi-capsule text-xs" style={{ color: '#14b574' }}></i>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-600 text-white truncate max-w-[140px]">{m.name}</p>
                            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-[11px] px-2 py-1 rounded-lg font-600"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                          {m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Mfd: {fmtDate(m.mfgDate)}</p>
                        <p className={`text-[11px] font-600 ${expired ? 'text-red-400' : nearExp ? 'text-orange-400' : ''}`}
                          style={!expired && !nearExp ? { color: 'rgba(255,255,255,0.35)' } : {}}>
                          Exp: {fmtDate(m.expiryDate)}{expired ? ' ⚠' : nearExp ? ' !' : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.batchNumber || '—'}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-700 text-white">₹{m.price}</p>
                        {m.discount > 0 && (
                          <p className="text-[10px] font-600" style={{ color: '#14b574' }}>{m.discount}% off</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-700 ${m.stock === 0 ? 'text-red-400' : m.stock <= 10 ? 'text-orange-400' : 'text-green-400'}`}>
                          {m.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          {m.isActive
                            ? <span className="text-[10px] font-700 px-2 py-0.5 rounded-full text-center" style={{ background: 'rgba(20,181,116,0.15)', color: '#34d399' }}>Active</span>
                            : <span className="text-[10px] font-700 px-2 py-0.5 rounded-full text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>Inactive</span>
                          }
                          {m.isFeatured && (
                            <span className="text-[10px] font-700 px-2 py-0.5 rounded-full text-center" style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6' }}>★ Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => toggleFeatured(m)} title={m.isFeatured ? 'Unfeatured karo' : 'Featured karo'}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ background: m.isFeatured ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)', color: m.isFeatured ? '#f472b6' : 'rgba(255,255,255,0.3)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,72,153,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = m.isFeatured ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)'}
                          >
                            <i className={`bi ${m.isFeatured ? 'bi-star-fill' : 'bi-star'} text-xs`}></i>
                          </button>
                          <Link to={`/admin/edit-medicine/${m._id}`}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                          >
                            <i className="bi bi-pencil text-xs"></i>
                          </Link>
                          <button onClick={() => handleDelete(m._id, m.name)} disabled={deletingId === m._id}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-40"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                          >
                            <i className={`bi ${deletingId === m._id ? 'bi-hourglass-split animate-spin' : 'bi-trash'} text-xs`}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Page {page} / {pages} · {total} total
              </p>
              <div className="flex gap-2">
                {[{ label: '← Pehle', disabled: page === 1, action: () => setPage(p => p - 1) },
                  { label: 'Aage →', disabled: page >= pages, action: () => setPage(p => p + 1) }
                ].map(btn => (
                  <button key={btn.label} disabled={btn.disabled} onClick={btn.action}
                    className="px-3 py-1.5 rounded-lg text-xs font-600 transition-colors disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => !btn.disabled && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}