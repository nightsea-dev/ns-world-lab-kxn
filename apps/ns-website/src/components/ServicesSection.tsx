import { Card, CardContent } from './ui/card'
import { Code, Cloud, Database, BarChart, Smartphone, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'

const ServicesSection = () => {
  const services = [
    {
      icon: Code,
      title: "Custom Software Development",
      description: "Bespoke enterprise applications tailored to your specific business logic and operational needs.",
      details: ["React / Next.js", "Node.js / Go", "Microservices Architecture"]
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Scalable, secure, and highly available cloud-native architectures optimized for performance.",
      details: ["AWS / Azure / GCP", "Kubernetes", "DevOps & CI/CD"]
    },
    {
      icon: Database,
      title: "Data Engineering",
      description: "Robust data pipelines and storage solutions that turn raw data into actionable insights.",
      details: ["Big Data Analytics", "Data Warehousing", "Real-time Processing"]
    },
    {
      icon: BarChart,
      title: "Digital Strategy",
      description: "Comprehensive roadmaps for digital transformation and technology-led business growth.",
      details: ["Tech Audit", "Modernization Strategy", "Process Optimization"]
    },
    {
      icon: Smartphone,
      title: "Mobile Solutions",
      description: "High-performance native and cross-platform mobile experiences for the modern workforce.",
      details: ["React Native", "iOS / Android", "Enterprise Mobility"]
    },
    {
      icon: ShieldCheck,
      title: "Cybersecurity Services",
      description: "Advanced security protocols and system hardening to protect your critical business assets.",
      details: ["Penetration Testing", "Compliance Audit", "Threat Detection"]
    }
  ]

  return (
    <section id="services" className="py-32 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-primary">CAPABILITIES</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black leading-none tracking-tighter"
            >
              CORE <br />
              <span className="text-white/20 uppercase">Solutions.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-md"
          >
            <p className="text-white/50 text-lg font-light leading-relaxed">
              We provide end-to-end technical excellence, ensuring your enterprise stays at the forefront of innovation with scalable and secure digital infrastructure.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * index }}
              className="group relative bg-[#0a0a0a] p-12 transition-all duration-500 hover:bg-[#111]"
            >
              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-3 pt-4 border-t border-white/5">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-[11px] font-bold tracking-[0.1em] text-white/30 uppercase">
                      <div className="w-1 h-1 bg-primary mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>

              {/* Hover background line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection