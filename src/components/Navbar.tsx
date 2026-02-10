import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useCases } from '../data/useCases'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = useCases.map((uc) => document.getElementById(uc.id))
      const scrollPos = window.scrollY + 200
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setActive(useCases[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-midnight/90 backdrop-blur-md border-b border-gold/10'
          : 'bg-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center">
            <span className="font-display font-bold text-gold text-sm">S</span>
          </div>
          <span className="font-display font-semibold text-warm-white text-lg hidden sm:block">
            Shurooq AI
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {useCases.map((uc) => (
            <a
              key={uc.id}
              href={`#${uc.id}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active === uc.id
                  ? 'bg-gold/15 text-gold'
                  : 'text-warm-gray hover:text-warm-white'
              }`}
            >
              {uc.number}. {uc.title.split(' ')[0]}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-warm-gray"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          className="lg:hidden bg-midnight-light/95 backdrop-blur-md border-t border-gold/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {useCases.map((uc) => (
            <a
              key={uc.id}
              href={`#${uc.id}`}
              className="block px-6 py-3 text-sm text-warm-gray hover:text-gold transition-colors border-b border-white/5"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gold/50 mr-2">{uc.number}</span>
              {uc.title}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
