import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import SectionWrapper from '../SectionWrapper'
import { useCases } from '../../data/useCases'

const baselineData = [30, 32, 34, 35, 37, 38, 40, 41, 42, 43, 44, 45]
const optimisticData = [30, 33, 37, 42, 48, 55, 61, 68, 74, 80, 86, 92]
const conservativeData = [30, 31, 33, 34, 36, 37, 39, 40, 42, 43, 45, 47]

const comparisonRows = [
  { metric: 'GDP Growth', optimistic: '+8.2%', conservative: '+3.1%', baseline: '+2.5%' },
  { metric: 'Job Creation', optimistic: '45,000', conservative: '18,000', baseline: '12,000' },
  { metric: 'FDI Inflow', optimistic: '$2.4B', conservative: '$1.1B', baseline: '$0.8B' },
  { metric: 'Tourism Revenue', optimistic: '+42%', conservative: '+15%', baseline: '+8%' },
  { metric: 'Carbon Reduction', optimistic: '-28%', conservative: '-12%', baseline: '-5%' },
]

function dataToPath(data: number[], width: number, height: number): string {
  const maxVal = 100
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (v / maxVal) * height
    return `${x},${y}`
  })
  return `M${points.join(' L')}`
}

function dataToArea(data: number[], width: number, height: number): string {
  const line = dataToPath(data, width, height)
  return `${line} L${width},${height} L0,${height} Z`
}

function Demo({ isInView }: { isInView: boolean }) {
  const [showTable, setShowTable] = useState(false)
  const [visibleRows, setVisibleRows] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setShowTable(true), 2500))

    comparisonRows.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleRows(i + 1), 3000 + i * 300))
    })

    return () => timers.forEach(clearTimeout)
  }, [isInView])

  const chartW = 300
  const chartH = 120

  return (
    <div className="space-y-5">
      {/* Dual scenario chart */}
      <div className="bg-midnight/50 rounded-xl border border-gold/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-warm-gray/50">
            Economic Projection — 12-Year Forecast
          </span>
        </div>
        <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1="0"
                y1={chartH - (v / 100) * chartH}
                x2={chartW}
                y2={chartH - (v / 100) * chartH}
                stroke="#142A45"
                strokeWidth="0.5"
              />
              <text
                x="-2"
                y={chartH - (v / 100) * chartH + 3}
                fill="#B8B0A4"
                fontSize="6"
                textAnchor="end"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Baseline */}
          <motion.path
            d={dataToPath(baselineData, chartW, chartH)}
            fill="none"
            stroke="#B8B0A4"
            strokeWidth="1"
            strokeDasharray="4 2"
            strokeDasharray2="600"
            opacity={0}
            animate={isInView ? { opacity: 0.5 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
          />

          {/* Optimistic area */}
          <motion.path
            d={dataToArea(optimisticData, chartW, chartH)}
            fill="#C5A55A"
            opacity={0}
            animate={isInView ? { opacity: 0.1 } : {}}
            transition={{ delay: 1, duration: 1 }}
          />

          {/* Optimistic line */}
          <motion.path
            d={dataToPath(optimisticData, chartW, chartH)}
            fill="none"
            stroke="#C5A55A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset={600}
            animate={isInView ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 0.5, duration: 2, ease: 'easeInOut' }}
          />

          {/* Conservative area */}
          <motion.path
            d={dataToArea(conservativeData, chartW, chartH)}
            fill="#1A8A7D"
            opacity={0}
            animate={isInView ? { opacity: 0.1 } : {}}
            transition={{ delay: 1, duration: 1 }}
          />

          {/* Conservative line */}
          <motion.path
            d={dataToPath(conservativeData, chartW, chartH)}
            fill="none"
            stroke="#1A8A7D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset={600}
            animate={isInView ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 0.5, duration: 2, ease: 'easeInOut' }}
          />

          {/* Year labels */}
          {[0, 3, 6, 9, 11].map((i) => (
            <text
              key={i}
              x={(i / 11) * chartW}
              y={chartH + 12}
              fill="#B8B0A4"
              fontSize="6"
              textAnchor="middle"
            >
              {2025 + i}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex gap-4 mt-2 justify-center">
          {[
            { label: 'Optimistic', color: '#C5A55A' },
            { label: 'Conservative', color: '#1A8A7D' },
            { label: 'Baseline', color: '#B8B0A4', dashed: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="w-4 h-0.5 rounded"
                style={{
                  backgroundColor: item.color,
                  borderBottom: item.dashed ? `1px dashed ${item.color}` : undefined,
                }}
              />
              <span className="text-[9px] text-warm-gray">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {showTable && (
        <motion.div
          className="bg-midnight/50 rounded-xl border border-gold/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-4 text-[9px] uppercase tracking-wider text-warm-gray/50 px-3 py-2 border-b border-gold/10 bg-gold/5">
            <span>Metric</span>
            <span className="text-center">Optimistic</span>
            <span className="text-center">Conservative</span>
            <span className="text-center">Baseline</span>
          </div>
          {comparisonRows.slice(0, visibleRows).map((row, i) => (
            <motion.div
              key={row.metric}
              className="grid grid-cols-4 px-3 py-2 border-b border-white/5 text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-warm-white text-[11px]">{row.metric}</span>
              <span className="text-center text-gold font-medium flex items-center justify-center gap-1">
                {row.optimistic}
                <ArrowUpRight size={10} />
              </span>
              <span className="text-center text-teal flex items-center justify-center gap-1">
                {row.conservative}
                <ArrowUpRight size={10} />
              </span>
              <span className="text-center text-warm-gray flex items-center justify-center gap-1">
                {row.baseline}
                <ArrowDownRight size={10} className="opacity-50" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function EconomicImpact() {
  return (
    <SectionWrapper useCase={useCases[6]}>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
