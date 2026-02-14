import { useState } from 'react'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import ResearchSection from './components/ResearchSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'

type Page = 'home' | 'privacy' | 'terms'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const navigateToPage = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const navigateHome = () => {
    setCurrentPage('home')
    window.scrollTo(0, 0)
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={navigateHome} />
  }

  if (currentPage === 'terms') {
    return <TermsOfService onBack={navigateHome} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ResearchSection />
        <CaseStudiesSection />
        <ContactSection />
      </main>
      <Footer onNavigate={navigateToPage} />
    </div>
  )
}