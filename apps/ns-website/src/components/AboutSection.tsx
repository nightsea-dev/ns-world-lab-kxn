import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Target, Users, Lightbulb, Award, CheckCircle2 } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { motion } from 'motion/react'

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Technical Excellence",
      description: "Deep enterprise software development experience with cutting-edge technical knowledge."
    },
    {
      icon: Users,
      title: "Business-Driven",
      description: "Technology that serves business objectives, creating solutions that drive measurable impact."
    },
    {
      icon: Lightbulb,
      title: "Rigorous Design",
      description: "Architected with scalability, maintainability, and performance as core principles."
    },
    {
      icon: Award,
      title: "Global Scalability",
      description: "Solutions designed to evolve with your business, supporting long-term transformation."
    }
  ]

  const capabilities = [
    "Enterprise Architecture",
    "Cloud-Native Solutions",
    "Modern Web Technologies",
    "Digital Transformation",
    "System Integration",
    "High-Performance Computing"
  ]

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-primary">WHO WE ARE</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight tracking-tighter"
              >
                ENGINEERING THE <br />
                <span className="text-muted-foreground/30">NEXT GENERATION.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground leading-relaxed font-light"
              >
                We believe that exceptional software is born from the intersection of deep technical expertise and thorough understanding of business needs. Our team of seasoned engineers and solution architects work closely with organizations to transform complex challenges into elegant, scalable solutions.
              </motion.p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
              {capabilities.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold tracking-wide uppercase">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="link" className="p-0 h-auto text-primary font-bold tracking-[0.2em] text-[13px] uppercase hover:gap-4 transition-all">
                LEARN MORE ABOUT OUR PROCESS <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-black/5 -z-10 translate-x-4 translate-y-4" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1697124510316-13efcb2e3abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBsZWFkZXJzaGlwJTIwdGVhbSUyMG1lZXRpbmclMjBsdXh1cnl8ZW58MXx8fHwxNzcwMTExMjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Corporate leadership team meeting"
              className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-12 -left-12 bg-black text-white p-12 max-w-xs hidden xl:block shadow-2xl">
              <span className="text-5xl font-black block mb-2">15+</span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/50">Years of Excellence</span>
              <p className="mt-6 text-sm text-white/70 leading-relaxed font-light">
                Consistently delivering high-impact solutions for Fortune 500 companies globally.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-32">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="space-y-6 group"
            >
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                <value.icon className="h-8 w-8 text-black group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black tracking-tight uppercase">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export default AboutSection