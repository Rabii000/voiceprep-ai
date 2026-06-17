import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { PricingSection } from '@/components/landing/PricingSection'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FooterSection } from '@/components/landing/FooterSection'
import { NavBar } from '@/components/landing/NavBar'

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <FeatureShowcase />
      <TestimonialsSection />
      <ComparisonTable />
      <PricingSection />
      <FooterSection />
    </main>
  )
}
