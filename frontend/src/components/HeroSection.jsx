import React, { useState, useEffect, useRef, useCallback } from 'react'

const slides = [
  {
    tag:     'Flat 30% Off on Medicines',
    heading: ['Your Health,', 'Delivered in', '30 Minutes'],
    sub:     'Order genuine medicines, vitamins & healthcare products — straight to your door.',
    image:   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&q=80&fit=crop',
    // warm amber palette extracted from pharmacy/medicine imagery
    palette: {
      bg:         'linear-gradient(135deg, #0d1f0f 0%, #0f2d18 45%, #0a1a10 100%)',
      tagBg:      'rgba(52,211,153,0.18)',
      tagBorder:  'rgba(52,211,153,0.35)',
      tagText:    '#6ee7b7',
      headingCol: '#f0fdf4',
      shimFrom:   '#34d399',
      shimMid:    '#a7f3d0',
      shimTo:     '#10b981',
      subText:    'rgba(240,253,244,0.58)',
      dotActive:  '#34d399',
      dotInact:   'rgba(240,253,244,0.22)',
      overlay:    'linear-gradient(to right, rgba(9,28,16,0.82) 0%, rgba(9,28,16,0.55) 50%, rgba(9,28,16,0.15) 100%)',
      blob1:      'rgba(52,211,153,0.20)',
      blob2:      'rgba(16,185,129,0.12)',
      trustBg:    'rgba(240,253,244,0.07)',
      trustBorder:'rgba(240,253,244,0.12)',
      quickBorder:'rgba(240,253,244,0.16)',
      quickText:  'rgba(240,253,244,0.60)',
      marqueeTxt: 'rgba(240,253,244,0.55)',
    },
  },
  {
    tag:     'Lab Tests at Home',
    heading: ['Book Lab Tests', 'from the', 'Comfort of Home'],
    sub:     'Certified technicians collect your sample at your doorstep. Reports in 24 hours.',
    image:   'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1400&q=80&fit=crop',
    // deep blue/indigo palette
    palette: {
      bg:         'linear-gradient(135deg, #060d1f 0%, #0d1a3a 45%, #080f22 100%)',
      tagBg:      'rgba(99,179,237,0.18)',
      tagBorder:  'rgba(99,179,237,0.35)',
      tagText:    '#93c5fd',
      headingCol: '#eff6ff',
      shimFrom:   '#60a5fa',
      shimMid:    '#bfdbfe',
      shimTo:     '#3b82f6',
      subText:    'rgba(239,246,255,0.55)',
      dotActive:  '#60a5fa',
      dotInact:   'rgba(239,246,255,0.22)',
      overlay:    'linear-gradient(to right, rgba(6,13,31,0.85) 0%, rgba(6,13,31,0.55) 50%, rgba(6,13,31,0.12) 100%)',
      blob1:      'rgba(59,130,246,0.22)',
      blob2:      'rgba(99,102,241,0.14)',
      trustBg:    'rgba(239,246,255,0.07)',
      trustBorder:'rgba(239,246,255,0.12)',
      quickBorder:'rgba(239,246,255,0.16)',
      quickText:  'rgba(239,246,255,0.60)',
      marqueeTxt: 'rgba(239,246,255,0.55)',
    },
  },
  {
    tag:     'Buy 2 Get 1 Free',
    heading: ['Ayurvedic', 'Supplements', 'Now Available'],
    sub:     'Explore our curated range of authentic Ayurvedic products backed by science.',
    image:   'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1400&q=80&fit=crop',
    // warm earthy green/amber
    palette: {
      bg:         'linear-gradient(135deg, #1a0f05 0%, #2d1a08 45%, #1a0f05 100%)',
      tagBg:      'rgba(251,191,36,0.18)',
      tagBorder:  'rgba(251,191,36,0.35)',
      tagText:    '#fde68a',
      headingCol: '#fffbeb',
      shimFrom:   '#f59e0b',
      shimMid:    '#fde68a',
      shimTo:     '#d97706',
      subText:    'rgba(255,251,235,0.55)',
      dotActive:  '#fbbf24',
      dotInact:   'rgba(255,251,235,0.22)',
      overlay:    'linear-gradient(to right, rgba(26,15,5,0.88) 0%, rgba(26,15,5,0.58) 50%, rgba(26,15,5,0.15) 100%)',
      blob1:      'rgba(245,158,11,0.20)',
      blob2:      'rgba(217,119,6,0.12)',
      trustBg:    'rgba(255,251,235,0.07)',
      trustBorder:'rgba(255,251,235,0.12)',
      quickBorder:'rgba(255,251,235,0.16)',
      quickText:  'rgba(255,251,235,0.60)',
      marqueeTxt: 'rgba(255,251,235,0.55)',
    },
  },
  {
    tag:     'Skincare & Wellness',
    heading: ['Glow From', 'The Inside', 'Out'],
    sub:     'Premium skincare, vitamins and wellness products — all in one place.',
    image:   'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1400&q=80&fit=crop',
    // soft rose/pink palette
    palette: {
      bg:         'linear-gradient(135deg, #1a0910 0%, #2d1020 45%, #1a0910 100%)',
      tagBg:      'rgba(251,113,133,0.18)',
      tagBorder:  'rgba(251,113,133,0.35)',
      tagText:    '#fda4af',
      headingCol: '#fff1f2',
      shimFrom:   '#fb7185',
      shimMid:    '#fda4af',
      shimTo:     '#e11d48',
      subText:    'rgba(255,241,242,0.55)',
      dotActive:  '#fb7185',
      dotInact:   'rgba(255,241,242,0.22)',
      overlay:    'linear-gradient(to right, rgba(26,9,16,0.88) 0%, rgba(26,9,16,0.55) 50%, rgba(26,9,16,0.12) 100%)',
      blob1:      'rgba(251,113,133,0.22)',
      blob2:      'rgba(225,29,72,0.12)',
      trustBg:    'rgba(255,241,242,0.07)',
      trustBorder:'rgba(255,241,242,0.12)',
      quickBorder:'rgba(255,241,242,0.16)',
      quickText:  'rgba(255,241,242,0.60)',
      marqueeTxt: 'rgba(255,241,242,0.55)',
    },
  },
]

const suggestions = [
  'Paracetamol 650mg', 'Vitamin D3 60K', 'Azithromycin 500mg',
  'Cetirizine 10mg', 'Metformin 500mg', 'Amoxicillin 500mg',
  'Omega-3 Fish Oil', 'Blood Pressure Medicines',
]

const trustItems = [
  { icon: 'bi-shield-fill-check',    label: '100% Genuine',    sub: 'Licensed pharmacy',  iconBg: 'rgba(255,255,255,0.15)', iconColor: 'rgba(255,255,255,0.9)' },
  { icon: 'bi-lightning-charge-fill',label: '30-Min Delivery', sub: 'Express to door',    iconBg: 'rgba(255,255,255,0.15)', iconColor: 'rgba(255,255,255,0.9)' },
  { icon: 'bi-star-fill',            label: '4.8 Rated',       sub: '2M+ customers',      iconBg: 'rgba(255,255,255,0.15)', iconColor: 'rgba(255,255,255,0.9)' },
  { icon: 'bi-headset',              label: '24/7 Support',    sub: 'Expert pharmacists', iconBg: 'rgba(255,255,255,0.15)', iconColor: 'rgba(255,255,255,0.9)' },
]

const quickCats = [
  { icon: 'bi-capsule',          label: 'Medicines'  },
  { icon: 'bi-heart-pulse',      label: 'Heart Care' },
  { icon: 'bi-droplet-half',     label: 'Diabetes'   },
  { icon: 'bi-bandaid',          label: 'Skincare'   },
  { icon: 'bi-flower1',          label: 'Ayurveda'   },
  { icon: 'bi-clipboard2-pulse', label: 'Lab Tests'  },
]

const TRANSITION_MS = 700

export default function HeroSection({ onSearchVisibilityChange }) {
  const [active, setActive]         = useState(0)
  const [prev, setPrev]             = useState(null)
  const [transitioning, setTrans]   = useState(false)
  const [query, setQuery]           = useState('')
  const [focused, setFocused]       = useState(false)
  const heroRef                     = useRef(null)
  const timerRef                    = useRef(null)

  const goTo = useCallback((idx) => {
    if (transitioning || idx === active) return
    setPrev(active)
    setActive(idx)
    setTrans(true)
    setTimeout(() => { setPrev(null); setTrans(false) }, TRANSITION_MS)
  }, [active, transitioning])

  const next = useCallback(() => goTo((active + 1) % slides.length), [active, goTo])

  /* auto-rotate */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 5000)
  }, [next])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  /* IntersectionObserver — hero fully gone → show navbar search */
  useEffect(() => {
    if (!heroRef.current || !onSearchVisibilityChange) return
    const obs = new IntersectionObserver(
      ([entry]) => onSearchVisibilityChange(entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(heroRef.current)
    return () => obs.disconnect()
  }, [onSearchVisibilityChange])

  const slide = slides[active]
  const p     = slide.palette

  const filtered = query.length > 1
    ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions.slice(0, 6)

  /* shimmer style derived from palette */
  const shimmerStyle = {
    background: `linear-gradient(90deg, ${p.shimFrom} 0%, ${p.shimMid} 40%, ${p.shimTo} 70%, ${p.shimFrom} 100%)`,
    backgroundSize: '220% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 4s linear infinite',
  }

  return (
    <>
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: p.bg, transition: `background ${TRANSITION_MS}ms ease` }}>

        {/* ── Background images with crossfade ── */}
        <div className="absolute inset-0">
          {/* previous image fading out */}
          {prev !== null && (
            <div
              key={`prev-${prev}`}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slides[prev].image})`,
                opacity: transitioning ? 0 : 1,
                transition: `opacity ${TRANSITION_MS}ms ease`,
              }}
            />
          )}
          {/* current image fading in */}
          <div
            key={`curr-${active}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              opacity: transitioning ? 0 : 1,
              transition: `opacity ${TRANSITION_MS}ms ease`,
            }}
          />
          {/* gradient overlay for text readability — palette-aware */}
          <div
            className="absolute inset-0"
            style={{ background: p.overlay, transition: `background ${TRANSITION_MS}ms ease` }}
          />
          {/* dark vignette bottom for marquee */}
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
        </div>

        {/* ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full"
            style={{ background: `radial-gradient(circle, ${p.blob1} 0%, transparent 70%)`, transition: `background ${TRANSITION_MS}ms ease` }} />
          <div className="absolute -bottom-20 -left-16 w-[320px] h-[320px] rounded-full"
            style={{ background: `radial-gradient(circle, ${p.blob2} 0%, transparent 70%)`, transition: `background ${TRANSITION_MS}ms ease` }} />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        {/* ── Content ── */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12 text-center">

          {/* slide dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetTimer() }}
                className="rounded-full transition-all duration-400"
                style={{
                  width:      i === active ? '24px' : '8px',
                  height:     '8px',
                  background: i === active ? p.dotActive : p.dotInact,
                  transition: `width 0.35s ease, background ${TRANSITION_MS}ms ease`,
                }}
              />
            ))}
          </div>

          {/* tag badge */}
          <div
            key={`tag-${active}`}
            className="anim-fade-up mb-5 flex justify-center"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-700 tracking-wide"
              style={{
                background:   p.tagBg,
                border:       `1px solid ${p.tagBorder}`,
                color:        p.tagText,
                transition:   `all ${TRANSITION_MS}ms ease`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: p.tagText }}></span>
              {slide.tag}
            </span>
          </div>

          {/* headline */}
          <div key={`h-${active}`} className="mb-5">
            {slide.heading.map((line, i) => (
              <h1
                key={i}
                className={`font-display font-700 leading-[1.08] tracking-tight anim-fade-up d${i + 1} text-4xl sm:text-5xl xl:text-[3.6rem]`}
                style={i === slide.heading.length - 1 ? shimmerStyle : { color: p.headingCol, transition: `color ${TRANSITION_MS}ms ease` }}
              >
                {line}
              </h1>
            ))}
          </div>

          {/* sub */}
          <p
            key={`sub-${active}`}
            className="anim-fade-up d3 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: p.subText, transition: `color ${TRANSITION_MS}ms ease` }}
          >
            {slide.sub}
          </p>

          {/* ── BIG SEARCH BAR ── */}
          <div className="anim-fade-up d4 relative mb-4">
            <div className={`flex items-center rounded-2xl border-2 bg-white transition-all duration-300 ${
              focused ? 'border-brand-400 shadow-2xl shadow-black/40' : 'border-transparent shadow-xl shadow-black/35'
            }`}>
              <i className={`bi bi-search text-base mx-4 flex-shrink-0 transition-colors ${focused ? 'text-brand-500' : 'text-gray-400'}`}></i>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 180)}
                placeholder="Search medicines, vitamins, health products..."
                className="flex-1 py-4 bg-transparent text-sm sm:text-base outline-none text-gray-800 placeholder-gray-400 font-500"
              />
              <button className="m-2 btn-primary px-5 py-3 text-sm rounded-xl flex-shrink-0 gap-2">
                <i className="bi bi-search text-xs"></i>
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* suggestions dropdown */}
            {focused && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-40 anim-scale-in text-left overflow-hidden">
                <p className="text-[11px] text-gray-400 font-700 uppercase tracking-wider px-4 pt-1 pb-2">
                  {query.length > 1 ? 'Matching Results' : 'Popular Searches'}
                </p>
                {filtered.map((s, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors text-left"
                    onMouseDown={() => setQuery(s)}
                  >
                    <i className="bi bi-search text-gray-300 text-xs flex-shrink-0"></i>
                    <span className="text-sm font-500 text-gray-700">{s}</span>
                    <i className="bi bi-arrow-up-left text-gray-200 text-xs ml-auto"></i>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* quick tags */}
          <div className="anim-fade-up d5 flex flex-wrap items-center justify-center gap-2 mb-10">
            <span className="text-xs font-600" style={{ color: p.quickText }}>Trending:</span>
            {['Paracetamol', 'Vitamin D3', 'Cetirizine', 'BP Medicines', 'Diabetes'].map((tag, i) => (
              <button
                key={i}
                onClick={() => setQuery(tag)}
                className="text-xs font-600 rounded-full px-3 py-1 transition-all duration-200"
                style={{
                  color:       p.quickText,
                  border:      `1px solid ${p.quickBorder}`,
                  background:  'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color   = p.headingCol
                  e.currentTarget.style.borderColor = p.tagBorder
                  e.currentTarget.style.background  = p.tagBg
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color   = p.quickText
                  e.currentTarget.style.borderColor = p.quickBorder
                  e.currentTarget.style.background  = 'transparent'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* trust badges */}
          <div className="anim-fade-up d6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trustItems.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background:   p.trustBg,
                  border:       `1px solid ${p.trustBorder}`,
                  transition:   `background ${TRANSITION_MS}ms ease, border ${TRANSITION_MS}ms ease`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: t.iconBg }}
                >
                  <i className={`bi ${t.icon} text-sm`} style={{ color: t.iconColor }}></i>
                </div>
                <div className="text-left">
                  <p className="text-xs font-700 leading-none" style={{ color: p.headingCol }}>{t.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: p.subText }}>{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Marquee ticker ── */}
        <div className="border-t" style={{ borderColor: p.trustBorder, background: 'rgba(0,0,0,0.25)' }}>
          <div className="overflow-hidden py-3">
            <div className="anim-marquee flex whitespace-nowrap w-max">
              {Array(2).fill([
                'Free Delivery above ₹499',
                'Genuine Medicines Guaranteed',
                '30-Minute Express Delivery',
                '24/7 Pharmacist Support',
                'Easy Returns & Refunds',
                '50,000+ Products',
                'Trusted by 2M+ Customers',
                'Prescription Upload Available',
              ]).flat().map((text, i) => (
                <span key={i} className="inline-flex items-center gap-3 px-8 text-xs font-600" style={{ color: p.marqueeTxt }}>
                  <i className="bi bi-plus-circle-fill text-[10px]" style={{ color: p.tagText }}></i>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* quick category chips */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3.5">
            {quickCats.map((c, i) => (
              <button key={i} className="flex items-center gap-2 flex-shrink-0 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 text-gray-700 hover:text-brand-700 rounded-full px-4 py-2 text-sm font-600 transition-all duration-200">
                <i className={`bi ${c.icon} text-brand-500 text-sm`}></i>
                {c.label}
              </button>
            ))}
            <button className="flex items-center gap-1 flex-shrink-0 text-brand-600 text-sm font-700 px-2 ml-1 hover:text-brand-800 transition-colors whitespace-nowrap">
              View All <i className="bi bi-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}