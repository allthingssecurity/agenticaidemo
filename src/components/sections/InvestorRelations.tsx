import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, TrendingUp, TrendingDown, Minus, Mail, BarChart2 } from 'lucide-react'
import SectionWrapper from '../SectionWrapper'
import { useCases } from '../../data/useCases'

const investors = [
  {
    name: 'Al Habtoor Group',
    sentiment: 85,
    trend: 'up' as const,
    lastContact: '3 days ago',
    avatar: 'AH',
  },
  {
    name: 'Mubadala Investment',
    sentiment: 72,
    trend: 'stable' as const,
    lastContact: '1 week ago',
    avatar: 'MI',
  },
  {
    name: 'ADIA Partners',
    sentiment: 58,
    trend: 'down' as const,
    lastContact: '2 weeks ago',
    avatar: 'AP',
  },
  {
    name: 'Dubai Holdings',
    sentiment: 90,
    trend: 'up' as const,
    lastContact: '1 day ago',
    avatar: 'DH',
  },
]

const emailLines = [
  'Dear Mr. Al Rashid,',
  '',
  'Following our productive meeting at the Sharjah Investment Forum,',
  'I wanted to share our latest portfolio performance report.',
  '',
  'Key highlights:',
  '- Q4 returns exceeded projections by 12%',
  '- New sustainable tourism initiative launched',
  '- Heritage district expansion on schedule',
  '',
  'Would you be available for a follow-up call this week?',
]

function SentimentGauge({ value, isInView }: { value: number; isInView: boolean }) {
  const color =
    value >= 80 ? '#22B8A6' : value >= 60 ? '#C5A55A' : '#ef4444'

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-midnight rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] font-mono" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

function Demo({ isInView }: { isInView: boolean }) {
  const [typedLines, setTypedLines] = useState(0)
  const [showCharts, setShowCharts] = useState(false)

  useEffect(() => {
    if (!isInView) return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Type email lines
    emailLines.forEach((_, i) => {
      timers.push(setTimeout(() => setTypedLines(i + 1), 2000 + i * 300))
    })

    timers.push(setTimeout(() => setShowCharts(true), 2000 + emailLines.length * 300 + 500))

    return () => timers.forEach(clearTimeout)
  }, [isInView])

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }

  return (
    <div className="space-y-5">
      {/* Investor cards */}
      <div className="grid grid-cols-2 gap-2">
        {investors.map((inv, i) => {
          const TrendIcon = trendIcons[inv.trend]
          return (
            <motion.div
              key={inv.name}
              className="p-3 rounded-xl border border-teal/10 bg-midnight/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-teal-light">
                    {inv.avatar}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-warm-white truncate">
                    {inv.name}
                  </div>
                  <div className="text-[8px] text-warm-gray">{inv.lastContact}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <SentimentGauge value={inv.sentiment} isInView={isInView} />
                <TrendIcon
                  size={12}
                  className={
                    inv.trend === 'up'
                      ? 'text-teal-light'
                      : inv.trend === 'down'
                      ? 'text-red-400'
                      : 'text-warm-gray'
                  }
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* AI composing email */}
      <div className="bg-midnight/50 rounded-xl border border-teal/10 overflow-hidden">
        <div className="px-3 py-2 border-b border-teal/10 flex items-center gap-2">
          <Mail size={12} className="text-teal-light" />
          <span className="text-[10px] text-warm-gray">
            AI Composing Outreach — ADIA Partners
          </span>
          <motion.div
            className="ml-auto w-1.5 h-1.5 rounded-full bg-teal"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        <div className="p-3 font-mono text-[10px] text-warm-gray/80 leading-relaxed min-h-[120px]">
          {emailLines.slice(0, typedLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={line === '' ? 'h-3' : ''}
            >
              {line}
            </motion.div>
          ))}
          {typedLines < emailLines.length && typedLines > 0 && (
            <motion.span
              className="inline-block w-1.5 h-3 bg-teal-light ml-0.5"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Engagement metrics */}
      {showCharts && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Open Rate', value: 78, color: '#1A8A7D' },
            { label: 'Reply Rate', value: 45, color: '#22B8A6' },
            { label: 'Meeting Set', value: 32, color: '#C5A55A' },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              className="text-center p-2 rounded-xl border border-white/5 bg-midnight/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <BarChart2 size={12} className="mx-auto mb-1" style={{ color: metric.color }} />
              <div className="text-sm font-bold" style={{ color: metric.color }}>
                {metric.value}%
              </div>
              <div className="text-[9px] text-warm-gray">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function InvestorRelations() {
  return (
    <SectionWrapper useCase={useCases[5]} reversed>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
