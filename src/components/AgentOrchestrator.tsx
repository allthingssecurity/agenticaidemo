import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AgentDef {
  id: string
  label: string
  role?: string
  color?: string
}

export interface AgentMessage {
  from: string
  to: string
  label: string
  delay: number
}

interface AgentOrchestratorProps {
  supervisor: AgentDef
  workers: AgentDef[]
  messages: AgentMessage[]
  isInView: boolean
  startDelay?: number
  accentColor?: string
}

type AgentStatus = 'idle' | 'thinking' | 'executing' | 'done'

export default function AgentOrchestrator({
  supervisor,
  workers,
  messages,
  isInView,
  startDelay = 600,
  accentColor = '#22B8A6',
}: AgentOrchestratorProps) {
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({})
  const [activeMessages, setActiveMessages] = useState<number[]>([])
  const [completedMessages, setCompletedMessages] = useState<number[]>([])

  useEffect(() => {
    if (!isInView) return
    const timers: ReturnType<typeof setTimeout>[] = []

    const statuses: Record<string, AgentStatus> = { [supervisor.id]: 'idle' }
    workers.forEach((w) => (statuses[w.id] = 'idle'))
    setAgentStatuses(statuses)

    messages.forEach((msg, i) => {
      const baseDelay = startDelay + msg.delay

      timers.push(
        setTimeout(() => {
          setActiveMessages((prev) => [...prev, i])
          setAgentStatuses((prev) => ({
            ...prev,
            [msg.from]: 'executing',
            [msg.to]: 'thinking',
          }))
        }, baseDelay)
      )

      timers.push(
        setTimeout(() => {
          setActiveMessages((prev) => prev.filter((x) => x !== i))
          setCompletedMessages((prev) => [...prev, i])
          setAgentStatuses((prev) => ({
            ...prev,
            [msg.from]: 'done',
            [msg.to]: 'executing',
          }))
        }, baseDelay + 800)
      )
    })

    const lastDelay = Math.max(...messages.map((m) => m.delay)) + startDelay + 1600
    timers.push(
      setTimeout(() => {
        setAgentStatuses((prev) => {
          const next = { ...prev }
          Object.keys(next).forEach((k) => (next[k] = 'done'))
          return next
        })
      }, lastDelay)
    )

    return () => timers.forEach(clearTimeout)
  }, [isInView, supervisor, workers, messages, startDelay])

  const statusColors: Record<AgentStatus, string> = {
    idle: '#B8B0A4',
    thinking: '#C5A55A',
    executing: accentColor,
    done: '#22C55E',
  }

  const totalWorkers = workers.length
  const spacing = 100 / (totalWorkers + 1)

  return (
    <div className="rounded-xl border border-white/8 bg-midnight/80 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <span className="text-xs text-warm-gray">Agent Orchestration</span>
      </div>

      <div className="relative p-5" style={{ height: 220 }}>
        {/* Supervisor */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-3 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{
                borderColor: statusColors[agentStatuses[supervisor.id] || 'idle'],
                backgroundColor: `${supervisor.color || accentColor}15`,
                color: supervisor.color || accentColor,
              }}
            >
              S
            </div>
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-midnight"
              style={{
                backgroundColor: statusColors[agentStatuses[supervisor.id] || 'idle'],
              }}
              animate={
                agentStatuses[supervisor.id] === 'thinking'
                  ? { scale: [1, 1.4, 1] }
                  : {}
              }
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
          <span className="text-xs text-warm-white mt-1.5 font-medium">
            {supervisor.label}
          </span>
          {supervisor.role && (
            <span className="text-[11px] text-warm-gray/70">{supervisor.role}</span>
          )}
        </motion.div>

        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {workers.map((_, wi) => {
            const x2Pct = spacing * (wi + 1)
            return (
              <motion.line
                key={wi}
                x1="50%"
                y1="65"
                x2={`${x2Pct}%`}
                y2="150"
                stroke={accentColor}
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity={0}
                animate={isInView ? { opacity: 0.2 } : {}}
                transition={{ delay: 0.5 + wi * 0.1 }}
              />
            )
          })}
        </svg>

        {/* Message dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {activeMessages.map((msgIdx) => {
              const msg = messages[msgIdx]
              const fromIsSupervisor = msg.from === supervisor.id
              const toWorkerIdx = workers.findIndex((w) => w.id === msg.to)
              const fromWorkerIdx = workers.findIndex((w) => w.id === msg.from)

              const x1 = fromIsSupervisor ? 50 : spacing * (fromWorkerIdx + 1)
              const y1 = fromIsSupervisor ? 65 : 150
              const x2 = msg.to === supervisor.id ? 50 : spacing * (toWorkerIdx + 1)
              const y2 = msg.to === supervisor.id ? 65 : 150

              return (
                <motion.circle
                  key={msgIdx}
                  r="3.5"
                  fill={accentColor}
                  initial={{ cx: `${x1}%`, cy: y1, opacity: 0 }}
                  animate={{ cx: `${x2}%`, cy: y2, opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                />
              )
            })}
          </AnimatePresence>
        </svg>

        {/* Workers */}
        {workers.map((worker, wi) => (
          <motion.div
            key={worker.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${spacing * (wi + 1)}%`,
              bottom: 12,
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', delay: 0.4 + wi * 0.15 }}
          >
            <div className="relative">
              <div
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
                style={{
                  borderColor: statusColors[agentStatuses[worker.id] || 'idle'],
                  backgroundColor: `${worker.color || accentColor}15`,
                  color: worker.color || accentColor,
                }}
              >
                {worker.label.charAt(0)}
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-midnight"
                style={{
                  backgroundColor: statusColors[agentStatuses[worker.id] || 'idle'],
                }}
                animate={
                  agentStatuses[worker.id] === 'thinking'
                    ? { scale: [1, 1.4, 1] }
                    : {}
                }
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </div>
            <span className="text-[11px] text-warm-white mt-1.5 font-medium text-center leading-tight max-w-[72px]">
              {worker.label}
            </span>
            {worker.role && (
              <span className="text-[10px] text-warm-gray/70 text-center">
                {worker.role}
              </span>
            )}
          </motion.div>
        ))}

        {/* Message labels */}
        <AnimatePresence>
          {completedMessages.slice(-2).map((msgIdx) => {
            const msg = messages[msgIdx]
            const toWorkerIdx = workers.findIndex((w) => w.id === msg.to)
            const xPct = msg.to === supervisor.id ? 50 : spacing * (toWorkerIdx + 1)

            return (
              <motion.div
                key={`label-${msgIdx}`}
                className="absolute text-[10px] text-warm-gray/80 whitespace-nowrap bg-midnight/90 px-2 py-0.5 rounded"
                style={{
                  left: `${(50 + xPct) / 2}%`,
                  top: 100,
                  transform: 'translateX(-50%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.label}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Status legend */}
      <div className="flex gap-4 px-4 py-2 border-t border-white/5 justify-center">
        {(['idle', 'thinking', 'executing', 'done'] as AgentStatus[]).map(
          (status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
              />
              <span className="text-[11px] text-warm-gray/70 capitalize">
                {status}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
