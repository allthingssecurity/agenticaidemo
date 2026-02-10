import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import type { ChatMessage } from '../ChatSimulation'
import type { TraceStep } from '../AgentReasoningTrace'
import type { OrchestratorConfig } from '../UseCaseDemo'

export const chatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Run diagnostics on today\'s sensor readings for Zone B3.',
    delay: 400,
  },
  {
    role: 'assistant',
    content: 'Reading sensor batch for Zone B3... Energy: 72kWh, HVAC: 91%, Temp: 24\u00B0C, CO\u2082: 38ppm.',
    delay: 2500,
  },
  {
    role: 'assistant',
    content: 'ANOMALY DETECTED: HVAC efficiency at 91% is 6.2% below the 97% baseline. Exceeds our 5% threshold. Running root cause analysis...',
    delay: 4500,
  },
  {
    role: 'user',
    content: 'What\'s causing the drop?',
    delay: 6000,
  },
  {
    role: 'assistant',
    content: 'Root cause identified: filter replacement overdue by 17 days + compressor bearing vibration up 15% (wear index 0.73). Not critical yet but trending toward failure.',
    delay: 8500,
  },
  {
    role: 'user',
    content: 'Take corrective action automatically.',
    delay: 9500,
  },
  {
    role: 'assistant',
    content: 'Done. Three actions taken: (1) Maintenance ticket #MT-2847 created (HIGH priority), (2) Cooling load reduced 15% for 48h (saves 28kWh), (3) Facilities team notified via Slack. ETA fix: 24h.',
    delay: 12000,
  },
]

export const reasoningSteps: TraceStep[] = [
  {
    type: 'tool_call',
    agent: 'Sensor',
    content: 'read_sensor_batch(zone="B3", sensors=["energy","hvac","temp","co2"])',
    delay: 500,
  },
  {
    type: 'observation',
    content: 'Energy: 72kWh | HVAC: 91% | Temp: 24\u00B0C | CO\u2082: 38ppm',
    delay: 1300,
  },
  {
    type: 'thinking',
    agent: 'Anomaly',
    content: '"HVAC at 91% vs 97% baseline = -6.2% deviation. Exceeds threshold of 5%..."',
    delay: 2000,
  },
  {
    type: 'error',
    agent: 'Anomaly',
    content: 'ANOMALY DETECTED: HVAC Zone B3 efficiency drop -6.2% below baseline',
    delay: 2800,
  },
  {
    type: 'tool_call',
    agent: 'Diagnostic',
    content: 'query_maintenance_history(unit="HVAC-B3", days=90)',
    delay: 3600,
  },
  {
    type: 'observation',
    content: 'Last service: 47 days ago. Filter replacement overdue by 17 days.',
    delay: 4400,
  },
  {
    type: 'tool_call',
    agent: 'Diagnostic',
    content: 'check_component_wear(unit="HVAC-B3", component="compressor")',
    delay: 5000,
  },
  {
    type: 'observation',
    content: 'Compressor cycles: 12,847 (wear index: 0.73). Bearing vibration +15%.',
    delay: 5800,
  },
  {
    type: 'thinking',
    agent: 'Diagnostic',
    content: '"Root cause: overdue filter + bearing wear. Not critical yet but trending."',
    delay: 6400,
  },
  {
    type: 'tool_call',
    agent: 'Action',
    content: 'create_ticket(priority="HIGH", unit="HVAC-B3", type="preventive")',
    delay: 7200,
  },
  {
    type: 'observation',
    content: 'Ticket #MT-2847 created. Assigned to facilities team.',
    delay: 7800,
  },
  {
    type: 'tool_call',
    agent: 'Action',
    content: 'adjust_schedule(zone="B3", reduce_load=15, duration_hours=48)',
    delay: 8400,
  },
  {
    type: 'observation',
    content: 'Cooling schedule adjusted: -15% load for 48h. Est. savings: 28kWh.',
    delay: 9000,
  },
  {
    type: 'tool_call',
    agent: 'Action',
    content: 'notify_facilities(channel="slack", urgency="high", ticket="MT-2847")',
    delay: 9600,
  },
  {
    type: 'decision',
    agent: 'Action',
    content: 'Corrective actions complete: ticket created, load reduced, team notified. ETA fix: 24h.',
    delay: 10400,
  },
]

export const orchestratorConfig: OrchestratorConfig = {
  supervisor: { id: 'sensor', label: 'Sensor Agent', role: 'IoT Reader', color: '#22B8A6' },
  workers: [
    { id: 'anomaly', label: 'Anomaly', role: 'Detector', color: '#ef4444' },
    { id: 'diagnostic', label: 'Diagnostic', role: 'Root Cause', color: '#C5A55A' },
    { id: 'action', label: 'Action', role: 'Responder', color: '#22B8A6' },
  ],
  messages: [
    { from: 'sensor', to: 'anomaly', label: 'sensor batch', delay: 300 },
    { from: 'anomaly', to: 'diagnostic', label: 'HVAC anomaly!', delay: 2000 },
    { from: 'diagnostic', to: 'action', label: 'filter overdue', delay: 4500 },
    { from: 'action', to: 'sensor', label: 'resolved', delay: 7500 },
  ],
}

export function VisualPanel({ isActive }: { isActive: boolean }) {
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (!isActive) return
    const timer = setTimeout(() => setShowAlert(true), 2800)
    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div className="space-y-3">
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
              Efficiency at 91% &mdash; 6.2% below baseline. Autonomous response pipeline activated.
            </div>
          </div>
        </motion.div>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Ticket Created', value: '#MT-2847', status: 'done' },
          { label: 'Load Reduced', value: '-15%', status: 'done' },
          { label: 'Team Notified', value: 'Slack', status: 'done' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="bg-midnight/50 rounded-lg p-2 border border-teal/10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={showAlert ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.2 }}
          >
            <div className="text-[11px] text-warm-gray">{item.label}</div>
            <div className="text-xs text-teal-light font-medium mt-0.5">{item.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
