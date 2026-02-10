import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

export default function Footer() {
  const { ref, isInView } = useInView(0.3)

  return (
    <footer ref={ref} className="relative py-16 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-gold text-xl">S</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-warm-white mb-2">
            Shurooq Agentic AI
          </h3>
          <p className="text-warm-gray text-sm max-w-md mx-auto mb-6">
            Sharjah Investment and Development Authority — Pioneering intelligent
            governance through multi-agent AI systems.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-warm-gray/60">
            <span>Concept Demo</span>
            <span className="w-1 h-1 rounded-full bg-gold/30" />
            <span>Animated Prototypes</span>
            <span className="w-1 h-1 rounded-full bg-gold/30" />
            <span>&copy; {new Date().getFullYear()} Shurooq</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
