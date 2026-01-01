import HeroSection from './components/HeroSection'
import HowItWorksSection from './components/HowItWorksSection'
import KeyBenefitsSection from './components/KeyBenefitsSection'
import FeaturedSubjectsSection from './components/FeaturedSubjectsSection'
import TestimonialsSection from './components/TestimonialsSection'

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorksSection />
      <KeyBenefitsSection />
      <TestimonialsSection />
      <FeaturedSubjectsSection />
    </div>
  )
}

export default HomePage