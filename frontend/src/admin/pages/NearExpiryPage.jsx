import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { medicineApi } from '../../services/api'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

export default function NearExpiryPage() {
  const [medicines, setMedicines] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [days,      setDays]      = useState(90)

  useEffect(() => {
    setLoading(true)
    medicineApi.getNearExpiry(days)
      .then(res => setMedicines(res.data || []))
      .catch(() => setMedicines([]))
      .finally(() => setLoading(false))
  }, [days])

  const expired  = medicines.filter(m => new Date(m.expiryDate) < new Date())
  const expiring = medicines.filter(m => new Date(m.expiryDate) >= new Date())

  return (
    <AdminLayout>
      <div className="space-y-6" style={{ opacity: 0, animation: 'fadeUp 0.4s ease forwards' }}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Near Expiry</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Medicines Near Expiry
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-600" style={{ color: 'rgba(255,255,255,0.3)' }}>Show:</span>
            {[30, 60, 90, 180].map(d => (
              <button key={d} onClick={() => setDays(d)}
                className="px-3 py-1.5 rounded-lg text-xs font-700 transition-all duration-200"
                style={days === d ? {
                  background: 'linear-gradient(135deg,#14b574,#0a9460)',
                  color: '#fff',
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Already Expired', value: expired.length,  color: '#f87171', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.2)' },
            { label: `Next  ${days} din`, value: expiring.length, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)' },
            { label: 'Total Affected',  value: medicines.length, color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <p className="text-2xl font-800" style={{ color: s.color }}>{loading ? '...' : s.value}</p>
              <p className="text-xs font-600 mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Expired */}
        {!loading && expired.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.04)' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
              <i className="bi bi-exclamation-octagon-fill text-red-400"></i>
              <p className="text-sm font-700 text-red-400">Already Expired ({expired.length})</p>
            </div>
            <ExpTable items={expired} />
          </div>
        )}

        {/* Near expiry */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
            <i className="bi bi-clock-fill text-amber-400"></i>
            <p className="text-sm font-700 text-amber-400">Next {days} Days({expiring.length})</p>
          </div>
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(245,158,11,0.2)', borderTopColor: '#fbbf24' }}></div>
            </div>
          ) : expiring.length === 0 ? (
            <div className="py-12 text-center">
              <i className="bi bi-check-circle text-4xl block mb-2 text-green-500"></i>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Expiring in the next {days} days (0)</p>
            </div>
          ) : (
            <ExpTable items={expiring} />
          )}
        </div>

      </div>
    </AdminLayout>
  )
}

function ExpTable({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['Medicine','Batch','MFD','Expiry','Stock','Days Left',''].map((h, i) => (
              <th key={i} className={`px-4 py-3 text-left text-[10px] font-700 uppercase tracking-widest ${i === 1 ? 'hidden sm:table-cell' : ''}`}
                style={{ color: 'rgba(255,255,255,0.25)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(m => {
            const days    = Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000)
            const expired = days < 0
            return (
              <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="px-4 py-3.5">
                  <p className="text-sm font-600 text-white">{m.name}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.brand}</p>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.batchNumber || '—'}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{fmtDate(m.mfgDate)}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className={`text-xs font-700 ${expired ? 'text-red-400' : 'text-amber-400'}`}>
                    {fmtDate(m.expiryDate)}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-700 ${m.stock === 0 ? 'text-red-400' : 'text-white/60'}`}>{m.stock}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-800 px-2.5 py-1 rounded-full"
                    style={{
                      background: expired ? 'rgba(239,68,68,0.15)' : days <= 7 ? 'rgba(239,68,68,0.15)' : days <= 30 ? 'rgba(245,158,11,0.15)' : 'rgba(234,179,8,0.12)',
                      color:      expired ? '#f87171' : days <= 7 ? '#f87171' : days <= 30 ? '#fbbf24' : '#facc15',
                    }}>
                    {expired ? `${Math.abs(days)}d ago` : `${days}d`}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Link to={`/admin/edit-medicine/${m._id}`}
                    className="text-xs font-600 px-2.5 py-1.5 rounded-lg transition-colors"
                    style={{ background: 'rgba(20,181,116,0.1)', color: '#34d399', border: '1px solid rgba(20,181,116,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,181,116,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(20,181,116,0.1)'}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}