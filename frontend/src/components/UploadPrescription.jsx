import React, { useState } from 'react'

export default function UploadPrescription() {
  const [dragging, setDragging] = useState(false)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="bg-gradient-to-br from-dark to-brand-950 rounded-3xl overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(20,181,116,0.15) 0%, transparent 70%)' }} />
          <div className="dot-grid absolute inset-0 opacity-50" />
        </div>

        <div className="relative grid md:grid-cols-2 items-stretch">
          {/* Left */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-700 px-3.5 py-1.5 rounded-full w-fit mb-5"
              style={{ background: 'rgba(20,181,116,0.15)', border: '1px solid rgba(20,181,116,0.3)', color: '#6ee7b7' }}>
              <i className="bi bi-file-medical"></i> Upload Prescription
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-800 text-white leading-tight mb-4">
              Have a Doctor's<br />
              <span className="shimmer-text">Prescription?</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-6">
              Upload your prescription and we'll find all medicines for you — no manual searching needed.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { icon: 'bi-clock-history', text: 'Pharmacist verifies within minutes' },
                { icon: 'bi-cart-check', text: 'Medicines auto-added to your cart' },
                { icon: 'bi-patch-check', text: 'Safe, genuine medicines guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-brand-500/20 border border-brand-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`bi ${item.icon} text-brand-400 text-xs`}></i>
                  </div>
                  <span className="text-white/65 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-white/30 text-xs">Accepted: JPG, PNG, PDF &nbsp;·&nbsp; Max size 10MB</p>
          </div>

          {/* Right */}
          <div className="p-6 md:p-10 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10">
            <div
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDrop={() => setDragging(false)}
              onDragOver={e => e.preventDefault()}
              className={`w-full max-w-sm border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragging ? 'border-brand-400 bg-brand-500/10 scale-105' : 'border-white/20 hover:border-brand-500/50 hover:bg-white/5'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(20,181,116,0.15)', border: '1px solid rgba(20,181,116,0.25)' }}>
                <i className="bi bi-cloud-arrow-up text-brand-400 text-3xl"></i>
              </div>
              <p className="text-white font-700 text-lg mb-1">Drop file here</p>
              <p className="text-white/45 text-sm mb-7">or choose an option below</p>

              <div className="flex flex-col gap-2.5">
                <button className="btn-primary w-full justify-center py-3">
                  <i className="bi bi-images"></i> Choose from Gallery
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-full border-2 border-white/20 text-white font-700 text-sm hover:border-white/40 hover:bg-white/5 transition-all">
                  <i className="bi bi-camera"></i> Take a Photo
                </button>
              </div>
              <p className="text-white/25 text-xs mt-5">Your prescription is private & confidential</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}