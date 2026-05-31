import React from 'react'

const footerLinks = {
  'Company':    ['About Us', 'Careers', 'Press', 'Blog', 'Contact Us'],
  'Services':   ['Medicines', 'Lab Tests', 'Doctor Consultation', 'Health Records', 'Subscription'],
  'Help':       ['FAQs', 'Track Order', 'Return Policy', 'Privacy Policy', 'Terms of Service'],
  'Categories': ['Pain Relief', 'Diabetes', 'Heart Care', 'Skincare', 'Baby Care'],
}

const socialIcons = ['bi-facebook','bi-twitter-x','bi-instagram','bi-youtube']

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-800">Stay Healthy, Stay Updated</h3>
              <p className="text-white/45 text-sm mt-1">Get health tips, offers & medicine reminders in your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 md:w-72 bg-white/8 border border-white/15 rounded-full px-5 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-brand-400 transition-colors"
              />
              <button className="btn-primary flex-shrink-0 px-6 py-3">
                Subscribe <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <i className="bi bi-capsule text-white text-lg"></i>
              </div>
              <span className="font-display font-800 text-2xl tracking-tight">Medi<span className="text-brand-400">Cart</span></span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              India's most trusted online pharmacy. Genuine medicines, fast delivery, expert care.
            </p>
            <div className="space-y-2.5">
              {[
                { icon:'bi-geo-alt-fill', text:'123 Health Plaza, Varanasi, UP 221001' },
                { icon:'bi-telephone-fill', text:'1800-000-0000 (Toll Free)' },
                { icon:'bi-envelope-fill', text:'support@medicart.in' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-white/50 text-sm">
                  <i className={`bi ${item.icon} text-brand-400 text-xs flex-shrink-0`}></i>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 mt-6">
              {socialIcons.map((icon, i) => (
                <button key={i} className="w-9 h-9 bg-white/8 hover:bg-brand-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10">
                  <i className={`bi ${icon} text-sm`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-700 text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-white/45 text-sm hover:text-brand-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">© 2025 MediCart. All rights reserved. Licensed Pharmacy.</p>
          <div className="flex items-center gap-2">
            {['Razorpay','UPI','Cards','Net Banking','COD'].map((p, i) => (
              <span key={i} className="text-[11px] bg-white/8 border border-white/10 text-white/45 px-2.5 py-1 rounded-lg font-600">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}