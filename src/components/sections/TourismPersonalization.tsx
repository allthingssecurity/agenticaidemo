import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bot, MapPin, Clock, Utensils } from 'lucide-react'
import SectionWrapper from '../SectionWrapper'
import { useCases } from '../../data/useCases'

interface Message {
  role: 'user' | 'bot'
  text: string
  delay: number
}

const conversation: Message[] = [
  {
    role: 'user',
    text: "I'm visiting Sharjah for 3 days with my family. We love art and local food!",
    delay: 0.5,
  },
  {
    role: 'bot',
    text: "Welcome! I've crafted a personalized itinerary for your family. Here are your highlights:",
    delay: 2,
  },
]

const itinerary = [
  {
    day: 'Day 1',
    items: [
      { icon: MapPin, text: 'Sharjah Art Museum — Guided family tour', time: '9:00 AM' },
      { icon: Utensils, text: 'Al Arsa Souk — Local cuisine experience', time: '12:30 PM' },
      { icon: MapPin, text: 'Heart of Sharjah — Heritage walk', time: '4:00 PM' },
    ],
  },
  {
    day: 'Day 2',
    items: [
      { icon: MapPin, text: 'Mleiha Archaeological Centre', time: '8:30 AM' },
      { icon: Utensils, text: 'Desert dining experience', time: '1:00 PM' },
      { icon: MapPin, text: 'Al Noor Island — Light garden', time: '6:00 PM' },
    ],
  },
]

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gold/50"
          animate={{ y: [0, -4, 0] }}
          transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function Demo({ isInView }: { isInView: boolean }) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    if (!isInView) return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Show first message
    timers.push(setTimeout(() => setVisibleMessages(1), 500))
    // Show typing indicator
    timers.push(setTimeout(() => setShowTyping(true), 1800))
    // Show bot response
    timers.push(
      setTimeout(() => {
        setShowTyping(false)
        setVisibleMessages(2)
      }, 3000)
    )
    // Show itinerary
    timers.push(setTimeout(() => setShowItinerary(true), 4000))

    return () => timers.forEach(clearTimeout)
  }, [isInView])

  return (
    <div className="space-y-4">
      {/* Language toggle */}
      <div className="flex justify-end">
        <div className="flex rounded-full border border-gold/20 overflow-hidden">
          {(['en', 'ar'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-[10px] font-medium transition-all ${
                lang === l
                  ? 'bg-gold/20 text-gold'
                  : 'text-warm-gray hover:text-warm-white'
              }`}
            >
              {l === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat interface */}
      <div className="bg-midnight/50 rounded-xl border border-gold/10 overflow-hidden">
        <div className="px-3 py-2 border-b border-gold/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="text-[10px] text-warm-gray">
            {lang === 'en' ? 'Shurooq AI Concierge' : 'مساعد شروق الذكي'}
          </span>
        </div>

        <div className="p-3 space-y-3 min-h-[120px]">
          {conversation.slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-gold" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                  msg.role === 'user'
                    ? 'bg-teal/20 text-warm-white border border-teal/20'
                    : 'bg-gold/10 text-warm-white border border-gold/15'
                }`}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-teal-light" />
                </div>
              )}
            </motion.div>
          ))}
          {showTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Itinerary cards */}
      {showItinerary && (
        <div className="space-y-3">
          {itinerary.map((day, di) => (
            <motion.div
              key={day.day}
              className="bg-midnight/50 rounded-xl border border-gold/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: di * 0.3 }}
            >
              <div className="px-3 py-1.5 bg-gold/5 border-b border-gold/10">
                <span className="text-[10px] font-medium text-gold">{day.day}</span>
              </div>
              <div className="p-2 space-y-1">
                {day.items.map((item, ii) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={ii}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gold/5 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: di * 0.3 + ii * 0.15 + 0.2 }}
                    >
                      <Icon size={12} className="text-gold/60 flex-shrink-0" />
                      <span className="text-[11px] text-warm-white flex-1">
                        {item.text}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-warm-gray">
                        <Clock size={9} />
                        {item.time}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TourismPersonalization() {
  return (
    <SectionWrapper useCase={useCases[3]} reversed>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
