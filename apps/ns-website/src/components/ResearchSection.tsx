import { Card, CardContent } from './ui/card'
import { FlaskConical, Atom, Cpu, Rocket, Globe, Sparkles } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { motion } from 'motion/react'

const ResearchSection = () => {
  const initiatives = [
    {
      icon: Sparkles,
      title: "AI & Neural Networks",
      description: "Exploring the boundaries of generative AI and machine learning for predictive enterprise analytics."
    },
    {
      icon: Atom,
      title: "Quantum Readiness",
      description: "Researching quantum-resistant cryptography and high-complexity algorithm optimization."
    },
    {
      icon: Cpu,
      title: "Edge Intelligence",
      description: "Developing decentralized processing frameworks for low-latency IoT and edge devices."
    }
  ]

  return (
    <section id="research" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-primary">R&D DIVISION</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-none tracking-tighter"
              >
                PUSHING THE <br />
                <span className="text-primary italic">FRONTIER.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground leading-relaxed font-light"
              >
                Our dedicated R&D labs are where future enterprise solutions are born. We invest heavily in emerging technologies to ensure our clients are always two steps ahead of the curve.
              </motion.p>
            </div>

            <div className="space-y-8">
              {initiatives.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-6 items-start group cursor-default"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                    <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black tracking-tight uppercase group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 pointer-events-none" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1569660424259-87e64a80f6fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyGFic3RyYWN0JTIwc2VydmVyJTIwZGF0YSUyMGNlbnRlciUyMGJsdWV8ZW58MXx8fHwxNzcwMTExMjIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Futuristic data center research"
                className="w-full h-[700px] object-cover rounded-none shadow-2xl"
              />
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -right-10 bg-white p-10 shadow-2xl max-w-xs hidden xl:block border-t-4 border-primary">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                    12%
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase">Revenue Reinvestment</span>
                </div>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  We commit a significant portion of our annual revenue to pure research, ensuring technical longevity for our partners.
                </p>
              </div>
            </motion.div>
            
            {/* Background pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:30px_30px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResearchSection