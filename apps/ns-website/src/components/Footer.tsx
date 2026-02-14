import { Linkedin, Twitter, Github, Mail } from 'lucide-react'

interface FooterProps {
  onNavigate: (page: 'home' | 'privacy' | 'terms') => void
}

const Footer = ({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { name: "Custom Development", href: "#services" },
        { name: "Cloud Strategy", href: "#services" },
        { name: "Data Engineering", href: "#services" },
        { name: "Digital Strategy", href: "#services" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Our R&D", href: "#research" },
        { name: "Case Studies", href: "#case-studies" },
        { name: "Careers", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Tech Blog", href: "#" },
        { name: "Security Whitepaper", href: "#" },
        { name: "System Status", href: "#" }
      ]
    }
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="col-span-2 lg:col-span-4 space-y-8">
            <button 
              onClick={() => {
                onNavigate('home')
                scrollToSection('#home')
              }}
              className="text-2xl font-black tracking-tighter text-black"
            >
              ENTERPRISE<span className="font-light">SOLUTIONS</span>
            </button>
            <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-sm">
              Architecting the digital foundation for global enterprises. We bridge the gap between complex technical possibilities and strategic business results.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((group, idx) => (
            <div key={idx} className="lg:col-span-2 space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-black">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 space-y-6">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-black">Newsletter</h4>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Insights from our R&D labs delivered monthly.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Work Email" 
                className="bg-slate-50 border-0 rounded-none px-4 py-3 text-sm flex-grow focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <button className="bg-black text-white px-6 py-3 font-bold text-[11px] tracking-widest uppercase hover:bg-primary transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
            © {currentYear} ENTERPRISE SOLUTIONS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-10">
            <button 
              onClick={() => onNavigate('privacy')}
              className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground uppercase hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onNavigate('terms')}
              className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground uppercase hover:text-primary transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer