import { motion } from 'framer-motion'

interface FlowLine {
  x1: number
  y1: number
  x2: number
  y2: number
  delay?: number
}

interface AnimatedFlowProps {
  lines: FlowLine[]
  isInView: boolean
  color?: string
  width?: number
  height?: number
}

export default function AnimatedFlow({
  lines,
  isInView,
  color = '#C5A55A',
  width = 400,
  height = 200,
}: AnimatedFlowProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      {lines.map((line, i) => {
        const length = Math.sqrt(
          (line.x2 - line.x1) ** 2 + (line.y2 - line.y1) ** 2
        )
        return (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray={length}
            strokeDashoffset={length}
            opacity={0.5}
            animate={
              isInView
                ? { strokeDashoffset: 0, opacity: 0.5 }
                : { strokeDashoffset: length, opacity: 0 }
            }
            transition={{
              delay: line.delay ?? i * 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }}
          />
        )
      })}
      {/* Animated particles along lines */}
      {isInView &&
        lines.map((line, i) => (
          <motion.circle
            key={`particle-${i}`}
            r={3}
            fill={color}
            opacity={0}
            animate={{
              cx: [line.x1, line.x2],
              cy: [line.y1, line.y2],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              delay: (line.delay ?? i * 0.3) + 0.8,
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
          />
        ))}
    </svg>
  )
}
