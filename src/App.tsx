import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UseCaseDemo from './components/UseCaseDemo'
import { useCases } from './data/useCases'

import {
  chatMessages as investChat,
  reasoningSteps as investReasoning,
  orchestratorConfig as investOrchestrator,
  VisualPanel as InvestVisual,
} from './components/sections/InvestmentOpportunity'

import {
  chatMessages as urbanChat,
  reasoningSteps as urbanReasoning,
  VisualPanel as UrbanVisual,
} from './components/sections/UrbanPlanning'

import {
  chatMessages as sustainChat,
  reasoningSteps as sustainReasoning,
  orchestratorConfig as sustainOrchestrator,
  VisualPanel as SustainVisual,
} from './components/sections/SustainabilityMonitoring'

import {
  chatMessages as tourismChat,
  reasoningSteps as tourismReasoning,
  VisualPanel as TourismVisual,
} from './components/sections/TourismPersonalization'

import {
  chatMessages as heritageChat,
  reasoningSteps as heritageReasoning,
  VisualPanel as HeritageVisual,
} from './components/sections/HeritageConservation'

import {
  chatMessages as irChat,
  reasoningSteps as irReasoning,
  mcpMessages as irMcp,
  VisualPanel as IRVisual,
} from './components/sections/InvestorRelations'

import {
  chatMessages as econChat,
  reasoningSteps as econReasoning,
  mcpMessages as econMcp,
  VisualPanel as EconVisual,
} from './components/sections/EconomicImpact'

const demoConfigs = [
  { chat: investChat, reasoning: investReasoning, orchestrator: investOrchestrator, Visual: InvestVisual },
  { chat: urbanChat, reasoning: urbanReasoning, Visual: UrbanVisual },
  { chat: sustainChat, reasoning: sustainReasoning, orchestrator: sustainOrchestrator, Visual: SustainVisual },
  { chat: tourismChat, reasoning: tourismReasoning, Visual: TourismVisual },
  { chat: heritageChat, reasoning: heritageReasoning, Visual: HeritageVisual },
  { chat: irChat, reasoning: irReasoning, mcp: irMcp, Visual: IRVisual },
  { chat: econChat, reasoning: econReasoning, mcp: econMcp, Visual: EconVisual },
]

export default function App() {
  const [active, setActive] = useState(0)

  const config = demoConfigs[active]
  const uc = useCases[active]

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar activeIndex={active} onSelect={setActive} />

      <div style={{ paddingTop: 200 }}>
        <AnimatePresence mode="wait">
          <UseCaseDemo
            key={uc.id}
            useCase={uc}
            chat={config.chat}
            reasoning={config.reasoning}
            orchestrator={'orchestrator' in config ? config.orchestrator : undefined}
            mcpMessages={'mcp' in config ? config.mcp : undefined}
            visual={(isActive) => <config.Visual isActive={isActive} />}
            isActive={true}
          />
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}
