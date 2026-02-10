import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '../SectionWrapper'
import { useCases } from '../../data/useCases'

const scenarios = [
  {
    name: 'Residential Focus',
    grid: [
      [1, 1, 2, 2, 0, 0, 3, 3, 0, 0, 1, 1],
      [1, 1, 2, 2, 0, 0, 3, 3, 0, 0, 1, 1],
      [0, 0, 1, 1, 1, 1, 0, 0, 2, 2, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 2, 2, 0, 0],
      [3, 0, 0, 0, 1, 1, 1, 1, 0, 0, 3, 0],
      [3, 0, 0, 0, 1, 1, 1, 1, 0, 0, 3, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
    ],
    scores: { livability: 88, traffic: 62, green: 70 },
  },
  {
    name: 'Mixed-Use',
    grid: [
      [2, 2, 1, 0, 3, 0, 2, 1, 0, 3, 0, 2],
      [2, 2, 1, 0, 3, 0, 2, 1, 0, 3, 0, 2],
      [0, 1, 2, 2, 0, 3, 0, 2, 1, 0, 3, 0],
      [0, 1, 2, 2, 0, 3, 0, 2, 1, 0, 3, 0],
      [3, 0, 0, 1, 2, 2, 3, 0, 0, 1, 2, 0],
      [3, 0, 0, 1, 2, 2, 3, 0, 0, 1, 2, 0],
      [0, 2, 3, 0, 0, 1, 0, 2, 3, 0, 0, 1],
      [0, 2, 3, 0, 0, 1, 0, 2, 3, 0, 0, 1],
      [1, 0, 0, 2, 3, 0, 1, 0, 0, 2, 3, 0],
      [1, 0, 0, 2, 3, 0, 1, 0, 0, 2, 3, 0],
      [0, 3, 1, 0, 0, 2, 0, 3, 1, 0, 0, 2],
      [0, 3, 1, 0, 0, 2, 0, 3, 1, 0, 0, 2],
    ],
    scores: { livability: 82, traffic: 85, green: 78 },
  },
  {
    name: 'Green Priority',
    grid: [
      [3, 3, 3, 0, 1, 0, 3, 3, 3, 0, 1, 0],
      [3, 3, 3, 0, 1, 0, 3, 3, 3, 0, 1, 0],
      [3, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0],
      [3, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0],
      [0, 2, 3, 3, 0, 3, 3, 2, 0, 3, 0, 3],
      [0, 2, 3, 3, 0, 3, 3, 2, 0, 3, 0, 3],
      [3, 3, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3],
      [3, 3, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3],
      [0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0],
      [0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0],
      [1, 3, 3, 0, 0, 2, 1, 3, 3, 0, 0, 2],
      [1, 3, 3, 0, 0, 2, 1, 3, 3, 0, 0, 2],
    ],
    scores: { livability: 75, traffic: 70, green: 95 },
  },
]

const cellColors: Record<number, string> = {
  0: '#142A45',   // empty / road
  1: '#C5A55A',   // residential (gold)
  2: '#1A8A7D',   // commercial (teal)
  3: '#22B8A6',   // green space (teal-light)
}

function Demo({ isInView }: { isInView: boolean }) {
  const [activeScenario, setActiveScenario] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [isInView])

  const scenario = scenarios[activeScenario]

  return (
    <div className="space-y-5">
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
      <div className="bg-midnight/50 rounded-xl p-3 border border-teal/10">
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
                  delay: (i % 12) * 0.02 + Math.floor(i / 12) * 0.02,
                  duration: 0.3,
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 justify-center">
          {[
            { label: 'Residential', color: '#C5A55A' },
            { label: 'Commercial', color: '#1A8A7D' },
            { label: 'Green Space', color: '#22B8A6' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-warm-gray">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact scores */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-warm-gray/50">
          Impact Analysis
        </div>
        {Object.entries(scenario.scores).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-warm-gray capitalize w-16">{key}</span>
            <div className="flex-1 h-2 bg-midnight rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    key === 'green' ? '#22B8A6' : key === 'traffic' ? '#1A8A7D' : '#C5A55A',
                }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${value}%` } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-bold text-warm-white w-8 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UrbanPlanning() {
  return (
    <SectionWrapper useCase={useCases[1]} reversed>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
