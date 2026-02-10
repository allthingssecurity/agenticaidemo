import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bot } from 'lucide-react'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  /** ms from start of demo before this message appears */
  delay: number
}

interface ChatSimulationProps {
  messages: ChatMessage[]
  isActive: boolean
  accentColor: string
  title?: string
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex gap-1.5 items-center px-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: `${color}80` }}
          animate={{ y: [0, -4, 0] }}
          transition={{ delay: i * 0.15, duration: 0.5, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

export default function ChatSimulation({
  messages,
  isActive,
  accentColor,
  title = 'Shurooq AI Agent',
}: ChatSimulationProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) {
      setVisibleCount(0)
      setShowTyping(false)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    messages.forEach((msg, i) => {
      if (msg.role === 'assistant') {
        timers.push(
          setTimeout(() => setShowTyping(true), Math.max(0, msg.delay - 1200))
        )
        timers.push(
          setTimeout(() => {
            setShowTyping(false)
            setVisibleCount(i + 1)
          }, msg.delay)
        )
      } else {
        timers.push(
          setTimeout(() => {
            setShowTyping(false)
            setVisibleCount(i + 1)
          }, msg.delay)
        )
      }
    })

    return () => timers.forEach(clearTimeout)
  }, [isActive, messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleCount, showTyping])

  return (
    <div className="rounded-xl border border-white/10 bg-midnight/80 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02] shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: `${accentColor}80` }}
          />
        </div>
        <span className="text-xs text-warm-gray ml-1 truncate">{title}</span>
        {showTyping && (
          <motion.div
            className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px]"
      >
        <AnimatePresence>
          {messages.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    borderColor: `${accentColor}35`,
                  }}
                >
                  <Bot size={14} style={{ color: accentColor }} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal/12 text-warm-white border border-teal/15'
                    : 'border text-warm-white/90'
                }`}
                style={
                  msg.role === 'assistant'
                    ? {
                        backgroundColor: `${accentColor}0A`,
                        borderColor: `${accentColor}18`,
                      }
                    : undefined
                }
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-teal/15 border border-teal/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={14} className="text-teal-light" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {showTyping && (
          <motion.div
            className="flex gap-2.5 justify-start"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}35`,
              }}
            >
              <Bot size={14} style={{ color: accentColor }} />
            </div>
            <div
              className="rounded-xl px-3.5 py-2.5 border"
              style={{
                backgroundColor: `${accentColor}06`,
                borderColor: `${accentColor}12`,
              }}
            >
              <TypingIndicator color={accentColor} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
