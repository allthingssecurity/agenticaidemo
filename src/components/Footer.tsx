export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-8">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <span className="font-display font-bold text-gold text-sm">S</span>
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-warm-white">
              Shurooq Agentic AI
            </div>
            <div className="text-xs text-warm-gray">
              Sharjah Investment & Development Authority
            </div>
          </div>
        </div>

        {/* Right: meta */}
        <div className="flex items-center gap-4 text-xs text-warm-gray">
          <span>Concept Demo</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>&copy; {new Date().getFullYear()} Shurooq</span>
        </div>
      </div>
    </footer>
  )
}
