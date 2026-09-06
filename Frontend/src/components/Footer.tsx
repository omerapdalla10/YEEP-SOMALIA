import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Share2, Image, MessageCircle, Briefcase, Globe, Mail, MapPin, Heart, Check } from 'lucide-react'
import { api } from '../lib/api'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || busy) return
    setBusy(true)
    try {
      await api.post('/newsletter', { email, source: 'footer' })
      setDone(true)
      setEmail('')
    } catch {
      /* keep it quiet in the footer */
    } finally {
      setBusy(false)
    }
  }

  return (
    <footer className="bg-[#0d1f1e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <div>
                <div className="font-bold text-xl text-white">YEEP Somalia</div>
                <div className="text-[10px] text-gray-400 tracking-wide">Youth Engagement & Empowerment Programme</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              A youth-led NGO advancing Youth, Peace and Security, youth leadership, civic engagement, and community resilience across Somalia. Engage. Empower. Transform.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Share2, href: 'https://www.facebook.com/profile.php?id=61565617627973', label: 'Facebook' },
                { icon: Image, href: 'https://instagram.com/yeepsomalia', label: 'Instagram' },
                { icon: MessageCircle, href: 'https://x.com/yeepsomalia', label: 'X (Twitter)' },
                { icon: Briefcase, href: 'https://www.linkedin.com/search/results/all/?keywords=YEEP%20Somalia', label: 'LinkedIn' },
                { icon: Globe, href: 'https://yeep.org.so', label: 'Website' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#0f766e] flex items-center justify-center transition-colors group"
                >
                  <Icon size={15} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Programs', href: '/programs' },
                { label: 'Projects', href: '/projects' },
                { label: 'Events', href: '/events' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'News & Blog', href: '/news' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-[#34d399] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Volunteer With Us', href: '/volunteer' },
                { label: 'Partner With Us', href: '/contact' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-[#34d399] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#0f766e] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Mogadishu, Somalia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#0f766e] shrink-0" />
                <a href="mailto:yeepsomalia@gmail.com" className="text-sm text-gray-400 hover:text-[#34d399] transition-colors">yeepsomalia@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={15} className="text-[#0f766e] shrink-0" />
                <a href="https://yeep.org.so" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#34d399] transition-colors">yeep.org.so</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-2">Newsletter</p>
              {done ? (
                <p className="text-xs text-[#34d399] flex items-center gap-1.5">
                  <Check size={13} /> Thanks for subscribing!
                </p>
              ) : (
                <form className="flex gap-2" onSubmit={subscribe}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0f766e]"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="px-3 py-2 bg-[#0f766e] hover:bg-[#0d9488] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-70"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2026 YEEP Somalia — Youth Engagement and Empowerment Programme. All rights reserved.</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart size={11} className="text-[#f59e0b]" /> by young Somalis
          </p>
        </div>
      </div>
    </footer>
  )
}
