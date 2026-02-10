import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'
import type { OrchestratorConfig } from '../UseCaseDemo'

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Evaluate investment potential of the Al Majaz waterfront mixed-use development.',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'Starting multi-agent analysis on Al Majaz waterfront. I\'ll research market comps, check regulatory status, and run financial scoring. One moment...',
    delay: 3000,
  },
  {
    role: 'assistant',
    content: 'Market research complete: 23 comparable developments found. Avg ROI 18.7%, occupancy 94%. Population growth in the zone is +12% YoY with median income $78K.',
    delay: 6500,
  },
  {
    role: 'user',
    content: 'What about zoning and regulatory risk?',
    delay: 8000,
  },
  {
    role: 'assistant',
    content: 'Zone is approved for mixed-use (height limit 45m, FAR 3.2). Shurooq has 3 active permits with no violations and is eligible for expedited review. Regulatory risk: LOW.',
    delay: 10500,
  },
  {
    role: 'user',
    content: 'Give me the final score and ROI projection.',
    delay: 12000,
  },
  {
    role: 'assistant',
    content: 'Final score: 92/100. Projected IRR: 21.3%, NPV: $12.8M, payback: 4.2 years. Composite risk: 0.28 (LOW). This is a top-tier opportunity with strong demographic tailwinds.',
    delay: 14500,
  },
]

export const reasoningSteps: TraceStep[] = [
  {
    type: 'thinking',
    agent: 'Supervisor',
    content: '"Need to evaluate investment potential of Al Majaz waterfront development..."',
    delay: 600,
  },
  {
    type: 'tool_call',
    agent: 'MarketResearch',
    content: 'search_property_listings(region="Al Majaz", type="mixed-use")',
    delay: 1400,
  },
  {
    type: 'observation',
    content: 'Found 23 comparable developments, avg ROI 18.7%, occupancy 94%',
    delay: 2200,
  },
  {
    type: 'tool_call',
    agent: 'MarketResearch',
    content: 'fetch_demographic_data(zone="Al Majaz", radius_km=5)',
    delay: 3000,
  },
  {
    type: 'observation',
    content: 'Population growth +12% YoY, median income $78K, demand index: HIGH',
    delay: 3800,
  },
  {
    type: 'thinking',
    agent: 'Supervisor',
    content: '"ROI above threshold. Delegating regulatory check..."',
    delay: 4400,
  },
  {
    type: 'tool_call',
    agent: 'Regulatory',
    content: 'query_zoning_laws(zone="Al Majaz", project_type="mixed-use")',
    delay: 5200,
  },
  {
    type: 'observation',
    content: 'Zone approved for mixed-use, height limit 45m, FAR 3.2',
    delay: 6000,
  },
  {
    type: 'tool_call',
    agent: 'Regulatory',
    content: 'check_permits(developer="Shurooq", zone="Al Majaz")',
    delay: 6600,
  },
  {
    type: 'observation',
    content: '3 active permits, no violations, expedited review eligible',
    delay: 7200,
  },
  {
    type: 'tool_call',
    agent: 'Scoring',
    content: 'calculate_roi(capex=45M, revenue_model="mixed-use", horizon=10)',
    delay: 8000,
  },
  {
    type: 'observation',
    content: 'Projected IRR: 21.3%, NPV: $12.8M, payback period: 4.2 years',
    delay: 8800,
  },
  {
    type: 'tool_call',
    agent: 'Scoring',
    content: 'assess_risk(regulatory=LOW, market=MEDIUM, liquidity=LOW)',
    delay: 9400,
  },
  {
    type: 'observation',
    content: 'Composite risk score: 0.28 (LOW), confidence interval: 95%',
    delay: 10000,
  },
  {
    type: 'decision',
    agent: 'Supervisor',
    content: 'Score 92/100 \u2014 Strong investment candidate. High ROI, low regulatory risk, strong demographic tailwinds.',
    delay: 10800,
  },
]

export const orchestratorConfig: OrchestratorConfig = {
  supervisor: { id: 'sup', label: 'Supervisor', role: 'Coordinator', color: '#C5A55A' },
  workers: [
    { id: 'market', label: 'Market Research', role: 'Data Agent', color: '#22B8A6' },
    { id: 'reg', label: 'Regulatory', role: 'Compliance', color: '#1A8A7D' },
    { id: 'score', label: 'Scoring', role: 'Evaluator', color: '#C5A55A' },
  ],
  messages: [
    { from: 'sup', to: 'market', label: 'research Al Majaz', delay: 400 },
    { from: 'market', to: 'sup', label: '23 comps found', delay: 2000 },
    { from: 'sup', to: 'reg', label: 'check zoning', delay: 3500 },
    { from: 'reg', to: 'sup', label: 'approved', delay: 5000 },
    { from: 'sup', to: 'score', label: 'evaluate ROI', delay: 6500 },
    { from: 'score', to: 'sup', label: 'score: 92', delay: 8500 },
  ],
}

const opportunities = [
  { name: 'Al Majaz Waterfront Mixed-Use', score: 92, reason: 'High ROI + low risk' },
  { name: 'Sharjah Book Authority Hub', score: 87, reason: 'Cultural demand surge' },
  { name: 'Muwaileh Smart District', score: 85, reason: 'Tech sector growth' },
]

export function VisualPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-widest text-warm-gray mb-2">
        Top Opportunities
      </div>
      {opportunities.map((opp, i) => (
        <motion.div
          key={opp.name}
          className="flex items-center gap-3 bg-midnight/50 rounded-lg px-3 py-2 border border-gold/10"
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 11 + i * 0.3 }}
        >
          <Star size={12} className="text-gold flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-warm-white truncate">{opp.name}</div>
            <div className="text-[11px] text-warm-gray italic">{opp.reason}</div>
          </div>
          <div className="text-sm font-bold text-gold">{opp.score}</div>
        </motion.div>
      ))}
    </div>
  )
}
