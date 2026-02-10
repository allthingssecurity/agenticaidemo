import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'
import type { ToolMessage } from '../MCPToolCall'

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Prepare a personalized outreach email for ADIA Partners \u2014 their sentiment has been declining.',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'Analyzing ADIA sentiment... 12 emails scanned, 2 negative news mentions found, 3 unanswered follow-ups detected. Current sentiment score: 58/100 (declining).',
    delay: 3500,
  },
  {
    role: 'user',
    content: 'What\'s driving the decline?',
    delay: 5000,
  },
  {
    role: 'assistant',
    content: 'Three factors: (1) unanswered follow-ups from last 2 weeks, (2) negative press about "ADIA reviewing Gulf investments," and (3) meeting notes show concern about timeline delays.',
    delay: 7500,
  },
  {
    role: 'user',
    content: 'Draft an email that addresses these concerns. Make it data-driven \u2014 that\'s their preference.',
    delay: 9000,
  },
  {
    role: 'assistant',
    content: 'Pulling investor profile: Mr. Al Rashid, focus on sustainability and long-term ROI. Fetching Q4 performance data...',
    delay: 10500,
  },
  {
    role: 'assistant',
    content: 'Email drafted. Leads with Q4 outperformance (+12% vs benchmark), highlights sustainability ROI (+18% YoY), and directly addresses timeline with updated milestones. Generating the email below...',
    delay: 13000,
  },
]

export const reasoningSteps: TraceStep[] = [
  {
    type: 'tool_call',
    agent: 'Sentiment',
    content: 'analyze_emails(investor="ADIA Partners", days=30)',
    delay: 500,
  },
  {
    type: 'observation',
    content: '12 emails analyzed. Tone: neutral\u2192negative trend. 3 unanswered follow-ups.',
    delay: 1300,
  },
  {
    type: 'tool_call',
    agent: 'Sentiment',
    content: 'scan_news_mentions(entity="ADIA", sentiment=true)',
    delay: 2000,
  },
  {
    type: 'observation',
    content: '2 negative mentions: "ADIA reviewing Gulf investments amid market correction"',
    delay: 2800,
  },
  {
    type: 'tool_call',
    agent: 'Sentiment',
    content: 'check_meeting_notes(investor="ADIA", last_n=5)',
    delay: 3400,
  },
  {
    type: 'observation',
    content: 'Last meeting: 14 days ago. Notes: "expressed concern about timeline delays"',
    delay: 4200,
  },
  {
    type: 'thinking',
    agent: 'Sentiment',
    content: '"Sentiment declining \u2014 3 unanswered follow-ups, negative news, timeline concerns. Score: 58/100."',
    delay: 5000,
  },
  {
    type: 'tool_call',
    agent: 'Composer',
    content: 'get_investor_profile(id="ADIA", include_preferences=true)',
    delay: 5800,
  },
  {
    type: 'observation',
    content: 'Focus: sustainability, long-term ROI. Prefers data-driven updates. Key contact: Mr. Al Rashid.',
    delay: 6600,
  },
  {
    type: 'tool_call',
    agent: 'Composer',
    content: 'fetch_portfolio_performance(fund="Shurooq-Growth", period="Q4")',
    delay: 7200,
  },
  {
    type: 'observation',
    content: 'Q4 returns: +12% vs benchmark. Sustainable tourism initiative: +18% YoY.',
    delay: 8000,
  },
  {
    type: 'thinking',
    agent: 'Composer',
    content: '"Investor interested in sustainability \u2192 highlight green initiatives. Address timeline concern directly."',
    delay: 8800,
  },
  {
    type: 'decision',
    agent: 'Composer',
    content: 'Email drafted: leads with Q4 outperformance, highlights sustainability ROI, addresses timeline with updated milestones.',
    delay: 9800,
  },
]

export const mcpMessages: ToolMessage[] = [
  {
    direction: 'request',
    tool: 'analyze_sentiment',
    params: { investor: 'ADIA', window: '30d' },
    latency: '124ms',
  },
  {
    direction: 'response',
    tool: 'analyze_sentiment',
    result: { score: 58, trend: 'declining', alerts: 3 },
    latency: '124ms',
  },
  {
    direction: 'request',
    tool: 'compose_email',
    params: { investor: 'ADIA', tone: 'reassuring' },
    latency: '89ms',
  },
  {
    direction: 'response',
    tool: 'compose_email',
    result: { paragraphs: 4, personalized: true },
    latency: '89ms',
  },
]

const emailLines = [
  'Dear Mr. Al Rashid,',
  '',
  'Following our productive meeting at the Sharjah Investment Forum,',
  'I wanted to share our latest portfolio performance report.',
  '',
  'Key highlights:',
  '\u2022 Q4 returns exceeded projections by 12%',
  '\u2022 New sustainable tourism initiative: +18% YoY',
  '\u2022 Heritage district expansion: revised timeline attached',
  '',
  'I understand your concerns regarding project timelines \u2014 please',
  'find the updated milestone schedule enclosed.',
]

export function VisualPanel({ isActive }: { isActive: boolean }) {
  const [typedLines, setTypedLines] = useState(0)
  const [showEmail, setShowEmail] = useState(false)

  useEffect(() => {
    if (!isActive) return
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setShowEmail(true), 9000))

    emailLines.forEach((_, i) => {
      timers.push(setTimeout(() => setTypedLines(i + 1), 9500 + i * 250))
    })

    return () => timers.forEach(clearTimeout)
  }, [isActive])

  if (!showEmail) return null

  return (
    <motion.div
      className="bg-midnight/50 rounded-xl border border-teal/10 overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-3 py-2 border-b border-teal/10 flex items-center gap-2">
        <Mail size={12} className="text-teal-light" />
        <span className="text-[10px] text-warm-gray">
          AI-Generated Outreach &mdash; ADIA Partners
        </span>
        <motion.div
          className="ml-auto w-1.5 h-1.5 rounded-full bg-teal"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <div className="p-3 font-mono text-[10px] text-warm-gray/80 leading-relaxed min-h-[100px]">
        {emailLines.slice(0, typedLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={line === '' ? 'h-2.5' : ''}
          >
            {line}
          </motion.div>
        ))}
        {typedLines < emailLines.length && typedLines > 0 && (
          <motion.span
            className="inline-block w-1.5 h-3 bg-teal-light ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  )
}
