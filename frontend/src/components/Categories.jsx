import React from 'react'

const categories = [
  { icon: 'bi-capsule',            label: 'Pain Relief',       count: '240+', color: 'bg-red-50 border-red-100',      iconColor: 'text-red-500' },
  { icon: 'bi-heart-pulse',        label: 'Heart Care',        count: '180+', color: 'bg-pink-50 border-pink-100',    iconColor: 'text-pink-500' },
  { icon: 'bi-droplet-half',       label: 'Diabetes',          count: '320+', color: 'bg-blue-50 border-blue-100',    iconColor: 'text-blue-500' },
  { icon: 'bi-bandaid',            label: 'Skincare',          count: '500+', color: 'bg-purple-50 border-purple-100',iconColor: 'text-purple-500' },
  { icon: 'bi-stars',              label: 'Dental Care',       count: '150+', color: 'bg-cyan-50 border-cyan-100',    iconColor: 'text-cyan-500' },
  { icon: 'bi-person-hearts',      label: 'Baby Care',         count: '280+', color: 'bg-yellow-50 border-yellow-100',iconColor: 'text-yellow-500' },
  { icon: 'bi-flower1',            label: 'Ayurveda',          count: '420+', color: 'bg-green-50 border-green-100',  iconColor: 'text-green-500' },
  { icon: 'bi-trophy',             label: 'Sports & Fitness',  count: '190+', color: 'bg-orange-50 border-orange-100',iconColor: 'text-orange-500' },
  { icon: 'bi-brain',              label: 'Mental Wellness',   count: '130+', color: 'bg-teal-50 border-teal-100',    iconColor: 'text-teal-500' },
  { icon: 'bi-eye',                label: 'Eye Care',          count: '95+',  color: 'bg-indigo-50 border-indigo-100',iconColor: 'text-indigo-500' },
  { icon: 'bi-egg-fried',          label: 'Nutrition',         count: '360+', color: 'bg-lime-50 border-lime-100',    iconColor: 'text-lime-600' },
  { icon: 'bi-clipboard2-pulse',   label: 'Lab Tests',         count: '80+',  color: 'bg-rose-50 border-rose-100',    iconColor: 'text-rose-500' },
]

export default function Categories() {
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
        {categories.map((cat, i) => (
          <button key={i} className={`bg-gradient-to-b ${cat.color} border rounded-2xl p-4 flex flex-col items-center gap-2.5 card-lift group text-center`}>
            <div className={`w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <i className={`bi ${cat.icon} ${cat.iconColor} text-xl`}></i>
            </div>
            <div>
              <p className="text-xs font-700 text-gray-800 leading-snug">{cat.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{cat.count} items</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}