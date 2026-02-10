import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import InvestmentOpportunity from './components/sections/InvestmentOpportunity'
import UrbanPlanning from './components/sections/UrbanPlanning'
import SustainabilityMonitoring from './components/sections/SustainabilityMonitoring'
import TourismPersonalization from './components/sections/TourismPersonalization'
import HeritageConservation from './components/sections/HeritageConservation'
import InvestorRelations from './components/sections/InvestorRelations'
import EconomicImpact from './components/sections/EconomicImpact'

export default function App() {
  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <Hero />
      <InvestmentOpportunity />
      <UrbanPlanning />
      <SustainabilityMonitoring />
      <TourismPersonalization />
      <HeritageConservation />
      <InvestorRelations />
      <EconomicImpact />
      <Footer />
    </div>
  )
}
