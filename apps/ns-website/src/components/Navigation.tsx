import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'SERVICES', href: '#services' },
    { name: 'R&D', href: '#research' },
    { name: 'CASE STUDIES', href: '#case-studies' },
    { name: 'CONTACT', href: '#contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-background/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => scrollToSection('#home')}
              className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
            >
              ENTERPRISE<span className="font-light">SOLUTIONS</span>
            </button>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12">
            <div className="flex items-center space-x-10">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-[13px] font-bold tracking-[0.1em] transition-all duration-300 relative group ${
                    scrolled ? 'text-foreground hover:text-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-2 left-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full`} />
                </button>
              ))}
            </div>
            <Button 
              className={`rounded-none px-8 py-6 font-bold tracking-widest text-[13px] transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 ${
                scrolled 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              REQUEST A DEMO
            </Button>
          </div>
          
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={scrolled ? 'text-foreground' : 'text-white'}
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-2xl lg:hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:text-primary block text-xl font-bold tracking-tight transition-colors duration-200 w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              <Button className="w-full rounded-none py-6 font-bold tracking-widest">
                REQUEST A DEMO
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation