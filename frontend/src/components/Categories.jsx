import React, { useState, useEffect } from 'react'
import medicineApi from '../services/api'

/* Static icon + color config per category */
const CATEGORY_META = {
  'Pain Relief':            { icon: 'bi-capsule',          color: 'bg-red-50 border-red-100',      iconColor: 'text-red-500' },
  'Fever':                  { icon: 'bi-thermometer-half', color: 'bg-orange-50 border-orange-100', iconColor: 'text-orange-500' },
  'Antibiotics':            { icon: 'bi-prescription2',    color: 'bg-teal-50 border-teal-100',     iconColor: 'text-teal-500' },
  'Vitamins & Supplements': { icon: 'bi-stars',            color: 'bg-yellow-50 border-yellow-100', iconColor: 'text-yellow-500' },
  'Diabetes':               { icon: 'bi-droplet-half',     color: 'bg-blue-50 border-blue-100',     iconColor: 'text-blue-500' },
  'Heart Care':             { icon: 'bi-heart-pulse',      color: 'bg-pink-50 border-pink-100',     iconColor: 'text-pink-500' },
  'Skincare':               { icon: 'bi-bandaid',          color: 'bg-purple-50 border-purple-100', iconColor: 'text-purple-500' },
  'Baby Care':              { icon: 'bi-person-hearts',    color: 'bg-lime-50 border-lime-100',     iconColor: 'text-lime-600' },
  'Ayurveda':               { icon: 'bi-flower1',          color: 'bg-green-50 border-green-100',   iconColor: 'text-green-500' },
  'Cold & Cough':           { icon: 'bi-wind',             color: 'bg-cyan-50 border-cyan-100',     iconColor: 'text-cyan-500' },
  'Digestive':              { icon: 'bi-egg-fried',        color: 'bg-amber-50 border-amber-100',   iconColor: 'text-amber-500' },
  'Eye Care':               { icon: 'bi-eye',              color: 'bg-indigo-50 border-indigo-100', iconColor: 'text-indigo-500' },
  'Dental':                 { icon: 'bi-stars',            color: 'bg-cyan-50 border-cyan-100',     iconColor: 'text-cyan-500' },
  'Mental Wellness':        { icon: 'bi-brain',            color: 'bg-teal-50 border-teal-100',     iconColor: 'text-teal-500' },
  'Sports & Fitness':       { icon: 'bi-trophy',           color: 'bg-orange-50 border-orange-100', iconColor: 'text-orange-500' },
  'Nutrition':              { icon: 'bi-egg-fried',        color: 'bg-lime-50 border-lime-100',     iconColor: 'text-lime-600' },
  'Sexual Wellness':        { icon: 'bi-heart',            color: 'bg-rose-50 border-rose-100',     iconColor: 'text-rose-500' },
  'Lab Tests':              { icon: 'bi-clipboard2-pulse', color: 'bg-rose-50 border-rose-100',     iconColor: 'text-rose-500' },
  'Other':                  { icon: 'bi-box',              color: 'bg-gray-50 border-gray-100',     iconColor: 'text-gray-500' },
}

function CategorySkeleton() {
  return (
    <div className="bg-gray-100 rounded-2xl h-24 animate-pulse"></div>
  )
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    medicineApi.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  /* Merge API data with static meta */
  const items = categories.map(c => ({
    label: c._id,
    count: c.count,
    ...(CATEGORY_META[c._id] || { icon: 'bi-box', color: 'bg-gray-50 border-gray-100', iconColor: 'text-gray-500' }),
  }))

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-800 text-gray-900">Shop by Category</h2>
          <p className="text-gray-400 text-sm mt-0.5">Find exactly what you need</p>
        </div>
        <button className="flex items-center gap-1 text-brand-600 font-700 text-sm hover:text-brand-800 transition-colors">
          All <i className="bi bi-chevron-right text-xs"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <CategorySkeleton key={i} />)
          : items.length === 0
          ? (
            <div className="col-span-full text-center py-10 text-gray-400 text-sm">
              Koi category nahi mili. Admin se medicines add karwao.
            </div>
          )
          : items.map((cat, i) => (
            <button
              key={i}
              className={`bg-gradient-to-b ${cat.color} border rounded-2xl p-4 flex flex-col items-center gap-2.5 card-lift group text-center`}
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <i className={`bi ${cat.icon} ${cat.iconColor} text-xl`}></i>
              </div>
              <div>
                <p className="text-xs font-700 text-gray-800 leading-snug">{cat.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{cat.count} items</p>
              </div>
            </button>
          ))
        }
      </div>
    </section>
  )
}