import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import ChatSimulation, { type ChatMessage } from './ChatSimulation'
import AgentReasoningTrace, { type TraceStep } from './AgentReasoningTrace'
import MCPToolCall, { type ToolMessage } from './MCPToolCall'
import AgentOrchestrator, {
  type AgentDef,
  type AgentMessage,
} from './AgentOrchestrator'
import MetricCard from './MetricCard'
import type { UseCase } from '../data/useCases'

export interface OrchestratorConfig {
  supervisor: AgentDef
  workers: AgentDef[]
  messages: AgentMessage[]
}

interface UseCaseDemoProps {
  useCase: UseCase
  chat: ChatMessage[]
  reasoning: TraceStep[]
  mcpMessages?: ToolMessage[]
  orchestrator?: OrchestratorConfig
  visual: (isActive: boolean) => ReactNode
  isActive: boolean
}

export default function UseCaseDemo({
  useCase,
  chat,
  reasoning,
  mcpMessages,
  orchestrator,
  visual,
  isActive,
}: UseCaseDemoProps) {
  const Icon = useCase.icon

  return (
    <motion.div
      key={useCase.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-5xl mx-auto px-5 sm:px-8"
    >
      {/* Title */}
      <div className="flex items-center gap-3.5 mb-8">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${useCase.color}12`, border: `1px solid ${useCase.color}20` }}
        >
          <Icon size={20} style={{ color: useCase.color }} />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide mb-0.5" style={{ color: useCase.color }}>
            {useCase.number} — {useCase.subtitle}
          </p>
          <h1 className="font-display text-2xl font-bold text-warm-white leading-tight">
            {useCase.title}
          </h1>
        </div>
      </div>

      {/* Chat */}
      <div className="mb-6">
        <ChatSimulation
          messages={chat}
          isActive={isActive}
          accentColor={useCase.color}
          title={`Shurooq AI \u2014 ${useCase.title.split(' ')[0]} Agent`}
        />
      </div>

      {/* Reasoning */}
      <div className="mb-6 space-y-4">
        {orchestrator && (
          <AgentOrchestrator
            supervisor={orchestrator.supervisor}
            workers={orchestrator.workers}
            messages={orchestrator.messages}
            isInView={isActive}
            accentColor={useCase.color}
          />
        )}

        <AgentReasoningTrace
          steps={reasoning}
          isInView={isActive}
          title="ReAct Trace"
          accentColor={useCase.color}
          maxHeight="420px"
          stepInterval={0}
        />

        {mcpMessages && (
          <MCPToolCall
            messages={mcpMessages}
            isInView={isActive}
            accentColor={useCase.color}
            startDelay={400}
            messageInterval={2000}
          />
        )}
      </div>

      {/* Output */}
      <div
        className="mb-6 rounded-xl border p-6"
        style={{
          borderColor: `${useCase.color}12`,
          backgroundColor: 'var(--color-midnight-light)',
        }}
      >
        {visual(isActive)}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 pb-12">
        {useCase.metrics.map((metric, i) => (
          <MetricCard
            key={metric.label}
            {...metric}
            delay={i * 0.15}
            isInView={isActive}
            color={useCase.color}
          />
        ))}
      </div>
    </motion.div>
  )
}
