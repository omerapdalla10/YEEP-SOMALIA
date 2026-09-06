import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Our Work',
    children: [
      { label: 'Programs', href: '/programs' },
      { label: 'Projects', href: '/projects' },
      { label: 'Events', href: '/events' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News', href: '/news' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const location = useLocation()
  const { user } = useAuth()
  const dashboardHref = user && user.role !== 'volunteer' ? '/admin' : '/dashboard'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
    setDropdown(null)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-md group-hover:bg-[#0d9488] transition-colors">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <div>
              <div className="font-bold text-xl text-[#0f766e] leading-none">YEEP Somalia</div>
              <div className="text-[10px] text-gray-500 leading-none tracking-wide">Engage · Empower · Transform</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0f766e] transition-colors rounded-lg hover:bg-teal-50">
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#0f766e] hover:bg-teal-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href!}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? 'text-[#0f766e] bg-teal-50'
                      : 'text-gray-700 hover:text-[#0f766e] hover:bg-teal-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                to={dashboardHref}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0f766e] hover:bg-[#0d9488] rounded-xl transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#0f766e] transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-[#0f766e] hover:bg-teal-50 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{link.label}</div>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:text-[#0f766e] hover:bg-teal-50 rounded-lg transition-colors ml-2"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href!}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href ? 'text-[#0f766e] bg-teal-50' : 'text-gray-700 hover:text-[#0f766e] hover:bg-teal-50'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <Link to={dashboardHref} className="block text-center py-2 text-sm font-semibold text-white bg-[#0f766e] rounded-xl hover:bg-[#0d9488] transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="block text-center py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-[#0f766e] hover:text-[#0f766e] transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
