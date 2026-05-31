import React, { useState, useEffect, useRef } from 'react'

const DEFAULT = 'Varanasi 221001'

/* reverse geocode using Nominatim — no API key needed */
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const data = await res.json()
  const a    = data.address || {}
  const city = a.city || a.town || a.village || a.county || a.state_district || ''
  const pin  = a.postcode || ''
  return { city, pin, full: city && pin ? `${city} ${pin}` : city || pin || DEFAULT }
}

/* IP fallback — works without any permission */
async function ipLocation() {
  try {
    const r = await fetch('https://ipapi.co/json/')
    const d = await r.json()
    if (d.city) return { city: d.city, pin: d.postal || '', full: `${d.city}${d.postal ? ' ' + d.postal : ''}` }
  } catch {}
  return { city: 'Varanasi', pin: '221001', full: DEFAULT }
}

export default function Navbar({ searchVisible = true }) {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const [locOpen, setLocOpen]         = useState(false)
  const [manualPin, setManualPin]     = useState('')

  /* location state machine */
  const [locState, setLocState] = useState({
    status: 'idle',   // idle | requesting | locating | success | denied | error
    text:   '',
    city:   '',
    pin:    '',
  })

  const locRef = useRef(null)
  const cats   = ['All', 'Medicines', 'Vitamins', 'Skincare', 'Diabetes', 'Baby Care', 'COVID', 'Ayurveda', 'Lab Tests']

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* outside click */
  useEffect(() => {
    const fn = (e) => { if (locRef.current && !locRef.current.contains(e.target)) setLocOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  /* on mount — try IP first silently, then ask GPS */
  useEffect(() => {
    const init = async () => {
      /* step 1 — show IP location quickly */
      setLocState(s => ({ ...s, status: 'locating' }))
      const ip = await ipLocation()
      setLocState({ status: 'success', text: ip.full, city: ip.city, pin: ip.pin, source: 'ip' })

      /* step 2 — try GPS silently in background for better accuracy */
      if (!navigator.geolocation) return
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            setLocState(s => ({ ...s, status: 'locating', source: 'gps' }))
            const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            setLocState({ status: 'success', text: geo.full, city: geo.city, pin: geo.pin, source: 'gps' })
          } catch {
            /* keep IP result */
          }
        },
        () => { /* GPS denied — keep IP result */ },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      )
    }
    init()
  }, [])

  /* manual "Use my location" button — explicitly ask GPS */
  const askGPS = () => {
    if (!navigator.geolocation) {
      setLocState(s => ({ ...s, status: 'error', text: 'GPS not supported' }))
      return
    }
    setLocState(s => ({ ...s, status: 'requesting' }))
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocState(s => ({ ...s, status: 'locating' }))
        try {
          const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          setLocState({ status: 'success', text: geo.full, city: geo.city, pin: geo.pin, source: 'gps' })
        } catch {
          setLocState(s => ({ ...s, status: 'error', text: 'Could not resolve address' }))
        }
      },
      (err) => {
        if (err.code === 1) setLocState(s => ({ ...s, status: 'denied' }))
        else setLocState(s => ({ ...s, status: 'error', text: 'Location unavailable' }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualPin.trim()) {
      setLocState({ status: 'success', text: manualPin.trim(), city: '', pin: '', source: 'manual' })
      setManualPin('')
      setLocOpen(false)
    }
  }

  const isLoading = locState.status === 'requesting' || locState.status === 'locating'
  const showNavSearch = !searchVisible

  const LocationIcon = () => {
    if (isLoading) return <span className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></span>
    if (locState.status === 'denied' || locState.status === 'error') return <i className="bi bi-geo-alt text-red-400 text-xs flex-shrink-0"></i>
    return <i className="bi bi-geo-alt-fill text-brand-500 text-xs flex-shrink-0"></i>
  }

  const locLabel = () => {
    if (locState.status === 'idle') return 'Detecting...'
    if (locState.status === 'requesting') return 'Requesting...'
    if (locState.status === 'locating') return 'Locating...'
    if (locState.status === 'denied') return 'Permission denied'
    return locState.text || DEFAULT
  }

  return (
    <>
      {/* announcement */}
      <div className="bg-brand-700 text-white text-xs py-1.5 text-center hidden md:block font-600 tracking-wide">
        Free delivery on orders above ₹499 &nbsp;·&nbsp; 24/7 Support: 1800-000-0000 &nbsp;·&nbsp; 100% Genuine Medicines
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-brand-200 group-hover:shadow-lg transition-all duration-200">
                <i className="bi bi-capsule text-white text-base leading-none"></i>
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-display text-xl font-700 text-gray-900 tracking-tight">
                  Medi<span className="text-brand-500">Cart</span>
                </span>
                <p className="text-[10px] text-gray-400 font-500 mt-0.5">Your Health, Delivered</p>
              </div>
            </a>

            {/* Location pill */}
            <div className="relative flex-shrink-0" ref={locRef}>
              <button
                onClick={() => setLocOpen(!locOpen)}
                className="hidden lg:flex items-center gap-2 border border-gray-200 hover:border-brand-300 bg-gray-50 hover:bg-brand-50 rounded-full pl-3 pr-3 py-2 transition-all duration-200 group min-w-[148px] max-w-[200px]"
              >
                <LocationIcon />
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <p className="text-[9px] text-gray-400 leading-none font-600 uppercase tracking-wider">Deliver to</p>
                  <p className={`text-xs font-700 truncate mt-0.5 transition-colors ${
                    isLoading ? 'text-gray-400' : locState.status === 'denied' ? 'text-red-500' : 'text-gray-700 group-hover:text-brand-600'
                  }`}>
                    {locLabel()}
                  </p>
                </div>
                <i className={`bi bi-chevron-down text-[10px] text-gray-400 flex-shrink-0 transition-transform duration-200 ${locOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Location dropdown */}
              {locOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 anim-scale-in">

                  {/* current detected */}
                  <div className="p-4 border-b border-gray-50">
                    <p className="text-[10px] text-gray-400 font-700 uppercase tracking-wider mb-2.5">Current Location</p>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      locState.status === 'success' && locState.source === 'gps'
                        ? 'bg-brand-50 border-brand-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isLoading ? 'bg-gray-100' : locState.status === 'denied' ? 'bg-red-50' : 'bg-brand-100'
                      }`}>
                        {isLoading
                          ? <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></span>
                          : locState.status === 'denied'
                            ? <i className="bi bi-geo-alt-fill text-red-400 text-base"></i>
                            : <i className="bi bi-geo-alt-fill text-brand-600 text-base"></i>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        {locState.status === 'requesting' && (
                          <p className="text-sm font-600 text-gray-500">Waiting for permission...</p>
                        )}
                        {locState.status === 'locating' && (
                          <p className="text-sm font-600 text-gray-500">Getting your location...</p>
                        )}
                        {locState.status === 'denied' && (
                          <>
                            <p className="text-sm font-700 text-red-600">Location access denied</p>
                            <p className="text-xs text-gray-400 mt-0.5">Enable in browser settings</p>
                          </>
                        )}
                        {locState.status === 'success' && (
                          <>
                            <p className="text-sm font-700 text-gray-900 truncate">{locState.text}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                              {locState.source === 'gps'
                                ? <><i className="bi bi-reception-4 text-brand-500"></i> GPS accurate</>
                                : <><i className="bi bi-wifi text-blue-400"></i> Based on network</>
                              }
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Use my exact location button */}
                    <button
                      onClick={askGPS}
                      disabled={isLoading}
                      className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-700 border-2 transition-all duration-200 ${
                        isLoading
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'border-brand-400 text-brand-600 hover:bg-brand-50 active:scale-[0.98]'
                      }`}
                    >
                      {isLoading
                        ? <><span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span> Detecting...</>
                        : <><i className="bi bi-crosshair2 text-base"></i> Use my exact location</>
                      }
                    </button>
                  </div>

                  {/* manual entry */}
                  <div className="p-4">
                    <p className="text-[10px] text-gray-400 font-700 uppercase tracking-wider mb-2.5">Enter Manually</p>
                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                      <input
                        value={manualPin}
                        onChange={e => setManualPin(e.target.value)}
                        placeholder="Pincode or city name"
                        maxLength={20}
                        className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand-400 font-500 placeholder-gray-400 transition-colors"
                      />
                      <button
                        type="submit"
                        className="btn-primary text-sm px-4 py-2"
                        style={{ borderRadius: '12px' }}
                      >
                        Set
                      </button>
                    </form>
                    <p className="text-[10px] text-gray-300 mt-2.5 text-center">
                      Location helps show delivery availability
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Search bar — slides in after hero */}
            <div
              className="flex-1 mx-2 md:mx-4 overflow-hidden"
              style={{
                maxHeight:     showNavSearch ? '52px'       : '0px',
                opacity:       showNavSearch ? 1            : 0,
                transform:     showNavSearch ? 'translateY(0)' : 'translateY(-8px)',
                transition:    'max-height 0.38s ease, opacity 0.30s ease, transform 0.30s ease',
                pointerEvents: showNavSearch ? 'auto'       : 'none',
              }}
            >
              <div className={`flex items-center rounded-2xl border-2 transition-all duration-300 ${
                searchFocus
                  ? 'border-brand-400 bg-white shadow-lg shadow-brand-100/60'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}>
                <i className={`bi bi-search mx-3.5 text-sm flex-shrink-0 transition-colors ${searchFocus ? 'text-brand-500' : 'text-gray-400'}`}></i>
                <input
                  type="text"
                  placeholder="Search medicines, health products..."
                  className="flex-1 py-3 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 font-500 min-w-0"
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                />
                <button className="hidden sm:flex items-center gap-1.5 m-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-700 px-3.5 py-2 rounded-xl transition-colors flex-shrink-0">
                  <i className="bi bi-search text-xs"></i> Search
                </button>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button className="hidden md:flex flex-col items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors relative text-gray-500">
                <i className="bi bi-bell text-lg"></i>
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              <button className="hidden md:flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                  <i className="bi bi-person-fill text-brand-700 text-sm"></i>
                </div>
                <span className="text-[10px] font-600 text-gray-400">Login</span>
              </button>
              <button className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors">
                <i className="bi bi-cart3 text-xl text-gray-700"></i>
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-500 text-white text-[10px] font-700 rounded-full flex items-center justify-center px-0.5">3</span>
              </button>
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} text-xl text-gray-700`}></i>
              </button>
            </div>
          </div>

          {/* Category pills */}
          <nav className="hidden md:flex items-center gap-1 pb-2.5 overflow-x-auto no-scrollbar">
            {cats.map((c, i) => (
              <button key={i} className={`flex-shrink-0 text-xs font-700 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                i === 0 ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:bg-brand-50 hover:text-brand-600'
              }`}>{c}</button>
            ))}
          </nav>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 anim-fade-in">
            <button
              onClick={askGPS}
              className="w-full flex items-center gap-2.5 bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-left"
            >
              {isLoading
                ? <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></span>
                : <i className="bi bi-geo-alt-fill text-brand-500 text-sm flex-shrink-0"></i>
              }
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-600 uppercase">Deliver to</p>
                <p className="text-sm font-700 text-gray-800 truncate">{locLabel()}</p>
              </div>
              <span className="text-xs text-brand-600 font-700 flex-shrink-0">Change</span>
            </button>
            <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-brand-400 transition-colors">
              <i className="bi bi-search text-gray-400 mr-2.5 text-sm"></i>
              <input placeholder="Search medicines..." className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 font-500" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {cats.slice(1).map((c, i) => (
                <button key={i} className="text-xs font-600 text-gray-700 bg-gray-50 rounded-xl py-2.5 hover:bg-brand-50 hover:text-brand-600 transition-colors">{c}</button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 btn-primary justify-center text-sm py-2.5">Login / Sign Up</button>
              <button className="flex-1 border-2 border-brand-400 text-brand-600 font-700 text-sm py-2.5 rounded-full flex items-center justify-center gap-1.5 hover:bg-brand-50 transition-colors">
                <i className="bi bi-upload"></i> Upload Rx
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}