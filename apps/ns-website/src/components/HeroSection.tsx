import { Button } from './ui/button'
import { ArrowRight, Code, Zap, Shield } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { motion } from 'motion/react'

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background with parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1764534161906-f08540a2d333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBza3lzY3JhcGVyJTIwbmlnaHQlMjBibHVlfGVufDF8fHx8MTc3MDExMTIxOXww&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral"
          alt="Modern corporate skyscraper at night"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-4xl space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <span className="inline-block text-primary font-bold tracking-[0.3em] text-[13px] uppercase">
              The Future of Digital Infrastructure
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
              BEYOND <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">TRANSFORMATION.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-light"
          >
            Advanced, business-driven software solutions engineered with deep technical expertise and rigorous system design for the modern enterprise.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Button 
              size="lg" 
              onClick={() => scrollToSection('#services')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-12 py-8 text-base font-bold tracking-[0.1em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 active:translate-y-0"
            >
              EXPLORE SOLUTIONS
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('#contact')}
              className="border-white/20 text-white hover:bg-white hover:text-black rounded-none px-12 py-8 text-base font-bold tracking-[0.1em] backdrop-blur-sm transition-all"
            >
              GET IN TOUCH
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-white/10 hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-white/10 hidden xl:block" />
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
        onClick={() => scrollToSection('#about')}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        <span className="text-white/40 text-[10px] tracking-[0.3em] font-bold">SCROLL</span>
      </motion.div>
    </section>
  )
}

export default HeroSection