import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ToolMessage {
  direction: 'request' | 'response'
  tool: string
  params?: Record<string, unknown>
  result?: Record<string, unknown>
  latency?: string
}

interface MCPToolCallProps {
  messages: ToolMessage[]
  isInView: boolean
  startDelay?: number
  messageInterval?: number
  accentColor?: string
}

function JsonHighlight({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data)
  return (
    <span>
      {'{'}
      {entries.map(([key, val], i) => (
        <span key={key}>
          <span className="text-teal-light">&quot;{key}&quot;</span>
          <span className="text-warm-gray/80">: </span>
          <span className={typeof val === 'number' ? 'text-gold' : 'text-green-400'}>
            {typeof val === 'string' ? `"${val}"` : String(val)}
          </span>
          {i < entries.length - 1 && <span className="text-warm-gray/80">, </span>}
        </span>
      ))}
      {'}'}
    </span>
  )
}

export default function MCPToolCall({
  messages,
  isInView,
  startDelay = 500,
  messageInterval = 1200,
  accentColor = '#22B8A6',
}: MCPToolCallProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timers: ReturnType<typeof setTimeout>[] = []

    messages.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(i + 1), startDelay + i * messageInterval)
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [isInView, messages, startDelay, messageInterval])

  return (
    <div className="rounded-xl border border-white/8 bg-midnight/80 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <span className="text-xs text-warm-gray">MCP Protocol</span>
        <div
          className="ml-auto w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="p-4 space-y-3 font-mono text-xs">
        <AnimatePresence>
          {messages.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.direction === 'request' ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2">
                <motion.span
                  className={`text-sm font-bold ${
                    msg.direction === 'request' ? 'text-teal-light' : 'text-gold'
                  }`}
                  animate={msg.direction === 'request' ? { x: [0, 3, 0] } : { x: [0, -3, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {msg.direction === 'request' ? '\u2192' : '\u2190'}
                </motion.span>
                <span className="text-warm-gray/80">
                  {msg.direction === 'request' ? 'tool_use' : 'tool_result'}:
                </span>
                <span className="text-teal-light font-semibold">{msg.tool}</span>
                {msg.latency && (
                  <span className="ml-auto text-[11px] text-warm-gray/60 tabular-nums">
                    {msg.latency}
                  </span>
                )}
              </div>
              <div className="ml-6 text-warm-white/80 break-all leading-relaxed">
                {msg.direction === 'request' && msg.params && (
                  <JsonHighlight data={msg.params} />
                )}
                {msg.direction === 'response' && msg.result && (
                  <JsonHighlight data={msg.result} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
