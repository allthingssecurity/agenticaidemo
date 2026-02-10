import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCases } from '../data/useCases'

const shortLabels = [
  'Investment',
  'Urban Planning',
  'Sustainability',
  'Tourism',
  'Heritage',
  'Investor Relations',
  'Economic Impact',
]

interface NavbarProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export default function Navbar({ activeIndex, onSelect }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const uc = useCases[activeIndex]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/12 border border-gold/25 flex items-center justify-center">
            <span className="font-display font-bold text-gold text-sm">S</span>
          </div>
          <span className="font-display font-semibold text-warm-white text-sm">
            Shurooq AI
          </span>
        </a>

        {/* Use case selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-warm-white hover:border-white/20 transition-colors"
          >
            <span className="font-medium" style={{ color: uc.color }}>{uc.number}</span>
            <span className="hidden sm:inline">{shortLabels[activeIndex]}</span>
            <span className="sm:hidden">{shortLabels[activeIndex].split(' ')[0]}</span>
            <ChevronDown size={14} className="text-warm-gray" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-midnight shadow-2xl overflow-hidden">
              {useCases.map((u, i) => (
                <button
                  key={u.id}
                  onClick={() => { onSelect(i); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/[0.04]"
                  style={{
                    backgroundColor: i === activeIndex ? `${u.color}10` : undefined,
                  }}
                >
                  <span className="font-medium w-5" style={{ color: u.color }}>{u.number}</span>
                  <span className={i === activeIndex ? 'text-warm-white' : 'text-warm-gray'}>
                    {shortLabels[i]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
