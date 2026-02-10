import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface TraceStep {
  type: 'thinking' | 'tool_call' | 'observation' | 'decision' | 'error'
  agent?: string
  content: string
  delay?: number
}

interface AgentReasoningTraceProps {
  steps: TraceStep[]
  isInView: boolean
  stepInterval?: number
  startDelay?: number
  title?: string
  accentColor?: string
  maxHeight?: string
}

const typeConfig: Record<TraceStep['type'], { icon: string; label: string }> = {
  thinking: { icon: '\u{1F914}', label: 'Thinking' },
  tool_call: { icon: '\u{1F527}', label: 'Tool Call' },
  observation: { icon: '\u{1F4E5}', label: 'Result' },
  decision: { icon: '\u2705', label: 'Decision' },
  error: { icon: '\u{1F6A8}', label: 'Error' },
}

export default function AgentReasoningTrace({
  steps,
  isInView,
  stepInterval = 800,
  startDelay = 400,
  title = 'Agent Reasoning Trace',
  accentColor = '#22B8A6',
  maxHeight = '320px',
}: AgentReasoningTraceProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isInView) return
    const timers: ReturnType<typeof setTimeout>[] = []

    steps.forEach((step, i) => {
      const delay = step.delay ?? startDelay + i * stepInterval
      timers.push(setTimeout(() => setVisibleCount(i + 1), delay))
    })

    return () => timers.forEach(clearTimeout)
  }, [isInView, steps, stepInterval, startDelay])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleCount])

  return (
    <div className="rounded-xl border border-white/8 bg-midnight/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-xs text-warm-gray ml-1">{title}</span>
        {visibleCount < steps.length && visibleCount > 0 && (
          <motion.div
            className="ml-auto w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Steps */}
      <div
        ref={scrollRef}
        className="p-4 space-y-2 overflow-y-auto font-mono"
        style={{ maxHeight }}
      >
        <AnimatePresence>
          {steps.slice(0, visibleCount).map((step, i) => {
            const cfg = typeConfig[step.type]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 py-2 px-3 rounded-lg text-xs leading-relaxed ${
                  step.type === 'observation'
                    ? 'bg-white/[0.02] ml-6'
                    : step.type === 'decision'
                    ? 'bg-green-500/[0.05] border border-green-500/10'
                    : step.type === 'error'
                    ? 'bg-red-500/[0.05] border border-red-500/10'
                    : ''
                }`}
              >
                <span className="flex-shrink-0 text-sm">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    {step.agent && (
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: accentColor }}
                      >
                        {step.agent}
                      </span>
                    )}
                    <span className="text-[11px] text-warm-gray/70">
                      {cfg.label}
                    </span>
                  </div>
                  <span
                    className={
                      step.type === 'thinking'
                        ? 'italic text-gold-light/80'
                        : step.type === 'tool_call'
                        ? 'text-teal-light font-semibold'
                        : step.type === 'observation'
                        ? 'text-warm-gray/60'
                        : step.type === 'decision'
                        ? 'text-green-400'
                        : step.type === 'error'
                        ? 'text-red-400'
                        : 'text-warm-white/90'
                    }
                  >
                    {step.content}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {visibleCount > 0 && visibleCount < steps.length && (
          <motion.div
            className="flex items-center gap-1 py-1 px-3 text-warm-gray/25"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <span className="w-1.5 h-3.5 bg-current inline-block rounded-sm" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
