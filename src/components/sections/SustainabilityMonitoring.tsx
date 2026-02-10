import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Droplets, Wind, ThermometerSun, Gauge, AlertTriangle } from 'lucide-react'
import SectionWrapper from '../SectionWrapper'
import { useCases } from '../../data/useCases'

const sensors = [
  { icon: Zap, label: 'Energy', value: 72, unit: 'kWh', normal: true },
  { icon: Droplets, label: 'Water', value: 45, unit: 'm³', normal: true },
  { icon: Wind, label: 'CO₂', value: 38, unit: 'ppm', normal: true },
  { icon: ThermometerSun, label: 'Temp', value: 24, unit: '°C', normal: true },
  { icon: Gauge, label: 'HVAC', value: 91, unit: '%', normal: false },
  { icon: Zap, label: 'Solar', value: 68, unit: 'kW', normal: true },
]

const timelineData = [
  65, 68, 72, 70, 75, 78, 82, 85, 92, 88, 85, 80,
  78, 75, 72, 70, 68, 65, 62, 60, 58, 55, 52, 50,
]

function RadialGauge({
  value,
  max,
  color,
  anomaly,
  delay,
  isInView,
}: {
  value: number
  max: number
  color: string
  anomaly: boolean
  delay: number
  isInView: boolean
}) {
  const pct = value / max
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="#142A45"
        strokeWidth="5"
      />
      <motion.circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke={anomaly ? '#ef4444' : color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={isInView ? { strokeDashoffset: offset } : {}}
        transition={{ delay, duration: 1, ease: 'easeOut' }}
        transform="rotate(-90 36 36)"
      />
      {anomaly && (
        <motion.circle
          cx="36"
          cy="36"
          r={radius + 4}
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          opacity={0}
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.1, 1] }}
          transition={{ delay: delay + 1, duration: 1.5, repeat: Infinity }}
        />
      )}
      <text
        x="36"
        y="34"
        textAnchor="middle"
        fill={anomaly ? '#ef4444' : '#F5F0E8'}
        fontSize="12"
        fontWeight="bold"
      >
        {value}
      </text>
      <text
        x="36"
        y="45"
        textAnchor="middle"
        fill="#B8B0A4"
        fontSize="8"
      >
        {max === 100 ? '%' : ''}
      </text>
    </svg>
  )
}

function Demo({ isInView }: { isInView: boolean }) {
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const timer = setTimeout(() => setShowAlert(true), 2500)
    return () => clearTimeout(timer)
  }, [isInView])

  return (
    <div className="space-y-5">
      {/* Sensor grid */}
      <div className="grid grid-cols-3 gap-3">
        {sensors.map((sensor, i) => {
          const Icon = sensor.icon
          const anomaly = !sensor.normal
          return (
            <motion.div
              key={sensor.label}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${
                anomaly
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-teal/10 bg-midnight/50'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15 }}
            >
              <Icon
                size={14}
                className={anomaly ? 'text-red-400' : 'text-teal-light'}
              />
              <RadialGauge
                value={sensor.value}
                max={100}
                color="#22B8A6"
                anomaly={anomaly}
                delay={0.3 + i * 0.15}
                isInView={isInView}
              />
              <span className="text-[10px] text-warm-gray">
                {sensor.label}
              </span>
              <span className="text-[10px] text-warm-gray/50">
                {sensor.value} {sensor.unit}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Alert card */}
      {showAlert && (
        <motion.div
          className="flex items-start gap-3 p-3 rounded-xl border border-red-500/20 bg-red-500/5"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' }}
        >
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-medium text-red-400">
              Anomaly Detected: HVAC Zone B3
            </div>
            <div className="text-[10px] text-warm-gray mt-1">
              Efficiency dropped to 91% — 12% below baseline. Auto-dispatching maintenance request and adjusting cooling schedule.
            </div>
            <motion.div
              className="mt-2 text-[10px] text-teal-light font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Corrective action initiated
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 24h timeline */}
      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-widest text-warm-gray/50 mb-2">
          24-Hour Energy Consumption
        </div>
        <svg viewBox="0 0 240 60" className="w-full">
          <motion.path
            d={`M${timelineData
              .map((v, i) => `${i * 10},${60 - v * 0.6}`)
              .join(' L')}`}
            fill="none"
            stroke="#22B8A6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={500}
            animate={isInView ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 1.5, duration: 2, ease: 'easeInOut' }}
          />
          {/* Area fill */}
          <motion.path
            d={`M0,60 L${timelineData
              .map((v, i) => `${i * 10},${60 - v * 0.6}`)
              .join(' L')} L230,60 Z`}
            fill="url(#timelineGradient)"
            opacity={0}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ delay: 2.5, duration: 1 }}
          />
          <defs>
            <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22B8A6" />
              <stop offset="100%" stopColor="#22B8A6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Time labels */}
          {[0, 6, 12, 18, 23].map((h) => (
            <text
              key={h}
              x={h * 10}
              y="58"
              fill="#B8B0A4"
              fontSize="5"
              textAnchor="middle"
            >
              {h}:00
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default function SustainabilityMonitoring() {
  return (
    <SectionWrapper useCase={useCases[2]}>
      {(isInView) => <Demo isInView={isInView} />}
    </SectionWrapper>
  )
}
