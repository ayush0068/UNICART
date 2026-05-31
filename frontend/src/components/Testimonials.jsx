import React from 'react'

const testimonials = [
  { name:'Priya Sharma',   city:'Delhi',     icon:'bi-person-circle', rating:5, tag:'Regular Customer',   text:"MediCart delivered my medicines in just 28 minutes! The app is super easy and prices are way better than my local pharmacy." },
  { name:'Rajesh Kumar',   city:'Mumbai',    icon:'bi-person-badge',  rating:5, tag:'Using for 2 years',   text:"The prescription upload feature is a lifesaver. I photographed my doctor's prescription and all medicines were auto-added to cart. Amazing!" },
  { name:'Anita Patel',    city:'Ahmedabad', icon:'bi-person-heart',  rating:5, tag:'Chronic Patient',     text:"As a diabetic patient I need monthly medicines. MediCart's genuine products and subscription feature give me complete peace of mind." },
  { name:'Dr. Suresh Nair',city:'Bangalore', icon:'bi-person-check',  rating:5, tag:'Verified Doctor',     text:"I recommend MediCart to all my patients. 100% genuine medicines, proper storage, and fast delivery. Exactly what healthcare needs." },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-700 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Customer Love
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-800 text-gray-900">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1,2,3,4,5].map(i => <i key={i} className="bi bi-star-fill text-yellow-400 text-base"></i>)}
            <span className="text-gray-700 font-800 ml-1">4.8/5</span>
            <span className="text-gray-400 text-sm ml-1">from 2M+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 card-lift relative">
              <i className="bi bi-quote text-brand-200 text-3xl absolute top-3 right-4 leading-none"></i>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className={`bi ${t.icon} text-brand-600 text-xl`}></i>
                </div>
                <div>
                  <p className="font-700 text-gray-900 text-sm">{t.name}</p>
                  <p className="text-[11px] text-gray-400">{t.city} · {t.tag}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array(t.rating).fill(0).map((_,j) => (
                  <i key={j} className="bi bi-star-fill text-yellow-400 text-[11px]"></i>
                ))}
              </div>

              <p className="text-gray-500 text-sm leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}