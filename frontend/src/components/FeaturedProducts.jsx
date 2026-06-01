import React, { useState, useEffect } from 'react'
import { medicineApi } from '../services/api'

/* ── Category icon mapping (fallback when no image) ── */
const CATEGORY_ICONS = {
  'Pain Relief':           'bi-capsule',
  'Fever':                 'bi-thermometer-half',
  'Antibiotics':           'bi-prescription2',
  'Vitamins & Supplements':'bi-stars',
  'Diabetes':              'bi-activity',
  'Heart Care':            'bi-heart-pulse',
  'Skincare':              'bi-bandaid',
  'Baby Care':             'bi-person-hearts',
  'Ayurveda':              'bi-flower1',
  'Cold & Cough':          'bi-wind',
  'Digestive':             'bi-egg-fried',
  'Eye Care':              'bi-eye',
  'Dental':                'bi-stars',
  'Mental Wellness':       'bi-brain',
  'Sports & Fitness':      'bi-trophy',
  'Nutrition':             'bi-egg-fried',
  'Sexual Wellness':       'bi-heart',
  'Lab Tests':             'bi-clipboard2-pulse',
  'Other':                 'bi-box',
}

/* ── Format date as DD MMM YYYY ── */
function fmtDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

/* ── Expiry badge color ── */
function expiryBadge(expiryDate) {
  if (!expiryDate) return null
  const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0)   return { label: 'Expired',        cls: 'bg-red-100 text-red-700 border-red-200' }
  if (days <= 30) return { label: `Exp in ${days}d`, cls: 'bg-orange-100 text-orange-700 border-orange-200' }
  if (days <= 90) return { label: `Exp: ${fmtDate(expiryDate)}`, cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
  return null   // far-future expiry — no badge needed
}

function ProductCard({ product }) {
  const [wished, setWished] = useState(false)
  const [added,  setAdded]  = useState(false)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const icon    = CATEGORY_ICONS[product.category] || 'bi-capsule'
  const expBadge = expiryBadge(product.expiryDate)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift group relative flex flex-col">
      {/* Featured badge */}
      {product.isFeatured && (
        <span className="absolute top-3 left-3 z-10 bg-brand-500 text-white text-[10px] font-800 px-2.5 py-1 rounded-full">
          Featured
        </span>
      )}

      {/* Expiry warning badge */}
      {expBadge && (
        <span className={`absolute top-3 ${product.isFeatured ? 'left-[80px]' : 'left-3'} z-10 text-[10px] font-700 px-2 py-1 rounded-full border ${expBadge.cls}`}>
          <i className="bi bi-clock me-1"></i>{expBadge.label}
        </span>
      )}

      <button
        onClick={() => setWished(!wished)}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110"
      >
        <i className={`bi ${wished ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-400'} text-sm`}></i>
      </button>

      {/* Product visual — image or icon fallback */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-brand-50 flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-300 overflow-hidden">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <i className={`bi ${icon} text-brand-500 text-2xl`}></i>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-brand-600 font-700 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-700 text-gray-900 mt-0.5 leading-snug">{product.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{product.category}</p>

        {/* Pack size + unit */}
        {product.packSize && (
          <p className="text-[10px] text-gray-500 mt-0.5">
            <i className="bi bi-box me-1"></i>{product.packSize}
          </p>
        )}

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
              <i className="bi bi-star-fill text-green-600 text-[10px]"></i>
              <span className="text-[11px] font-700 text-green-700">{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">({product.numReviews.toLocaleString()})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-base font-800 text-gray-900">₹{product.price}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
              <span className="text-xs font-700 text-brand-600">{product.discount}% off</span>
            </>
          )}
        </div>

        {/* MFG / Expiry mini info */}
        <div className="mt-2 space-y-0.5">
          {product.mfgDate && (
            <p className="text-[10px] text-gray-400">
              <span className="font-600 text-gray-500">Mfd:</span> {fmtDate(product.mfgDate)}
            </p>
          )}
          {product.expiryDate && (
            <p className="text-[10px] text-gray-400">
              <span className="font-600 text-gray-500">Exp:</span> {fmtDate(product.expiryDate)}
            </p>
          )}
          {product.batchNumber && (
            <p className="text-[10px] text-gray-400">
              <span className="font-600 text-gray-500">Batch:</span> {product.batchNumber}
            </p>
          )}
        </div>

        {/* Prescription label */}
        {product.requiresPrescription && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-red-600 font-700 bg-red-50 border border-red-100 rounded-lg px-2 py-1">
            <i className="bi bi-file-medical"></i> Prescription Required
          </div>
        )}

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="mt-1 text-[10px] text-orange-600 font-600">
            Only {product.stock} left!
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`mt-auto pt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-700 transition-all duration-300 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : added
              ? 'bg-brand-500 text-white shadow-md'
              : 'border-2 border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50'
          }`}
        >
          <i className={`bi ${product.stock === 0 ? 'bi-x-circle' : added ? 'bi-check2-circle' : 'bi-cart-plus'} text-base`}></i>
          {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

/* ── Skeleton loader ── */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-32 bg-gray-100"></div>
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        <div className="h-5 bg-gray-100 rounded w-1/4 mt-3"></div>
        <div className="h-9 bg-gray-100 rounded-xl mt-3"></div>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [medicines, setMedicines] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    medicineApi.getFeatured()
      .then(res => setMedicines(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-800 text-gray-900">Popular Medicines</h2>
          <p className="text-gray-400 text-sm mt-0.5">Most ordered products this week</p>
        </div>
        <button className="flex items-center gap-1 text-brand-600 font-700 text-sm hover:text-brand-800 transition-colors">
          View All <i className="bi bi-chevron-right text-xs"></i>
        </button>
      </div>

      {error && (
        <div className="text-center py-10 text-red-500">
          <i className="bi bi-exclamation-triangle text-3xl"></i>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      )}

      {!error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : medicines.length === 0
            ? (
              <div className="col-span-full text-center py-14 text-gray-400">
                <i className="bi bi-box text-4xl"></i>
                <p className="mt-2 text-sm">No featured medicines yet. Admin se kaho add kare!</p>
              </div>
            )
            : medicines.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      )}
    </section>
  )
}