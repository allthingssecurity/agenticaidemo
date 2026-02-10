import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scan, AlertCircle, FileText, Shield } from 'lucide-react'
import SectionWrapper from '../SectionWrapper'
import { useCases } from '../../data/useCases'

const problemAreas = [
  { x: 30, y: 25, label: 'Roof erosion', severity: 'high' },
  { x: 65, y: 45, label: 'Wall crack', severity: 'medium' },
  { x: 45, y: 70, label: 'Foundation shift', severity: 'low' },
]

const recommendations = [
  {
    icon: Shield,
    title: 'Immediate Stabilization',
    desc: 'Reinforce roof structure — estimated 2 weeks',
    priority: 'Critical',
  },
  {
    icon: FileText,
    title: 'Document & Archive',
    desc: '3D scan + photogrammetry before intervention',
    priority: 'High',
  },
  {
    icon: Shield,
    title: 'Long-term Preservation',
    desc: 'Climate-controlled enclosure for artifacts',
    priority: 'Medium',
  },
]

function Demo({ isInView }: { isInView: boolean }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [showProblems, setShowProblems] = useState(false)
  const [showRecs, setShowRecs] = useState(false)

  useEffect(() => {
    if (!isInView) return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Animate scan line
    let frame = 0
    const scanInterval = setInterval(() => {
      frame++
      setScanProgress(Math.min(frame * 2, 100))
      if (frame >= 50) clearInterval(scanInterval)
    }, 40)

    timers.push(setTimeout(() => setShowProblems(true), 2500))
    timers.push(setTimeout(() => setShowRecs(true), 3500))

    return () => {
      clearInterval(scanInterval)
      timers.forEach(clearTimeout)
    }
  }, [isInView])

  return (
    <div className="space-y-5">
      {/* Building SVG with path animation */}
      <div className="relative bg-midnight/50 rounded-xl border border-gold-light/10 p-4 min-h-[220px] overflow-hidden">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          {/* Building outline - path animation */}
          <motion.path
            d="M40 130 L40 50 L60 30 L100 20 L140 30 L160 50 L160 130 Z"
            fill="none"
            stroke="#D4BA78"
            strokeWidth="1.5"
            strokeDasharray="500"
            strokeDashoffset={500}
            animate={isInView ? { strokeDashoffset: 0 } : {}}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          {/* Door */}
          <motion.path
            d="M85 130 L85 100 Q100 95 115 100 L115 130"
            fill="none"
            stroke="#D4BA78"
            strokeWidth="1"
            strokeDasharray="100"
            strokeDashoffset={100}
            animate={isInView ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
          />
          {/* Windows */}
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
              animate={isInView ? { opacity: 0.6 } : {}}
              transition={{ delay: 1.8 + i * 0.2 }}
            />
          ))}
          {/* Minaret */}
          <motion.path
            d="M95 20 L100 5 L105 20"
            fill="none"
            stroke="#D4BA78"
            strokeWidth="1"
            strokeDasharray="40"
            strokeDashoffset={40}
            animate={isInView ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 2, duration: 0.5 }}
          />
          {/* Scan line */}
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

        {/* Scan progress */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Scan size={12} className="text-teal-light" />
          <span className="text-[10px] text-teal-light font-mono">
            {scanProgress}%
          </span>
        </div>

        {/* Problem markers */}
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
              <span className="text-[8px] text-warm-gray whitespace-nowrap bg-midnight/80 px-1.5 py-0.5 rounded">
                {area.label}
              </span>
            </motion.div>
          ))}
      </div>

      {/* Archive documents + recommendations */}
      {showRecs && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-warm-gray/50">
            Preservation Recommendations
          </div>
          {recommendations.map((rec, i) => {
            const Icon = rec.icon
            return (
              <motion.div
                key={rec.title}
                className="flex items-start gap-3 p-3 rounded-xl border border-gold-light/10 bg-midnight/50"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-gold-light" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-warm-white">
                    {rec.title}
                  </div>
                  <div className="text-[10px] text-warm-gray mt-0.5">
                    {rec.desc}
                  </div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full ${
                    rec.priority === 'Critical'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : rec.priority === 'High'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {rec.priority}
                </span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function HeritageConservation() {
  return (
    <SectionWrapper useCase={useCases[4]}>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
