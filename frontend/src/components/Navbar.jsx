// Updated Navbar component with location integration
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../hooks/useLocation';
import LocationDropdown from '../components/LocationDropdown';

export default function Navbar({ searchVisible = true }) {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const { location, isLoading, fetchLocation, locationDisplay } = useLocation();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  
  const userMenuRef = useRef(null);
  const locRef = useRef(null);
  
  const cats = ['All', 'Medicines', 'Vitamins', 'Skincare', 'Diabetes', 'Baby Care', 'COVID', 'Ayurveda', 'Lab Tests'];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Outside click handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshLocation = () => {
    fetchLocation(true);
  };

  const getLocationDisplayText = () => {
    if (isLoading) return 'Fetching location...';
    if (location.status === 'denied') return 'Enable location access';
    if (location.status === 'unavailable') return 'Location unavailable';
    if (location.status === 'success') {
      if (locationDisplay) return locationDisplay;
      if (location.city) return location.city;
      return 'Location detected';
    }
    return 'Set delivery location';
  };

  const getLocationIcon = () => {
    if (isLoading) {
      return <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>;
    }
    if (location.status === 'denied') {
      return <i className="bi bi-geo-alt-slash text-red-400 text-xs flex-shrink-0"></i>;
    }
    if (location.status === 'unavailable') {
      return <i className="bi bi-wifi-off text-yellow-500 text-xs flex-shrink-0"></i>;
    }
    return <i className="bi bi-geo-alt-fill text-brand-500 text-xs flex-shrink-0"></i>;
  };

  const showNavSearch = !searchVisible;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-700 text-white text-xs py-1.5 text-center hidden md:block font-600 tracking-wide">
        Free delivery on orders above ₹499 &nbsp;·&nbsp; 24/7 Support: 1800-000-0000 &nbsp;·&nbsp; 100% Genuine Medicines
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
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

            {/* Location Selector */}
            <div className="relative flex-shrink-0" ref={locRef}>
              <button
                onClick={() => setLocOpen(!locOpen)}
                className="hidden lg:flex items-center gap-2 border border-gray-200 hover:border-brand-300 bg-gray-50 hover:bg-brand-50 rounded-full pl-3 pr-3 py-2 transition-all duration-200 group min-w-[160px] max-w-[220px]"
              >
                {getLocationIcon()}
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <p className="text-[9px] text-gray-400 leading-none font-600 uppercase tracking-wider">Deliver to</p>
                  <p className={`text-xs font-700 truncate mt-0.5 transition-colors ${
                    isLoading ? 'text-gray-400' : 
                    location.status === 'denied' ? 'text-red-500' :
                    location.status === 'unavailable' ? 'text-yellow-600' :
                    'text-gray-700 group-hover:text-brand-600'
                  }`}>
                    {getLocationDisplayText()}
                  </p>
                </div>
                <i className={`bi bi-chevron-down text-[10px] text-gray-400 flex-shrink-0 transition-transform duration-200 ${locOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Location Dropdown */}
              {locOpen && (
                <LocationDropdown
                  location={location}
                  isLoading={isLoading}
                  onRefresh={handleRefreshLocation}
                  onClose={() => setLocOpen(false)}
                />
              )}
            </div>

            {/* Search Bar */}
            <div
              className="flex-1 mx-2 md:mx-4 overflow-hidden"
              style={{
                maxHeight: showNavSearch ? '52px' : '0px',
                opacity: showNavSearch ? 1 : 0,
                transform: showNavSearch ? 'translateY(0)' : 'translateY(-8px)',
                transition: 'max-height 0.38s ease, opacity 0.30s ease, transform 0.30s ease',
                pointerEvents: showNavSearch ? 'auto' : 'none',
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

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button className="hidden md:flex flex-col items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors relative text-gray-500">
                <i className="bi bi-bell text-lg"></i>
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              
              {isLoggedIn ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                      <span className="text-white text-xs font-700">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-xs font-600 text-gray-700 max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <i className={`bi bi-chevron-down text-[10px] text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-700 text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { icon: 'bi-person', label: 'My Profile', path: '/profile' },
                        { icon: 'bi-bag', label: 'My Orders', path: '/orders' },
                        { icon: 'bi-file-medical', label: 'Prescriptions', path: '/prescriptions' },
                      ].map((item, i) => (
                        <button key={i} onClick={() => { navigate(item.path); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                          <i className={`bi ${item.icon} text-gray-400 text-sm`}></i>
                          <span className="text-sm font-500 text-gray-700">{item.label}</span>
                        </button>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
                          <i className="bi bi-box-arrow-right text-red-400 text-sm"></i>
                          <span className="text-sm font-500 text-red-500">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                    <i className="bi bi-person-fill text-brand-700 text-sm"></i>
                  </div>
                  <span className="text-[10px] font-600 text-gray-400">Login</span>
                </Link>
              )}
              
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

          {/* Category Pills */}
          <nav className="hidden md:flex items-center gap-1 pb-2.5 overflow-x-auto no-scrollbar">
            {cats.map((c, i) => (
              <button key={i} className={`flex-shrink-0 text-xs font-700 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                i === 0 ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:bg-brand-50 hover:text-brand-600'
              }`}>{c}</button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <button
              onClick={() => {
                setLocOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-left"
            >
              {getLocationIcon()}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-600 uppercase">Deliver to</p>
                <p className="text-sm font-700 text-gray-800 truncate">{getLocationDisplayText()}</p>
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
              {isLoggedIn ? (
                <button onClick={() => { logout(); setMenuOpen(false) }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 border border-red-200 text-red-600 font-700 text-sm rounded-full">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 bg-brand-500 text-white font-700 text-sm py-2.5 rounded-full text-center hover:bg-brand-600 transition-colors">
                  Login / Sign Up
                </Link>
              )}
              <button className="flex-1 border-2 border-brand-400 text-brand-600 font-700 text-sm py-2.5 rounded-full flex items-center justify-center gap-1.5 hover:bg-brand-50 transition-colors">
                <i className="bi bi-upload"></i> Upload Rx
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}