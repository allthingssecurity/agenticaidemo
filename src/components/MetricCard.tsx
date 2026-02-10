import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface MetricCardProps {
  label: string
  value: string
  suffix?: string
  delay?: number
  isInView: boolean
  color?: string
}

export default function MetricCard({
  label,
  value,
  suffix = '',
  delay = 0,
  isInView,
  color = '#C5A55A',
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView) return

    const numericMatch = value.match(/[\d,.]+/)
    if (!numericMatch) {
      setDisplayValue(value)
      return
    }

    const target = parseFloat(numericMatch[0].replace(/,/g, ''))
    const hasCommas = value.includes(',')
    const prefix = value.replace(numericMatch[0], '').replace(/[\d,.]/g, '')
    const isFloat = numericMatch[0].includes('.')
    const duration = 1500
    const startTime = performance.now()

    const timer = setTimeout(() => {
      const animate = (now: number) => {
        const elapsed = now - startTime - delay * 1000
        if (elapsed < 0) {
          requestAnimationFrame(animate)
          return
        }
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = target * eased

        let formatted: string
        if (isFloat) {
          formatted = current.toFixed(1)
        } else if (hasCommas) {
          formatted = Math.round(current).toLocaleString()
        } else {
          formatted = Math.round(current).toString()
        }

        setDisplayValue(prefix + formatted)
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, 0)

    return () => clearTimeout(timer)
  }, [isInView, value, delay])

  return (
    <motion.div
      className="rounded-xl border p-4 text-center"
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}08`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay + 0.3, duration: 0.5 }}
    >
      <div
        className="text-2xl md:text-3xl font-bold font-display"
        style={{ color }}
      >
        {isInView ? displayValue : '0'}
        {suffix && <span className="text-lg ml-0.5">{suffix}</span>}
      </div>
      <div className="text-xs text-warm-gray mt-1">{label}</div>
    </motion.div>
  )
}
