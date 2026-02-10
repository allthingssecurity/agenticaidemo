import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'
import type { ToolMessage } from '../MCPToolCall'

const baselineData = [30, 32, 34, 35, 37, 38, 40, 41, 42, 43, 44, 45]
const optimisticData = [30, 33, 37, 42, 48, 55, 61, 68, 74, 80, 86, 92]
const conservativeData = [30, 31, 33, 34, 36, 37, 39, 40, 42, 43, 45, 47]

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Run a 12-year economic forecast for the infrastructure investment scenario.',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'Launching three simulation agents: MacroEcon (GDP), LaborMarket (jobs), and FDI (foreign investment). Running models now...',
    delay: 2500,
  },
  {
    role: 'assistant',
    content: 'GDP model complete: +8.2% optimistic, +3.1% conservative. Infrastructure multiplier: 1.7x. LaborMarket: 45K jobs optimistic, 18K conservative.',
    delay: 5000,
  },
  {
    role: 'user',
    content: 'What about foreign investment projections?',
    delay: 6500,
  },
  {
    role: 'assistant',
    content: 'FDI inflow: $2.4B optimistic, $1.1B conservative. Free zone policy adds +$0.8B. Tax incentives attract tech sector (+$0.4B).',
    delay: 8500,
  },
  {
    role: 'user',
    content: 'Combine all models and give me the ensemble forecast.',
    delay: 10000,
  },
  {
    role: 'assistant',
    content: 'Bayesian ensemble complete (94% confidence). Key driver: tourism revenue (+42%). Primary risk: global downturn could reduce FDI by 40%. Carbon reduction: -28% in optimistic scenario. See chart and comparison table below.',
    delay: 13000,
  },
]

export const reasoningSteps: TraceStep[] = [
  {
    type: 'tool_call',
    agent: 'MacroEcon',
    content: 'run_gdp_model(scenario="infrastructure_investment", horizon=12)',
    delay: 500,
  },
  {
    type: 'observation',
    content: 'GDP growth: +8.2% (optimistic), +3.1% (conservative). Multiplier: 1.7x.',
    delay: 1300,
  },
  {
    type: 'tool_call',
    agent: 'LaborMarket',
    content: 'simulate_employment(sectors=["tourism","tech","construction"])',
    delay: 2100,
  },
  {
    type: 'observation',
    content: 'Job creation: 45K (optimistic), 18K (conservative). Tech: +12K, Tourism: +20K.',
    delay: 2900,
  },
  {
    type: 'tool_call',
    agent: 'FDI',
    content: 'project_foreign_investment(policy_changes=["free_zone","tax_incentive"])',
    delay: 3700,
  },
  {
    type: 'observation',
    content: 'FDI inflow: $2.4B (optimistic), $1.1B (conservative). Free zone effect: +$0.8B.',
    delay: 4500,
  },
  {
    type: 'thinking',
    agent: 'Synthesis',
    content: '"All three models converge on positive outlook. Infrastructure investment has 1.7x multiplier..."',
    delay: 5300,
  },
  {
    type: 'tool_call',
    agent: 'Synthesis',
    content: 'combine_forecasts(models=["macro","labor","fdi"], method="bayesian_ensemble")',
    delay: 6100,
  },
  {
    type: 'observation',
    content: 'Ensemble confidence: 94%. Key driver: tourism revenue (+42% optimistic). Risk: global downturn.',
    delay: 6900,
  },
  {
    type: 'decision',
    agent: 'Synthesis',
    content: 'Forecast complete: 12-year projection across 5 metrics. Optimistic scenario has 94% model agreement.',
    delay: 7700,
  },
]

export const mcpMessages: ToolMessage[] = [
  {
    direction: 'request',
    tool: 'run_gdp_model',
    params: { scenario: 'infrastructure', years: 12 },
    latency: '342ms',
  },
  {
    direction: 'response',
    tool: 'run_gdp_model',
    result: { optimistic: '+8.2%', conservative: '+3.1%' },
    latency: '342ms',
  },
  {
    direction: 'request',
    tool: 'bayesian_ensemble',
    params: { models: 3, confidence: 0.94 },
    latency: '187ms',
  },
  {
    direction: 'response',
    tool: 'bayesian_ensemble',
    result: { accuracy: '94%', scenarios: 2 },
    latency: '187ms',
  },
]

const comparisonRows = [
  { metric: 'GDP Growth', optimistic: '+8.2%', conservative: '+3.1%', baseline: '+2.5%', agent: 'MacroEcon' },
  { metric: 'Job Creation', optimistic: '45,000', conservative: '18,000', baseline: '12,000', agent: 'LaborMarket' },
  { metric: 'FDI Inflow', optimistic: '$2.4B', conservative: '$1.1B', baseline: '$0.8B', agent: 'FDI' },
  { metric: 'Tourism Revenue', optimistic: '+42%', conservative: '+15%', baseline: '+8%', agent: 'MacroEcon' },
  { metric: 'Carbon Reduction', optimistic: '-28%', conservative: '-12%', baseline: '-5%', agent: 'Synthesis' },
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

export function VisualPanel({ isActive }: { isActive: boolean }) {
  const [showTable, setShowTable] = useState(false)
  const [visibleRows, setVisibleRows] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setShowTable(true), 8500))
    comparisonRows.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleRows(i + 1), 9000 + i * 300))
    })

    return () => timers.forEach(clearTimeout)
  }, [isActive])

  const chartW = 300
  const chartH = 100

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="bg-midnight/50 rounded-xl border border-gold/10 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-warm-gray">
            12-Year Economic Forecast
          </span>
        </div>
        <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full">
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

          <motion.path
            d={dataToPath(baselineData, chartW, chartH)}
            fill="none"
            stroke="#B8B0A4"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity={0}
            animate={isActive ? { opacity: 0.5 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
          />

          <motion.path
            d={dataToArea(optimisticData, chartW, chartH)}
            fill="#C5A55A"
            opacity={0}
            animate={isActive ? { opacity: 0.1 } : {}}
            transition={{ delay: 1, duration: 1 }}
          />
          <motion.path
            d={dataToPath(optimisticData, chartW, chartH)}
            fill="none"
            stroke="#C5A55A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset={600}
            animate={isActive ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 0.5, duration: 2, ease: 'easeInOut' }}
          />

          <motion.path
            d={dataToArea(conservativeData, chartW, chartH)}
            fill="#1A8A7D"
            opacity={0}
            animate={isActive ? { opacity: 0.1 } : {}}
            transition={{ delay: 1, duration: 1 }}
          />
          <motion.path
            d={dataToPath(conservativeData, chartW, chartH)}
            fill="none"
            stroke="#1A8A7D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset={600}
            animate={isActive ? { strokeDashoffset: 0 } : {}}
            transition={{ delay: 0.5, duration: 2, ease: 'easeInOut' }}
          />

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
              <span className="text-[11px] text-warm-gray">{item.label}</span>
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
          <div className="grid grid-cols-5 text-[11px] uppercase tracking-wider text-warm-gray px-3 py-2 border-b border-gold/10 bg-gold/5">
            <span>Metric</span>
            <span className="text-center">Optimistic</span>
            <span className="text-center">Conservative</span>
            <span className="text-center">Baseline</span>
            <span className="text-center">Agent</span>
          </div>
          {comparisonRows.slice(0, visibleRows).map((row, i) => (
            <motion.div
              key={row.metric}
              className="grid grid-cols-5 px-3 py-1.5 border-b border-white/5 text-[10px]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-warm-white">{row.metric}</span>
              <span className="text-center text-gold font-medium flex items-center justify-center gap-0.5">
                {row.optimistic}
                <ArrowUpRight size={8} />
              </span>
              <span className="text-center text-teal flex items-center justify-center gap-0.5">
                {row.conservative}
                <ArrowUpRight size={8} />
              </span>
              <span className="text-center text-warm-gray flex items-center justify-center gap-0.5">
                {row.baseline}
                <ArrowDownRight size={8} className="opacity-50" />
              </span>
              <span className="text-center text-teal-light text-[11px] italic">
                {row.agent}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
