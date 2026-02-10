import { motion } from 'framer-motion'
import { MapPin, Clock, Utensils } from 'lucide-react'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'I\'m visiting Sharjah for 2 days with my family. We love art and local food!',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'Welcome to Sharjah! Let me find the best art and food experiences for your family. Searching attractions and checking availability...',
    delay: 2500,
  },
  {
    role: 'assistant',
    content: 'Found 12 art venues and 8 food spots. Filtering for family-friendly options and optimizing your route for minimal transit (4.2km walking total).',
    delay: 5500,
  },
  {
    role: 'user',
    content: 'Sounds great! What does Day 1 look like?',
    delay: 7000,
  },
  {
    role: 'assistant',
    content: 'Day 1: Morning at Sharjah Art Museum (guided family tour at 9AM), lunch at Al Arsa Souk for authentic local cuisine at 12:30, then a heritage walk through Heart of Sharjah at 4PM.',
    delay: 9500,
  },
  {
    role: 'user',
    content: 'And Day 2?',
    delay: 10500,
  },
  {
    role: 'assistant',
    content: 'Day 2: Start at Mleiha Archaeological Centre (8:30AM), desert dining experience at 1PM, and finish with the magical Al Noor Island light garden at 6PM. All venues within 15-min drive!',
    delay: 13000,
  },
]

export const reasoningSteps: TraceStep[] = [
  {
    type: 'tool_call',
    agent: 'Concierge',
    content: 'extract_preferences(message="visiting Sharjah...art and local food")',
    delay: 1800,
  },
  {
    type: 'observation',
    content: '{interests: ["art", "food"], group: "family", duration: "2 days", language: "en"}',
    delay: 2600,
  },
  {
    type: 'tool_call',
    agent: 'Concierge',
    content: 'search_attractions(type="art", family_friendly=true, region="Sharjah")',
    delay: 3200,
  },
  {
    type: 'observation',
    content: '12 results: Sharjah Art Museum, Heart of Sharjah, Calligraphy Museum, ...',
    delay: 4000,
  },
  {
    type: 'tool_call',
    agent: 'Concierge',
    content: 'search_attractions(type="food", cuisine="local", family_friendly=true)',
    delay: 4600,
  },
  {
    type: 'observation',
    content: '8 results: Al Arsa Souk, Al Bait Restaurant, Desert dining experience, ...',
    delay: 5400,
  },
  {
    type: 'tool_call',
    agent: 'Concierge',
    content: 'check_availability(locations=[...12 results], date="2024-03-15")',
    delay: 6000,
  },
  {
    type: 'observation',
    content: '10 available. Art Museum: slots at 9AM, 2PM. Al Arsa Souk: open all day.',
    delay: 6800,
  },
  {
    type: 'thinking',
    agent: 'Concierge',
    content: '"Family with kids \u2014 morning for museums, midday food, afternoon outdoor. Optimize for minimal transit."',
    delay: 7400,
  },
  {
    type: 'tool_call',
    agent: 'Concierge',
    content: 'optimize_route(locations=[6 selected], transport="car+walking")',
    delay: 8000,
  },
  {
    type: 'observation',
    content: 'Optimal route: 4.2km total walking. All venues within 15-min drive.',
    delay: 8800,
  },
  {
    type: 'decision',
    agent: 'Concierge',
    content: 'Personalized 2-day itinerary ready. 6 activities, route-optimized, family-friendly.',
    delay: 10200,
  },
]

const itinerary = [
  {
    day: 'Day 1',
    items: [
      { icon: MapPin, text: 'Sharjah Art Museum \u2014 Guided family tour', time: '9:00 AM' },
      { icon: Utensils, text: 'Al Arsa Souk \u2014 Local cuisine experience', time: '12:30 PM' },
      { icon: MapPin, text: 'Heart of Sharjah \u2014 Heritage walk', time: '4:00 PM' },
    ],
  },
  {
    day: 'Day 2',
    items: [
      { icon: MapPin, text: 'Mleiha Archaeological Centre', time: '8:30 AM' },
      { icon: Utensils, text: 'Desert dining experience', time: '1:00 PM' },
      { icon: MapPin, text: 'Al Noor Island \u2014 Light garden', time: '6:00 PM' },
    ],
  },
]

export function VisualPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="space-y-2">
      {itinerary.map((day, di) => (
        <motion.div
          key={day.day}
          className="bg-midnight/50 rounded-xl border border-gold/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 11 + di * 0.3 }}
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
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 11 + di * 0.3 + ii * 0.15 + 0.2 }}
                >
                  <Icon size={12} className="text-gold/60 flex-shrink-0" />
                  <span className="text-[11px] text-warm-white flex-1">{item.text}</span>
                  <div className="flex items-center gap-1 text-[11px] text-warm-gray">
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
  )
}
