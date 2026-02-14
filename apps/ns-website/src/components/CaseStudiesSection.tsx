import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      title: "Global Supply Chain Optimization",
      industry: "Logistics",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop",
      description: "Implemented a real-time tracking and predictive analytics system for a multinational logistics provider."
    },
    {
      title: "Next-Gen Fintech Platform",
      industry: "Finance",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      description: "Developed a secure, high-frequency trading interface with ultra-low latency microservices."
    },
    {
      title: "Smart Manufacturing Hub",
      industry: "Industrial",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
      description: "Digitized an entire factory floor using IoT sensors and machine learning for predictive maintenance."
    },
    {
      title: "E-Commerce Experience",
      industry: "Retail",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
      description: "Rebuilt the digital presence for a global retailer, increasing conversion by 45% through performance tuning."
    },
    {
      title: "Healthcare Data Interop",
      industry: "Healthcare",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop",
      description: "Created a unified data layer for multi-hospital networks to ensure secure patient record sharing."
    },
    {
      title: "Sustainable Energy Grid",
      industry: "Energy",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop",
      description: "Algorithmically optimized power distribution for a regional renewable energy provider."
    }
  ]

  return (
    <section id="case-studies" className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-primary">PORTFOLIO</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-black leading-none tracking-tighter"
            >
              PROVEN <br />
              <span className="text-black/20 uppercase">IMPACT.</span>
            </motion.h2>
          </div>
          <Button variant="outline" className="rounded-none px-12 py-8 font-bold tracking-widest text-[13px] border-black hover:bg-black hover:text-white transition-all">
            VIEW ALL 14 CASE STUDIES
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="group relative overflow-hidden aspect-[4/5] bg-slate-100"
            >
              <ImageWithFallback
                src={study.image}
                alt={study.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">
                  {study.industry}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                  {study.title}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {study.description}
                </p>
                <div className="flex items-center gap-2 text-white font-bold tracking-widest text-[11px] uppercase group-hover:text-primary transition-colors">
                  READ FULL STORY <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Top border animation */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CaseStudiesSection