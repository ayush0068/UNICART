import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { medicineApi } from '../../services/api'

const CATEGORIES = [
  'Pain Relief','Fever','Antibiotics','Vitamins & Supplements','Diabetes',
  'Heart Care','Skincare','Baby Care','Ayurveda','Cold & Cough','Digestive',
  'Eye Care','Dental','Mental Wellness','Sports & Fitness','Nutrition',
  'Sexual Wellness','Lab Tests','Other',
]
const DOSAGE_FORMS = ['Tablet','Capsule','Syrup','Suspension','Injection','Cream','Gel','Ointment','Drops','Inhaler','Patch','Powder','Other']
const UNITS = ['strip','bottle','box','tube','sachet','vial','ampule','pcs']

function toDateInput(d) { return d ? new Date(d).toISOString().split('T')[0] : '' }

const EMPTY = {
  name:'', brand:'', genericName:'', category:'Pain Relief', description:'',
  price:'', mrp:'', stock:'', unit:'strip', packSize:'', dosageForm:'', composition:'',
  sideEffects:'', howToUse:'', storageInfo:'Store below 25°C', manufacturer:'',
  saltName:'', strength:'', mfgDate:'', expiryDate:'', batchNumber:'',
  countryOfOrigin:'India', fssaiLicense:'', hsn:'', gstPercent:'12', shelfLife:'', tags:'',
  requiresPrescription: false, isActive: true, isFeatured: false,
}

/* Reusable input styles */
const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.85)',
}

function DarkInput({ label, hint, required, type = 'text', ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-700 uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'rgba(20,181,116,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        {...props}
      />
      {hint && <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{hint}</p>}
    </div>
  )
}

function DarkSelect({ label, hint, required, children, ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-700 uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{ ...inputStyle, colorScheme: 'dark' }}
        onFocus={e => e.target.style.borderColor = 'rgba(20,181,116,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        {...props}
      >
        {children}
      </select>
      {hint && <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{hint}</p>}
    </div>
  )
}

function DarkTextarea({ label, hint, ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-700 uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </label>
      <textarea
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'rgba(20,181,116,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        {...props}
      />
      {hint && <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{hint}</p>}
    </div>
  )
}

function Section({ icon, title, children, delay = 0 }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      opacity: 0,
      animation: `fadeUp 0.4s ease ${delay}ms forwards`,
    }}>
      <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(20,181,116,0.12)', border: '1px solid rgba(20,181,116,0.2)' }}>
          <i className={`bi ${icon} text-sm`} style={{ color: '#14b574' }}></i>
        </div>
        <h3 className="text-sm font-700 text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  )
}

export default function MedicineFormPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = !!id

  const [form,     setForm]     = useState(EMPTY)
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  useEffect(() => {
    if (!isEdit) return
    const API   = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const token = localStorage.getItem('mc_token')
    // Try to get medicine by id directly, fallback to getAll
    medicineApi.getAll({ limit: 500 })
      .then(res => {
        const m = (res.data || []).find(x => x._id === id)
        if (!m) return
        setForm({
          ...EMPTY, ...m,
          mfgDate:    toDateInput(m.mfgDate),
          expiryDate: toDateInput(m.expiryDate),
          tags:       (m.tags || []).join(', '),
          price:      m.price?.toString() || '',
          mrp:        m.mrp?.toString() || '',
          stock:      m.stock?.toString() || '',
          gstPercent: m.gstPercent?.toString() || '12',
        })
      })
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handle = e => set(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.name.trim())  return setError('Medicine Name is Required')
    if (!form.brand.trim()) return setError('Brand Required')
    if (!form.price)        return setError('Price Required')
    if (!form.mrp)          return setError('MRP is Required')
    if (form.stock === '')  return setError('Stock Needed')

    const payload = {
      ...form,
      price:      Number(form.price),
      mrp:        Number(form.mrp),
      stock:      Number(form.stock),
      gstPercent: Number(form.gstPercent || 12),
      tags:       form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }
    if (!payload.mfgDate)    delete payload.mfgDate
    if (!payload.expiryDate) delete payload.expiryDate

    setLoading(true)
    try {
      if (isEdit) {
        await medicineApi.update(id, payload)
        setSuccess('Medicine update ho gayi! ✓')
        setTimeout(() => navigate('/admin/medicines'), 1200)
      } else {
        const API   = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const token = localStorage.getItem('mc_token')
        const res   = await fetch(`${API}/medicines`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message)
        setSuccess('New Medicine add ho gayi! ✓')
        setTimeout(() => navigate('/admin/medicines'), 1200)
      }
    } catch (err) {
      setError(err.message || 'Kuch gadbad ho gayi')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(20,181,116,0.3)', borderTopColor: '#14b574' }}></div>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <form onSubmit={submit} className="max-w-5xl space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between" style={{ opacity: 0, animation: 'fadeUp 0.4s ease forwards' }}>
          <div>
            <h2 className="text-xl font-bold text-white">{isEdit ? 'Medicine Edit Karo' : 'Add New Medicine'}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {isEdit ? 'Details update karo' : 'Fill out all Fields and Save'}
            </p>
          </div>
          <button type="button" onClick={() => navigate('/admin/medicines')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <i className="bi bi-arrow-left text-xs"></i> Back
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', animation: 'fadeUp 0.3s ease forwards' }}>
            <i className="bi bi-x-circle-fill"></i>{error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(20,181,116,0.1)', border: '1px solid rgba(20,181,116,0.3)', color: '#34d399', animation: 'fadeUp 0.3s ease forwards' }}>
            <i className="bi bi-check-circle-fill"></i>{success}
          </div>
        )}

        {/* Section 1 — Basic */}
        <Section icon="bi-info-circle" title="Basic Information" delay={50}>
          <DarkInput label="Medicine Name" name="name" value={form.name} onChange={handle} placeholder="e.g. Paracetamol 650mg" required />
          <DarkInput label="Brand" name="brand" value={form.brand} onChange={handle} placeholder="e.g. Crocin" required />
          <DarkInput label="Generic Name" name="genericName" value={form.genericName} onChange={handle} placeholder="e.g. Paracetamol" />
          <DarkSelect label="Category" name="category" value={form.category} onChange={handle} required>
            {CATEGORIES.map(c => <option key={c} style={{ background: '#0a0f0c' }}>{c}</option>)}
          </DarkSelect>
          <DarkInput label="Salt Name" name="saltName" value={form.saltName} onChange={handle} placeholder="e.g. Paracetamol" hint="Prescription mapping ke liye" />
          <DarkInput label="Strength" name="strength" value={form.strength} onChange={handle} placeholder="e.g. 650mg" />
          <div className="lg:col-span-3">
            <DarkTextarea label="Description" name="description" value={form.description} onChange={handle} placeholder="About Medicine..." />
          </div>
        </Section>

        {/* Section 2 — Price & Stock */}
        <Section icon="bi-currency-rupee" title="Price & Stock" delay={100}>
          <DarkInput label="Selling Price (₹)" name="price" type="number" value={form.price} onChange={handle} placeholder="45" min="0" required />
          <DarkInput label="MRP (₹)" name="mrp" type="number" value={form.mrp} onChange={handle} placeholder="55" min="0" required />
          <DarkInput label="Stock" name="stock" type="number" value={form.stock} onChange={handle} placeholder="100" min="0" required />
          <DarkInput label="GST %" name="gstPercent" type="number" value={form.gstPercent} onChange={handle} placeholder="12" min="0" max="100" />
          <DarkSelect label="Unit" name="unit" value={form.unit} onChange={handle}>
            {UNITS.map(u => <option key={u} style={{ background: '#0a0f0c' }}>{u}</option>)}
          </DarkSelect>
          <DarkInput label="Pack Size" name="packSize" value={form.packSize} onChange={handle} placeholder="10 tablets" />
          <DarkSelect label="Dosage Form" name="dosageForm" value={form.dosageForm} onChange={handle}>
            <option value="" style={{ background: '#0a0f0c' }}>— Select —</option>
            {DOSAGE_FORMS.map(d => <option key={d} style={{ background: '#0a0f0c' }}>{d}</option>)}
          </DarkSelect>
          <DarkInput label="HSN Code" name="hsn" value={form.hsn} onChange={handle} placeholder="30049099" />
        </Section>

        {/* Section 3 — Mfg & Expiry */}
        <Section icon="bi-calendar-check" title="Manufacturing & Expiry" delay={150}>
          <DarkInput label="Manufacturing Date (MFD)" name="mfgDate" type="date" value={form.mfgDate} onChange={handle} />
          <DarkInput label="Expiry Date (EXP)" name="expiryDate" type="date" value={form.expiryDate} onChange={handle} hint="User ko card pe dikhega" />
          <DarkInput label="Batch / Lot Number" name="batchNumber" value={form.batchNumber} onChange={handle} placeholder="e.g. CRO-2024-001" />
          <DarkInput label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handle} placeholder="e.g. GSK Consumer" />
          <DarkInput label="Country of Origin" name="countryOfOrigin" value={form.countryOfOrigin} onChange={handle} placeholder="India" />
          <DarkInput label="Shelf Life" name="shelfLife" value={form.shelfLife} onChange={handle} placeholder="e.g. 24 months" />
          <DarkInput label="FSSAI / Drug License" name="fssaiLicense" value={form.fssaiLicense} onChange={handle} placeholder="10012345678901" />
          <DarkInput label="Storage Info" name="storageInfo" value={form.storageInfo} onChange={handle} placeholder="Store below 25°C" />
        </Section>

        {/* Section 4 — Medical Info */}
        <Section icon="bi-file-medical" title="Medical Details" delay={200}>
          <div className="sm:col-span-2 lg:col-span-3">
            <DarkTextarea label="Composition / Ingredients" name="composition" value={form.composition} onChange={handle} placeholder="Active ingredients..." />
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
            <DarkTextarea label="Side Effects" name="sideEffects" value={form.sideEffects} onChange={handle} placeholder="Common side effects..." />
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
            <DarkTextarea label="How To Use" name="howToUse" value={form.howToUse} onChange={handle} placeholder="Dosage instructions..." />
          </div>
          <DarkInput label="Tags" name="tags" value={form.tags} onChange={handle} placeholder="pain, fever, headache" hint="Comma se alag karo" />
        </Section>

        {/* Section 5 — Settings / Toggles */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', opacity: 0, animation: 'fadeUp 0.4s ease 250ms forwards' }}>
          <div className="flex items-center gap-2.5 pb-3 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(20,181,116,0.12)', border: '1px solid rgba(20,181,116,0.2)' }}>
              <i className="bi bi-toggles text-sm" style={{ color: '#14b574' }}></i>
            </div>
            <h3 className="text-sm font-700 text-white">Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'requiresPrescription', label: 'Prescription Mandatory', desc: 'The user will need to provide a prescription', icon: 'bi-file-medical', color: '#f87171' },
              { key: 'isFeatured',           label: 'Featured',             desc: 'Display on Homepage',          icon: 'bi-star-fill',    color: '#fbbf24' },
              { key: 'isActive',             label: 'Active / Published',   desc: 'Visible to users',        icon: 'bi-eye-fill',     color: '#34d399' },
            ].map(({ key, label, desc, icon, color }) => (
              <label key={key}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: form[key] ? `${color}10` : 'rgba(255,255,255,0.03)', border: `1px solid ${form[key] ? `${color}25` : 'rgba(255,255,255,0.07)'}` }}
              >
                <input type="checkbox" name={key} checked={!!form[key]} onChange={handle} className="w-4 h-4 mt-0.5 flex-shrink-0 rounded accent-green-500" />
                <div>
                  <p className="text-sm font-700 text-white flex items-center gap-1.5">
                    <i className={`bi ${icon} text-xs`} style={{ color }}></i> {label}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pb-8" style={{ opacity: 0, animation: 'fadeUp 0.4s ease 300ms forwards' }}>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 text-white transition-all duration-200 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#14b574,#0a9460)', boxShadow: loading ? 'none' : '0 4px 20px rgba(20,181,116,0.35)' }}
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
              : <><i className="bi bi-check-lg"></i> {isEdit ? 'Update Karo' : 'Save'}</>
            }
          </button>
          <button type="button" onClick={() => navigate('/admin/medicines')}
            className="px-6 py-3 rounded-xl text-sm font-600 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}