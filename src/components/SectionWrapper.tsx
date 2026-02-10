import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import MetricCard from './MetricCard'
import type { UseCase } from '../data/useCases'

interface SectionWrapperProps {
  useCase: UseCase
  children: (isInView: boolean) => React.ReactNode
  reversed?: boolean
}

function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="islamic"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0L60 15L60 45L30 60L0 45L0 15Z"
            fill="none"
            stroke="#C5A55A"
            strokeWidth="0.5"
          />
          <circle cx="30" cy="30" r="8" fill="none" stroke="#C5A55A" strokeWidth="0.5" />
          <path
            d="M30 0L30 60M0 30L60 30"
            stroke="#C5A55A"
            strokeWidth="0.3"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic)" />
    </svg>
  )
}

export default function SectionWrapper({
  useCase,
  children,
  reversed = false,
}: SectionWrapperProps) {
  const { ref, isInView } = useInView(0.15)

  return (
    <section
      id={useCase.id}
      ref={ref}
      className="relative min-h-screen py-20 md:py-28 overflow-hidden"
    >
      <IslamicPattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-3">
            <span
              className="font-display text-5xl md:text-6xl font-bold"
              style={{ color: `${useCase.color}30` }}
            >
              {useCase.number}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${useCase.color}20` }}
            />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {useCase.title}
          </h2>
          <p
            className="text-sm font-medium tracking-wider uppercase mb-4"
            style={{ color: useCase.color }}
          >
            {useCase.subtitle}
          </p>
          <p className="text-warm-gray max-w-2xl text-base md:text-lg leading-relaxed mb-12">
            {useCase.description}
          </p>
        </motion.div>

        {/* Content grid */}
        <div
          className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
            reversed ? 'direction-rtl' : ''
          }`}
        >
          {/* Animated demo */}
          <motion.div
            className={`rounded-2xl border p-6 md:p-8 min-h-[350px] relative overflow-hidden ${
              reversed ? 'lg:order-2' : ''
            }`}
            style={{
              borderColor: `${useCase.color}20`,
              backgroundColor: 'var(--color-midnight-light)',
            }}
            initial={{ opacity: 0, x: reversed ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {children(isInView)}
          </motion.div>

          {/* Metrics */}
          <div className={reversed ? 'lg:order-1' : ''}>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {useCase.metrics.map((metric, i) => (
                <MetricCard
                  key={metric.label}
                  {...metric}
                  delay={i * 0.15}
                  isInView={isInView}
                  color={useCase.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
