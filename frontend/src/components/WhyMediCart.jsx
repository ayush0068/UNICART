import React from 'react'

const features = [
  { icon: 'bi-lightning-charge-fill', color: 'bg-yellow-100 text-yellow-700', shadow: 'shadow-yellow-200', title: '30-Min Delivery', desc: 'Lightning-fast delivery to your door. Available in 50+ cities across India.' },
  { icon: 'bi-shield-fill-check',     color: 'bg-blue-100 text-blue-700',   shadow: 'shadow-blue-200',   title: '100% Genuine',     desc: 'Every medicine sourced directly from certified manufacturers. No counterfeits, ever.' },
  { icon: 'bi-clock-fill',            color: 'bg-purple-100 text-purple-700',shadow: 'shadow-purple-200', title: '24/7 Available',   desc: "Order anytime, day or night. We never close — because health doesn't wait." },
  { icon: 'bi-headset',               color: 'bg-orange-100 text-orange-700',shadow: 'shadow-orange-200', title: 'Expert Support',   desc: 'Qualified pharmacists available round the clock for consultation and guidance.' },
  { icon: 'bi-arrow-counterclockwise',color: 'bg-cyan-100 text-cyan-700',   shadow: 'shadow-cyan-200',   title: 'Easy Returns',     desc: 'Not satisfied? Return within 7 days, no questions asked. 100% refund guaranteed.' },
  { icon: 'bi-tag-fill',              color: 'bg-brand-100 text-brand-700', shadow: 'shadow-brand-200',  title: 'Best Prices',      desc: 'Save up to 50% vs retail. Price match guarantee on all products.' },
]

export default function WhyMediCart() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-700 px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Why MediCart
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-800 text-gray-900">
            Healthcare Made <span className="text-brand-500">Simple</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto text-base">
            We're not just a pharmacy — we're your complete health partner.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 card-lift group">
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${f.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <i className={`bi ${f.icon} text-xl`}></i>
              </div>
              <h3 className="font-display text-lg font-700 text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white divide-y-2 md:divide-y-0 md:divide-x divide-white/20">
            {[
              { num: '2M+',  label: 'Happy Customers', icon: 'bi-people-fill' },
              { num: '50K+', label: 'Products Available', icon: 'bi-box-seam-fill' },
              { num: '50+',  label: 'Cities Covered', icon: 'bi-geo-fill' },
              { num: '4.8',  label: 'Average Rating', icon: 'bi-star-fill' },
            ].map((s, i) => (
              <div key={i} className="py-4 md:py-0">
                <i className={`bi ${s.icon} text-white/40 text-xl mb-2 block`}></i>
                <p className="font-display text-3xl md:text-4xl font-800">{s.num}</p>
                <p className="text-white/65 text-sm mt-1 font-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}