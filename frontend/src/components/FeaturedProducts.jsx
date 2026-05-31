import React, { useState } from 'react'

const products = [
  { id:1, name:'Paracetamol 650mg', brand:'Crocin', category:'Fever & Pain', price:45, mrp:55, discount:18, rating:4.7, reviews:2340, prescription:false, icon:'bi-capsule', badge:'Bestseller', badgeColor:'bg-brand-500' },
  { id:2, name:'Vitamin D3 60K IU', brand:'Sun Pharma', category:'Vitamins', price:110, mrp:145, discount:24, rating:4.8, reviews:1820, prescription:false, icon:'bi-sun', badge:'Top Rated', badgeColor:'bg-yellow-500' },
  { id:3, name:'Amoxicillin 500mg', brand:'Cipla', category:'Antibiotic', price:120, mrp:150, discount:20, rating:4.6, reviews:980, prescription:true, icon:'bi-prescription2', badge:'Rx Required', badgeColor:'bg-red-500' },
  { id:4, name:'Azithromycin 500mg', brand:'Abbott', category:'Antibiotic', price:95, mrp:115, discount:17, rating:4.5, reviews:1450, prescription:true, icon:'bi-prescription', badge:'Rx Required', badgeColor:'bg-red-500' },
  { id:5, name:'Omega-3 Fish Oil', brand:'HealthKart', category:'Supplements', price:499, mrp:699, discount:29, rating:4.9, reviews:3210, prescription:false, icon:'bi-droplet', badge:'New', badgeColor:'bg-blue-500' },
  { id:6, name:'Metformin 500mg', brand:'USV', category:'Diabetes', price:68, mrp:85, discount:20, rating:4.7, reviews:2100, prescription:true, icon:'bi-activity', badge:'Rx Required', badgeColor:'bg-red-500' },
  { id:7, name:'Cetirizine 10mg', brand:'Alkem', category:'Allergy', price:38, mrp:50, discount:24, rating:4.6, reviews:1670, prescription:false, icon:'bi-wind', badge:'Bestseller', badgeColor:'bg-brand-500' },
  { id:8, name:'Multivitamin Daily', brand:'Revital H', category:'Vitamins', price:320, mrp:420, discount:24, rating:4.8, reviews:4500, prescription:false, icon:'bi-stars', badge:'Popular', badgeColor:'bg-violet-500' },
]

function ProductCard({ product }) {
  const [wished, setWished] = useState(false)
  const [added, setAdded]   = useState(false)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift group relative flex flex-col">
      <span className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white text-[10px] font-800 px-2.5 py-1 rounded-full`}>
        {product.badge}
      </span>
      <button
        onClick={() => setWished(!wished)}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110"
      >
        <i className={`bi ${wished ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-400'} text-sm`}></i>
      </button>

      {/* Product visual */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-brand-50 flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-300 overflow-hidden">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
          <i className={`bi ${product.icon} text-brand-500 text-2xl`}></i>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-brand-600 font-700 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-700 text-gray-900 mt-0.5 leading-snug">{product.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{product.category}</p>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
            <i className="bi bi-star-fill text-green-600 text-[10px]"></i>
            <span className="text-[11px] font-700 text-green-700">{product.rating}</span>
          </div>
          <span className="text-[11px] text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-base font-800 text-gray-900">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          <span className="text-xs font-700 text-brand-600">{product.discount}% off</span>
        </div>

        {product.prescription && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-red-600 font-700 bg-red-50 border border-red-100 rounded-lg px-2 py-1">
            <i className="bi bi-file-medical"></i> Prescription Required
          </div>
        )}

        <button
          onClick={handleAdd}
          className={`mt-auto pt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-700 transition-all duration-300 ${
            added
              ? 'bg-brand-500 text-white shadow-md'
              : 'border-2 border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50'
          }`}
        >
          <i className={`bi ${added ? 'bi-check2-circle' : 'bi-cart-plus'} text-base`}></i>
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}