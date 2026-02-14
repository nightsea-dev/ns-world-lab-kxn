import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const ContactSection = () => {
  return (
    <section id="contact" className="py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-primary">GET IN TOUCH</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black leading-none tracking-tighter"
              >
                READY TO <br />
                <span className="text-white/20 uppercase">SCALE?</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/50 leading-relaxed font-light max-w-md"
              >
                Connect with our solution architects to discuss your enterprise's digital roadmap and technical challenges.
              </motion.p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1">Email Us</p>
                  <p className="text-lg font-bold">solutions@enterprise.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1">Call Us</p>
                  <p className="text-lg font-bold">+1 (800) ENTERPRISE</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1">Visit Us</p>
                  <p className="text-lg font-bold">123 Tech Corridor, Silicon Valley, CA</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 lg:p-16 text-black relative"
          >
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase">Full Name</label>
                  <Input placeholder="John Doe" className="border-0 border-b border-black/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase">Email Address</label>
                  <Input type="email" placeholder="john@company.com" className="border-0 border-b border-black/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase">Company</label>
                <Input placeholder="Enterprise Inc." className="border-0 border-b border-black/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase">Your Message</label>
                <Textarea placeholder="How can we help your business?" className="min-h-[150px] border-0 border-b border-black/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent resize-none" />
              </div>
              <Button className="w-full rounded-none py-8 font-black tracking-[0.2em] text-[13px] uppercase hover:gap-6 transition-all">
                SEND INQUIRY <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection