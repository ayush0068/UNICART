import React, { useState, useEffect } from 'react'

const offers = [
  { bg: 'from-brand-600 to-brand-800', tag: 'FLAT 30% OFF', title: 'On All Prescription Medicines', sub: 'Use code MEDI30 at checkout', cta: 'Shop Now', icon: 'bi-capsule' },
  { bg: 'from-blue-600 to-indigo-700', tag: 'UP TO 50% OFF', title: 'Lab Tests at Home', sub: 'Book today, reports tomorrow', cta: 'Book Test', icon: 'bi-clipboard2-pulse' },
  { bg: 'from-violet-600 to-purple-700', tag: 'BUY 2 GET 1 FREE', title: 'Ayurvedic Supplements', sub: 'Limited time offer', cta: 'Explore', icon: 'bi-flower1' },
]

export default function OfferBanner() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % offers.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="relative rounded-3xl overflow-hidden h-36 md:h-48 shadow-lg">
        {offers.map((o, i) => (
          <div key={i} className={`absolute inset-0 bg-gradient-to-r ${o.bg} flex items-center transition-all duration-600 ${
            i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex items-center gap-6 md:gap-10 px-7 md:px-12 w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className={`bi ${o.icon} text-white text-3xl md:text-4xl`}></i>
              </div>
              <div className="text-white flex-1">
                <span className="inline-block bg-white/20 text-xs font-800 px-3 py-1 rounded-full mb-2 tracking-widest">{o.tag}</span>
                <h3 className="font-display text-xl md:text-3xl font-800 leading-tight">{o.title}</h3>
                <p className="text-white/65 text-sm mt-1">{o.sub}</p>
              </div>
              <button className="hidden md:flex items-center gap-2 bg-white text-gray-800 font-800 text-sm px-6 py-3 rounded-full flex-shrink-0 hover:shadow-xl transition-all hover:-translate-y-0.5">
                {o.cta} <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {offers.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 h-1.5 ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>

        <button onClick={() => setActive((active - 1 + offers.length) % offers.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all">
          <i className="bi bi-chevron-left text-sm"></i>
        </button>
        <button onClick={() => setActive((active + 1) % offers.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all">
          <i className="bi bi-chevron-right text-sm"></i>
        </button>
      </div>
    </div>
  )
}