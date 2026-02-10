import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface AgentNodeProps {
  icon: LucideIcon
  label: string
  color?: string
  delay?: number
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function AgentNode({
  icon: Icon,
  label,
  color = '#C5A55A',
  delay = 0,
  active = true,
  size = 'md',
}: AgentNodeProps) {
  const sizes = {
    sm: { box: 'w-14 h-14', icon: 16, text: 'text-[10px]' },
    md: { box: 'w-18 h-18', icon: 22, text: 'text-xs' },
    lg: { box: 'w-22 h-22', icon: 28, text: 'text-sm' },
  }
  const s = sizes[size]

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
    >
      <div className="relative">
        {active && (
          <motion.div
            className={`absolute inset-0 rounded-full ${s.box}`}
            style={{ backgroundColor: color }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
          />
        )}
        <div
          className={`${s.box} rounded-full flex items-center justify-center border-2 relative z-10`}
          style={{
            borderColor: color,
            backgroundColor: `${color}15`,
            boxShadow: active ? `0 0 20px ${color}40` : 'none',
          }}
        >
          <Icon size={s.icon} style={{ color }} />
        </div>
      </div>
      <span
        className={`${s.text} font-medium text-center max-w-20`}
        style={{ color: 'var(--color-warm-gray)' }}
      >
        {label}
      </span>
    </motion.div>
  )
}
