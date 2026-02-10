import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Compare residential, mixed-use, and green priority scenarios for the new district.',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'I\'ll run all three scenarios through our Traffic, Sustainability, and Economist agents. Starting simulations now...',
    delay: 2500,
  },
  {
    role: 'assistant',
    content: 'Residential Focus: livability 88, but traffic bottleneck at zones C3-C5. Avg commute jumps to 42 min (+18%). High tax revenue at $18M/yr.',
    delay: 5000,
  },
  {
    role: 'user',
    content: 'What about the mixed-use option?',
    delay: 6500,
  },
  {
    role: 'assistant',
    content: 'Mixed-Use scores best overall: livability 82, traffic 85 (commute drops 35%!), green 78. Walk-to-work ratio: 41%. Combined tax: $22M/yr with +15% commercial premium.',
    delay: 9000,
  },
  {
    role: 'user',
    content: 'And the green priority scenario?',
    delay: 10500,
  },
  {
    role: 'assistant',
    content: 'Green Priority: sustainability score 95 (best), carbon negative with reforestation. But livability drops to 75, commute at 31 min. Tax revenue only $8M/yr. Best for eco-districts, not citywide.',
    delay: 13000,
  },
  {
    role: 'assistant',
    content: 'Recommendation: Mixed-Use wins on balance. Rotating the visual comparison below.',
    delay: 14500,
  },
]

const debateSteps: Record<number, TraceStep[]> = {
  0: [
    { type: 'tool_call', agent: 'Traffic', content: 'simulate_commute(layout="residential", density=HIGH)', delay: 500 },
    { type: 'observation', content: 'Avg commute: 42 min (+18%). Bottleneck at zones C3-C5.', delay: 1200 },
    { type: 'thinking', agent: 'Traffic', content: '"Residential focus creates commute congestion \u2014 score 62"', delay: 1800 },
    { type: 'tool_call', agent: 'Sustainability', content: 'estimate_emissions(green_ratio=0.22, transport="car-heavy")', delay: 2600 },
    { type: 'observation', content: 'CO\u2082: 14.2t/capita/yr. Green coverage insufficient for offset.', delay: 3400 },
    { type: 'thinking', agent: 'Sustainability', content: '"Livability high but environmental cost significant \u2014 score 70"', delay: 4000 },
    { type: 'tool_call', agent: 'Economist', content: 'project_tax_revenue(zoning="residential", units=2400)', delay: 4800 },
    { type: 'observation', content: 'Property tax +$18M/yr. Highest residential revenue potential.', delay: 5400 },
    { type: 'decision', agent: 'Planner', content: 'Residential focus: Best livability (88) but traffic bottlenecks (62). Recommend hybrid approach.', delay: 6200 },
  ],
  1: [
    { type: 'tool_call', agent: 'Traffic', content: 'simulate_commute(layout="mixed-use", density=MEDIUM)', delay: 500 },
    { type: 'observation', content: 'Avg commute: 23 min (-35%). Walk-to-work ratio: 41%.', delay: 1200 },
    { type: 'thinking', agent: 'Traffic', content: '"Mixed-use reduces commute by 35% \u2014 excellent score 85"', delay: 1800 },
    { type: 'tool_call', agent: 'Sustainability', content: 'estimate_emissions(green_ratio=0.30, transport="mixed")', delay: 2600 },
    { type: 'observation', content: 'CO\u2082: 9.8t/capita/yr. Green space offsets 40% of emissions.', delay: 3400 },
    { type: 'thinking', agent: 'Sustainability', content: '"Good balance of green and built area \u2014 score 78"', delay: 4000 },
    { type: 'tool_call', agent: 'Economist', content: 'project_tax_revenue(zoning="mixed", commercial_pct=35)', delay: 4800 },
    { type: 'observation', content: 'Combined tax: $22M/yr. Commercial rent premium +15%.', delay: 5400 },
    { type: 'decision', agent: 'Planner', content: 'Mixed-use: Best balanced \u2014 traffic (85), green (78), livability (82). Recommended scenario.', delay: 6200 },
  ],
  2: [
    { type: 'tool_call', agent: 'Traffic', content: 'simulate_commute(layout="green-priority", density=LOW)', delay: 500 },
    { type: 'observation', content: 'Avg commute: 31 min. Limited commercial zones increase travel.', delay: 1200 },
    { type: 'thinking', agent: 'Traffic', content: '"Green priority forces longer commutes to commercial hubs \u2014 score 70"', delay: 1800 },
    { type: 'tool_call', agent: 'Sustainability', content: 'estimate_emissions(green_ratio=0.55, transport="bike-walk")', delay: 2600 },
    { type: 'observation', content: 'CO\u2082: 5.2t/capita/yr. Carbon negative with reforestation. Best case.', delay: 3400 },
    { type: 'thinking', agent: 'Sustainability', content: '"Green priority cuts emissions 62% \u2014 exceptional score 95"', delay: 4000 },
    { type: 'tool_call', agent: 'Economist', content: 'project_tax_revenue(zoning="green", residential_pct=20)', delay: 4800 },
    { type: 'observation', content: 'Tax revenue: $8M/yr. Eco-tourism potential +$5M. Long-term play.', delay: 5400 },
    { type: 'decision', agent: 'Planner', content: 'Green priority: Best sustainability (95) but livability trade-off (75). Ideal for eco-districts.', delay: 6200 },
  ],
}

// Export the first scenario's steps as default reasoning
export const reasoningSteps: TraceStep[] = debateSteps[1]

const scenarios = [
  {
    name: 'Residential Focus',
    grid: [
      [1,1,2,2,0,0,3,3,0,0,1,1],
      [1,1,2,2,0,0,3,3,0,0,1,1],
      [0,0,1,1,1,1,0,0,2,2,0,0],
      [0,0,1,1,1,1,0,0,2,2,0,0],
      [3,0,0,0,1,1,1,1,0,0,3,0],
      [3,0,0,0,1,1,1,1,0,0,3,0],
      [0,0,2,0,0,0,0,0,1,1,0,0],
      [0,0,2,0,0,0,0,0,1,1,0,0],
      [1,1,0,0,3,3,0,0,0,0,1,1],
      [1,1,0,0,3,3,0,0,0,0,1,1],
      [0,0,0,0,0,0,2,2,0,0,0,0],
      [0,0,0,0,0,0,2,2,0,0,0,0],
    ],
    scores: { livability: 88, traffic: 62, green: 70 },
  },
  {
    name: 'Mixed-Use',
    grid: [
      [2,2,1,0,3,0,2,1,0,3,0,2],
      [2,2,1,0,3,0,2,1,0,3,0,2],
      [0,1,2,2,0,3,0,2,1,0,3,0],
      [0,1,2,2,0,3,0,2,1,0,3,0],
      [3,0,0,1,2,2,3,0,0,1,2,0],
      [3,0,0,1,2,2,3,0,0,1,2,0],
      [0,2,3,0,0,1,0,2,3,0,0,1],
      [0,2,3,0,0,1,0,2,3,0,0,1],
      [1,0,0,2,3,0,1,0,0,2,3,0],
      [1,0,0,2,3,0,1,0,0,2,3,0],
      [0,3,1,0,0,2,0,3,1,0,0,2],
      [0,3,1,0,0,2,0,3,1,0,0,2],
    ],
    scores: { livability: 82, traffic: 85, green: 78 },
  },
  {
    name: 'Green Priority',
    grid: [
      [3,3,3,0,1,0,3,3,3,0,1,0],
      [3,3,3,0,1,0,3,3,3,0,1,0],
      [3,0,0,3,3,3,0,0,3,3,3,0],
      [3,0,0,3,3,3,0,0,3,3,3,0],
      [0,2,3,3,0,3,3,2,0,3,0,3],
      [0,2,3,3,0,3,3,2,0,3,0,3],
      [3,3,0,0,3,3,3,0,0,3,3,3],
      [3,3,0,0,3,3,3,0,0,3,3,3],
      [0,0,3,3,3,0,0,3,3,3,0,0],
      [0,0,3,3,3,0,0,3,3,3,0,0],
      [1,3,3,0,0,2,1,3,3,0,0,2],
      [1,3,3,0,0,2,1,3,3,0,0,2],
    ],
    scores: { livability: 75, traffic: 70, green: 95 },
  },
]

const cellColors: Record<number, string> = {
  0: '#142A45',
  1: '#C5A55A',
  2: '#1A8A7D',
  3: '#22B8A6',
}

export function VisualPanel({ isActive }: { isActive: boolean }) {
  const [activeScenario, setActiveScenario] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [isActive])

  const scenario = scenarios[activeScenario]

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <div className="flex gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActiveScenario(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === activeScenario
                ? 'bg-teal/20 text-teal-light border border-teal/40'
                : 'bg-midnight/50 text-warm-gray border border-white/5'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* City grid */}
      <div className="bg-midnight/50 rounded-xl p-2 border border-teal/10">
        <div className="grid grid-cols-12 gap-[2px]">
          <AnimatePresence mode="wait">
            {scenario.grid.flat().map((cell, i) => (
              <motion.div
                key={`${activeScenario}-${i}`}
                className="aspect-square rounded-[2px]"
                style={{ backgroundColor: cellColors[cell] }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: cell === 0 ? 0.3 : 0.8, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  delay: (i % 12) * 0.01 + Math.floor(i / 12) * 0.01,
                  duration: 0.2,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-4 mt-2 justify-center">
          {[
            { label: 'Residential', color: '#C5A55A' },
            { label: 'Commercial', color: '#1A8A7D' },
            { label: 'Green Space', color: '#22B8A6' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-warm-gray">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact scores */}
      <div className="space-y-1.5">
        {Object.entries(scenario.scores).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-warm-gray capitalize w-16">{key}</span>
            <div className="flex-1 h-1.5 bg-midnight rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    key === 'green' ? '#22B8A6' : key === 'traffic' ? '#1A8A7D' : '#C5A55A',
                }}
                initial={{ width: 0 }}
                animate={isActive ? { width: `${value}%` } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-bold text-warm-white w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
