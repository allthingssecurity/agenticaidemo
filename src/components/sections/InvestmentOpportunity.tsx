import { motion } from 'framer-motion'
import {
  Database,
  Globe,
  FileText,
  Brain,
  Star,
} from 'lucide-react'
import SectionWrapper from '../SectionWrapper'
import AgentNode from '../AgentNode'
import { useCases } from '../../data/useCases'

const mapPins = [
  { x: 55, y: 35, label: 'Al Majaz', score: 92, delay: 0.8 },
  { x: 72, y: 48, label: 'Al Layyeh', score: 87, delay: 1.2 },
  { x: 40, y: 55, label: 'Muwaileh', score: 85, delay: 1.6 },
  { x: 60, y: 68, label: 'Al Nahda', score: 78, delay: 2.0 },
  { x: 35, y: 40, label: 'Al Khan', score: 74, delay: 2.4 },
]

const opportunities = [
  { name: 'Al Majaz Waterfront Mixed-Use', score: 92, sector: 'Real Estate' },
  { name: 'Sharjah Book Authority Hub', score: 87, sector: 'Culture' },
  { name: 'Muwaileh Smart District', score: 85, sector: 'Technology' },
]

function Demo({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-6">
      {/* Agent network */}
      <div className="flex items-center justify-around relative">
        <AgentNode icon={Database} label="Market Data" delay={0.2} size="sm" />
        <AgentNode icon={Globe} label="Global Trends" delay={0.4} size="sm" />
        <AgentNode icon={FileText} label="Regulations" delay={0.6} size="sm" />

        {/* Center scoring engine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4">
          <AgentNode
            icon={Brain}
            label="AI Scoring Engine"
            delay={0.8}
            size="lg"
            color="#C5A55A"
          />
        </div>
      </div>

      {/* Connecting lines */}
      <svg className="w-full h-12 -mt-2">
        {[0.2, 0.5, 0.8].map((x, i) => (
          <motion.line
            key={i}
            x1={`${x * 100}%`}
            y1="0"
            x2="50%"
            y2="100%"
            stroke="#C5A55A"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity={0}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ delay: 0.8 + i * 0.2 }}
          />
        ))}
      </svg>

      {/* Map visualization */}
      <div className="relative bg-midnight/50 rounded-xl p-4 mt-12 border border-gold/10 min-h-[180px]">
        <div className="absolute top-2 left-3 text-[10px] text-warm-gray/50 uppercase tracking-widest">
          Sharjah Investment Map
        </div>
        {/* Stylized map shape */}
        <svg viewBox="0 0 100 80" className="w-full h-full opacity-20">
          <path
            d="M20 10 Q50 5 80 15 Q85 40 75 65 Q50 75 25 65 Q15 40 20 10Z"
            fill="none"
            stroke="#C5A55A"
            strokeWidth="0.5"
          />
        </svg>
        {/* Animated pins */}
        {mapPins.map((pin) => (
          <motion.div
            key={pin.label}
            className="absolute flex flex-col items-center"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: pin.delay, type: 'spring' }}
          >
            <motion.div
              className="absolute w-6 h-6 rounded-full bg-gold/20"
              animate={isInView ? { scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] } : {}}
              transition={{ delay: pin.delay + 0.5, duration: 2, repeat: Infinity }}
            />
            <div className="w-3 h-3 rounded-full bg-gold border border-gold-light z-10" />
            <div className="mt-1 text-[9px] text-warm-gray whitespace-nowrap">
              {pin.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ranked results */}
      <div className="space-y-2 mt-4">
        <div className="text-[10px] uppercase tracking-widest text-warm-gray/50 mb-2">
          Top Opportunities
        </div>
        {opportunities.map((opp, i) => (
          <motion.div
            key={opp.name}
            className="flex items-center gap-3 bg-midnight/50 rounded-lg px-3 py-2 border border-gold/10"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 2.5 + i * 0.2 }}
          >
            <Star size={12} className="text-gold flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-warm-white truncate">{opp.name}</div>
              <div className="text-[10px] text-warm-gray">{opp.sector}</div>
            </div>
            <div className="text-sm font-bold text-gold">{opp.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function InvestmentOpportunity() {
  return (
    <SectionWrapper useCase={useCases[0]}>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
