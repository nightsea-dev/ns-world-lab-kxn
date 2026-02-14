import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

interface TermsOfServiceProps {
  onBack: () => void
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-white text-black font-light leading-relaxed">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Button
          variant="link"
          onClick={onBack}
          className="mb-16 p-0 h-auto text-[11px] font-black tracking-[0.2em] uppercase text-primary hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <header className="mb-20 space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">Terms of <span className="text-black/20">Service.</span></h1>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            Effective Date: February 3, 2026
          </p>
        </header>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services provided by Enterprise Solutions ("Company," "we," "our," or "us"), you ("Client," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">2. Description of Services</h2>
            <p>
              Enterprise Solutions provides custom software development, digital transformation consulting, system integration, and related technology services ("Services") to business clients. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Custom software development and application design</li>
              <li>System architecture and technical consulting</li>
              <li>Digital transformation strategy and implementation</li>
              <li>Legacy system modernization and integration</li>
              <li>Research and development services</li>
              <li>Ongoing maintenance and support</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">3. Service Agreements</h2>
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest uppercase text-primary">3.1 Project Scope</h3>
              <p>
                Each project will be governed by a separate Service Agreement that outlines specific deliverables, timelines, payment terms, and project requirements. These Terms of Service apply to all projects unless specifically modified in writing.
              </p>

              <h3 className="text-sm font-bold tracking-widest uppercase text-primary mt-8">3.2 Changes to Scope</h3>
              <p>
                Any changes to the agreed project scope must be documented in writing and may result in adjustments to timeline and pricing. We will provide estimates for scope changes before implementation.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">4. Payment Terms</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Payment terms will be specified in individual Service Agreements</li>
              <li>Invoices are typically issued monthly or upon milestone completion</li>
              <li>Payment is due within 30 days of invoice date unless otherwise specified</li>
              <li>Late payments may incur interest charges at 1.5% per month</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">5. Intellectual Property Rights</h2>
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest uppercase text-primary">5.1 Client-Owned IP</h3>
              <p>
                Client retains ownership of all pre-existing intellectual property and any custom developments specifically created for Client, subject to full payment of fees.
              </p>

              <h3 className="text-sm font-bold tracking-widest uppercase text-primary mt-8">5.2 Company-Owned IP</h3>
              <p>
                We retain ownership of our proprietary methodologies, frameworks, tools, and general knowledge developed independently or prior to engagement.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">6. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-slate-50 p-12 border-l-4 border-primary">
              <p className="font-black text-lg uppercase tracking-tight mb-4">Enterprise Solutions</p>
              <p className="space-y-1">
                Email: legal@enterprisesolutions.com<br />
                Phone: +1 (800) ENTERPRISE<br />
                Address: 123 Tech Corridor, Silicon Valley, CA
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}