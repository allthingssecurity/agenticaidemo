import {
  TrendingUp,
  Building2,
  Leaf,
  MapPin,
  Landmark,
  Users,
  BarChart3,
} from 'lucide-react'

export interface UseCase {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  icon: typeof TrendingUp
  color: string
  metrics: { label: string; value: string; suffix?: string }[]
}

export const useCases: UseCase[] = [
  {
    id: 'investment',
    number: '01',
    title: 'Investment Opportunity Identification',
    subtitle: 'AI-Powered Market Intelligence',
    description:
      'Multi-agent system that continuously scans global markets, regulatory changes, and demographic trends to surface high-potential investment opportunities across Sharjah\'s key sectors.',
    icon: TrendingUp,
    color: '#C5A55A',
    metrics: [
      { label: 'Opportunities Scored', value: '2,847' },
      { label: 'Avg. ROI Predicted', value: '23', suffix: '%' },
      { label: 'Processing Time', value: '<5', suffix: 'min' },
    ],
  },
  {
    id: 'urban-planning',
    number: '02',
    title: 'Urban Planning Assistant',
    subtitle: 'Intelligent Scenario Modeling',
    description:
      'AI agents that model urban development scenarios, integrating GIS data, traffic patterns, and environmental constraints to optimize land use and infrastructure planning.',
    icon: Building2,
    color: '#1A8A7D',
    metrics: [
      { label: 'Scenarios Modeled', value: '156' },
      { label: 'Planning Efficiency', value: '40', suffix: '%' },
      { label: 'Data Sources', value: '48' },
    ],
  },
  {
    id: 'sustainability',
    number: '03',
    title: 'Sustainability Monitoring',
    subtitle: 'Real-Time Environmental Intelligence',
    description:
      'IoT-connected AI agents that monitor energy, water, and emissions across Shurooq properties, detecting anomalies and triggering automated corrective actions.',
    icon: Leaf,
    color: '#22B8A6',
    metrics: [
      { label: 'Sensors Active', value: '1,240' },
      { label: 'Energy Saved', value: '18', suffix: '%' },
      { label: 'Response Time', value: '<30', suffix: 's' },
    ],
  },
  {
    id: 'tourism',
    number: '04',
    title: 'Tourism Personalization',
    subtitle: 'Conversational Travel Intelligence',
    description:
      'AI concierge that creates hyper-personalized itineraries for Sharjah visitors, understanding cultural preferences, budget constraints, and real-time availability.',
    icon: MapPin,
    color: '#C5A55A',
    metrics: [
      { label: 'Itineraries Generated', value: '12,500' },
      { label: 'Satisfaction Score', value: '4.8', suffix: '/5' },
      { label: 'Languages', value: '12' },
    ],
  },
  {
    id: 'heritage',
    number: '05',
    title: 'Heritage Conservation',
    subtitle: 'AI-Assisted Preservation',
    description:
      'Computer vision and document analysis agents that assess structural integrity, digitize archival records, and generate conservation priority reports for Sharjah\'s heritage sites.',
    icon: Landmark,
    color: '#D4BA78',
    metrics: [
      { label: 'Sites Monitored', value: '67' },
      { label: 'Documents Digitized', value: '45K' },
      { label: 'Issues Detected', value: '234' },
    ],
  },
  {
    id: 'investor-relations',
    number: '06',
    title: 'Investor Relations',
    subtitle: 'Intelligent Stakeholder Engagement',
    description:
      'AI agents that analyze investor sentiment, compose personalized outreach, and track engagement metrics to strengthen Shurooq\'s investor relationships.',
    icon: Users,
    color: '#1A8A7D',
    metrics: [
      { label: 'Investors Tracked', value: '340' },
      { label: 'Engagement Rate', value: '67', suffix: '%' },
      { label: 'Response Time', value: '<2', suffix: 'hr' },
    ],
  },
  {
    id: 'economic-impact',
    number: '07',
    title: 'Economic Impact Modeling',
    subtitle: 'Predictive Policy Intelligence',
    description:
      'Multi-scenario economic simulation agents that forecast the impact of policy changes, infrastructure investments, and market shifts on Sharjah\'s economic indicators.',
    icon: BarChart3,
    color: '#C5A55A',
    metrics: [
      { label: 'Scenarios Simulated', value: '890' },
      { label: 'Accuracy Rate', value: '94', suffix: '%' },
      { label: 'Variables Tracked', value: '200+' },
    ],
  },
]
