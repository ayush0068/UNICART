import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const NAV_ITEMS = [
  { to: '/admin/dashboard',  icon: 'bi-grid-fill',         label: 'Dashboard',    badge: null },
  { to: '/admin/medicines',  icon: 'bi-capsule-pill',      label: 'Medicines',    badge: null },
  { to: '/admin/add-medicine', icon: 'bi-plus-circle-fill', label: 'Add Medicine', badge: null },
  { to: '/admin/expiry',     icon: 'bi-calendar-x-fill',   label: 'Near Expiry',  badge: 'warn' },
  { to: '/admin/orders',     icon: 'bi-bag-check-fill',    label: 'Orders',       badge: null },
  { to: '/admin/users',      icon: 'bi-people-fill',       label: 'Users',        badge: null },
]

export default function AdminLayout({ children }) {
  const { admin, logout }       = useAdminAuth()
  const navigate                = useNavigate()
  const location                = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pageTitle, setPageTitle]   = useState('Dashboard')

  useEffect(() => {
    const match = NAV_ITEMS.find(n => location.pathname === n.to || location.pathname.startsWith(n.to + '/'))
    if (match) setPageTitle(match.label)
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/admin', { replace: true }) }

  const SideLink = ({ item }) => {
    const active = location.pathname === item.to ||
      (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to))

    return (
      <NavLink
        to={item.to}
        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 select-none"
        style={({ isActive }) => ({
          background: active ? 'rgba(20,181,116,0.15)' : 'transparent',
          color: active ? '#14b574' : 'rgba(255,255,255,0.45)',
        })}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
      >
        {/* Active bar */}
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-brand-500"></span>
        )}
        <i className={`bi ${item.icon} text-base flex-shrink-0 ${active ? 'text-brand-400' : ''}`}></i>
        {!collapsed && (
          <span className="text-sm font-600 truncate flex-1">{item.label}</span>
        )}
        {!collapsed && item.badge === 'warn' && (
          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>
        )}
        {/* Tooltip when collapsed */}
        {collapsed && (
          <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10">
            {item.label}
          </span>
        )}
      </NavLink>
    )
  }

  const sidebar = (
    <aside
      className="flex flex-col h-full flex-shrink-0 overflow-hidden transition-all duration-300"
      style={{
        width: collapsed ? '68px' : '220px',
        background: 'linear-gradient(180deg, #060d0a 0%, #081410 50%, #060d0a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#14b574,#0a9460)', boxShadow: '0 0 16px rgba(20,181,116,0.4)' }}>
              <i className="bi bi-capsule text-white text-sm"></i>
            </div>
            <span className="font-bold text-white text-base tracking-tight whitespace-nowrap">
              Medi<span style={{ color: '#14b574' }}>Cart</span>
              <span className="text-white/30 text-xs font-normal ml-1.5">Admin</span>
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg,#14b574,#0a9460)', boxShadow: '0 0 16px rgba(20,181,116,0.4)' }}>
            <i className="bi bi-capsule text-white text-sm"></i>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex w-6 h-6 rounded-lg items-center justify-center flex-shrink-0 transition-colors ml-1"
          style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-[10px]`}></i>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="text-[10px] font-700 uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Navigation
          </p>
        )}
        {NAV_ITEMS.map(item => <SideLink key={item.to} item={item} />)}
      </nav>

      {/* User / logout */}
      <div className="px-3 pb-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(20,181,116,0.2)', border: '1px solid rgba(20,181,116,0.3)' }}>
              <i className="bi bi-person-fill text-xs" style={{ color: '#14b574' }}></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-700 text-white truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{admin?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-600 transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
        >
          <i className="bi bi-box-arrow-right text-base flex-shrink-0"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0f0c' }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">{sidebar}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full" style={{ width: '220px' }}>{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-4 lg:px-6 py-4 flex-shrink-0"
          style={{ background: 'rgba(10,15,12,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
          >
            <i className="bi bi-list text-lg"></i>
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-700 text-white">{pageTitle}</h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              MediCart Admin Panel
            </p>
          </div>
          {/* Store link */}
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#14b574'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <i className="bi bi-box-arrow-up-right text-xs"></i>
            Store
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}