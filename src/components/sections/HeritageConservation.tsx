import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scan, AlertCircle } from 'lucide-react'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'

const problemAreas = [
  { x: 30, y: 25, label: 'Roof erosion', severity: 'high' },
  { x: 65, y: 45, label: 'Wall crack', severity: 'medium' },
  { x: 45, y: 70, label: 'Foundation shift', severity: 'low' },
]

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Analyze structural condition of Al Hisn Fort and recommend conservation priorities.',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'Running computer vision analysis on building SHJ-042. Detected 3 anomalies: roof erosion (94% confidence), wall crack (87%), and foundation shift (72%).',
    delay: 3000,
  },
  {
    role: 'user',
    content: 'How serious is the roof erosion?',
    delay: 4500,
  },
  {
    role: 'assistant',
    content: 'Critical. FEM simulation shows stress at ridge: 340 MPa vs 380 MPa yield strength. Safety factor only 1.12 (marginal). Estimated remaining life: 8-14 months without intervention.',
    delay: 7000,
  },
  {
    role: 'user',
    content: 'What materials should we use for repair? Must match the original construction.',
    delay: 8500,
  },
  {
    role: 'assistant',
    content: 'Found 23 historical records including original 1823 blueprints. Original materials: coral stone + chandal wood beams. Modern equivalent: reinforced lime mortar \u2014 preserves authenticity while adding structural strength.',
    delay: 11000,
  },
  {
    role: 'assistant',
    content: 'Conservation priorities: (1) Roof stabilization with lime mortar \u2014 2 weeks, (2) Full 3D scan before intervention, (3) Climate enclosure for artifacts. Recommend starting immediately.',
    delay: 13500,
  },
]

export const reasoningSteps: TraceStep[] = [
  {
    type: 'tool_call',
    agent: 'Vision',
    content: 'analyze_image(building_id="SHJ-042", model="heritage-detect-v3")',
    delay: 600,
  },
  {
    type: 'observation',
    content: 'Detected: roof_erosion (conf: 94%), wall_crack (conf: 87%), foundation_shift (conf: 72%)',
    delay: 1400,
  },
  {
    type: 'thinking',
    agent: 'Vision',
    content: '"3 anomalies found. Roof erosion is highest confidence \u2014 prioritizing structural analysis."',
    delay: 2200,
  },
  {
    type: 'tool_call',
    agent: 'Structural',
    content: 'run_fem_simulation(mesh="SHJ-042-roof", load="wind+rain", iterations=1000)',
    delay: 3000,
  },
  {
    type: 'observation',
    content: 'Stress concentration at ridge: 340 MPa (yield: 380 MPa). Safety factor: 1.12 \u2014 MARGINAL',
    delay: 3800,
  },
  {
    type: 'tool_call',
    agent: 'Structural',
    content: 'estimate_remaining_life(component="roof", wear_rate=0.023)',
    delay: 4400,
  },
  {
    type: 'observation',
    content: 'Estimated remaining life: 8-14 months without intervention.',
    delay: 5200,
  },
  {
    type: 'tool_call',
    agent: 'Archive',
    content: 'search_historical_records(building="Al Hisn Fort", era="pre-1950")',
    delay: 6000,
  },
  {
    type: 'observation',
    content: 'Found 23 records: original blueprints (1823), 4 restoration reports, 18 photographs.',
    delay: 6800,
  },
  {
    type: 'tool_call',
    agent: 'Archive',
    content: 'match_materials(era="1820s", region="Gulf", component="roof")',
    delay: 7400,
  },
  {
    type: 'observation',
    content: 'Original: coral stone + chandal wood beams. Modern equiv: reinforced lime mortar.',
    delay: 8200,
  },
  {
    type: 'thinking',
    agent: 'Conservation',
    content: '"Roof is critical \u2014 marginal safety factor + 8-14 month life. Must preserve original materials while reinforcing."',
    delay: 9000,
  },
  {
    type: 'decision',
    agent: 'Conservation',
    content: 'Priority 1: Roof stabilization (2 weeks, lime mortar). Priority 2: 3D scan before intervention. Priority 3: Climate enclosure for artifacts.',
    delay: 10000,
  },
]

export function VisualPanel({ isActive }: { isActive: boolean }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [showProblems, setShowProblems] = useState(false)

  useEffect(() => {
    if (!isActive) return
    const timers: ReturnType<typeof setTimeout>[] = []

    let frame = 0
    const scanInterval = setInterval(() => {
      frame++
      setScanProgress(Math.min(frame * 2, 100))
      if (frame >= 50) clearInterval(scanInterval)
    }, 40)

    timers.push(setTimeout(() => setShowProblems(true), 2500))

    return () => {
      clearInterval(scanInterval)
      timers.forEach(clearTimeout)
    }
  }, [isActive])

  return (
    <div className="space-y-3">
      {/* Building SVG with scan */}
      <div className="relative bg-midnight/50 rounded-xl border border-gold-light/10 p-4 min-h-[180px] overflow-hidden">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <motion.path
            d="M40 130 L40 50 L60 30 L100 20 L140 30 L160 50 L160 130 Z"
            fill="none"
            stroke="#D4BA78"
            strokeWidth="1.5"
            strokeDasharray="500"
            strokeDashoffset={500}
            animate={isActive ? { strokeDashoffset: 0 } : {}}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M85 130 L85 100 Q100 95 115 100 L115 130"
            fill="none"
            stroke="#D4BA78"
            strokeWidth="1"
            strokeDasharray="100"
            strokeDashoffset={100}
            animate={isActive ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
          />
          {[
            [55, 60, 70, 80],
            [130, 60, 145, 80],
            [55, 90, 70, 110],
            [130, 90, 145, 110],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.rect
              key={i}
              x={x1}
              y={y1}
              width={x2 - x1}
              height={y2 - y1}
              fill="none"
              stroke="#D4BA78"
              strokeWidth="0.8"
              opacity={0}
              animate={isActive ? { opacity: 0.6 } : {}}
              transition={{ delay: 1.8 + i * 0.2 }}
            />
          ))}
          <motion.path
            d="M95 20 L100 5 L105 20"
            fill="none"
            stroke="#D4BA78"
            strokeWidth="1"
            strokeDasharray="40"
            strokeDashoffset={40}
            animate={isActive ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 2, duration: 0.5 }}
          />
          {scanProgress < 100 && (
            <motion.line
              x1="30"
              y1={10 + scanProgress * 1.2}
              x2="170"
              y2={10 + scanProgress * 1.2}
              stroke="#22B8A6"
              strokeWidth="1"
              opacity="0.6"
            />
          )}
        </svg>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Scan size={12} className="text-teal-light" />
          <span className="text-[10px] text-teal-light font-mono">{scanProgress}%</span>
        </div>

        {showProblems &&
          problemAreas.map((area) => (
            <motion.div
              key={area.label}
              className="absolute flex items-center gap-1"
              style={{ left: `${area.x}%`, top: `${area.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <motion.div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  area.severity === 'high'
                    ? 'bg-red-500/20 border border-red-500/40'
                    : area.severity === 'medium'
                    ? 'bg-yellow-500/20 border border-yellow-500/40'
                    : 'bg-blue-500/20 border border-blue-500/40'
                }`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle
                  size={8}
                  className={
                    area.severity === 'high'
                      ? 'text-red-400'
                      : area.severity === 'medium'
                      ? 'text-yellow-400'
                      : 'text-blue-400'
                  }
                />
              </motion.div>
              <span className="text-[11px] text-warm-gray whitespace-nowrap bg-midnight/80 px-1.5 py-0.5 rounded">
                {area.label}
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  )
}
