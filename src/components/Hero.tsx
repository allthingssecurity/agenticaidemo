import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function HeroPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C5A55A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0A1628" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="heroGrid"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0L80 20L80 60L40 80L0 60L0 20Z"
            fill="none"
            stroke="#C5A55A"
            strokeWidth="0.3"
            opacity="0.15"
          />
          <circle
            cx="40"
            cy="40"
            r="4"
            fill="none"
            stroke="#C5A55A"
            strokeWidth="0.3"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#heroGlow)" />
      <rect width="100%" height="100%" fill="url(#heroGrid)" />
    </svg>
  )
}

const nodes = [
  { x: '15%', y: '20%', delay: 0.5, size: 6 },
  { x: '80%', y: '15%', delay: 0.8, size: 8 },
  { x: '25%', y: '65%', delay: 1.1, size: 5 },
  { x: '70%', y: '60%', delay: 1.4, size: 7 },
  { x: '50%', y: '35%', delay: 0.3, size: 10 },
  { x: '90%', y: '40%', delay: 1.7, size: 4 },
  { x: '10%', y: '45%', delay: 2.0, size: 5 },
]

export default function Hero() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
      <HeroPattern />

      {/* Floating agent nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/20 border border-gold/30"
          style={{
            left: node.x,
            top: node.y,
            width: node.size * 2,
            height: node.size * 2,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3],
            scale: [0, 1, 0.8],
            y: [0, -10, 0],
          }}
          transition={{
            delay: node.delay,
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          [0, 4],
          [1, 4],
          [2, 4],
          [3, 4],
          [4, 5],
          [4, 6],
        ].map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#C5A55A"
            strokeWidth="0.5"
            opacity={0}
            animate={{ opacity: [0, 0.15, 0.05] }}
            transition={{
              delay: 1 + i * 0.2,
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </svg>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles size={14} className="text-gold" />
          <span className="text-xs font-medium text-gold tracking-wider uppercase">
            7 Agentic AI Use Cases
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="text-warm-white">Intelligent </span>
          <span className="text-gold">Investment</span>
          <br />
          <span className="text-warm-white">& Urban </span>
          <span className="text-teal">Innovation</span>
        </motion.h1>

        <motion.p
          className="text-warm-gray text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Watch multi-agent AI reason, debate, and act &mdash; with visible tool calls,
          chain-of-thought traces, and autonomous decision-making across Sharjah&apos;s
          investment, urban planning, and sustainability initiatives.
        </motion.p>
      </div>
    </section>
  )
}
