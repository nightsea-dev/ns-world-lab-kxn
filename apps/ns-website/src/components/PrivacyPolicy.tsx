import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

interface PrivacyPolicyProps {
  onBack: () => void
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">Privacy <span className="text-black/20">Policy.</span></h1>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            Effective Date: February 3, 2026
          </p>
        </header>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">1. Introduction</h2>
            <p>
              Enterprise Solutions ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">2. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest uppercase text-primary">2.1 Information You Provide</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Contact information (name, email address, phone number)</li>
                <li>Company information (company name, job title, industry)</li>
                <li>Project requirements and specifications</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-sm font-bold tracking-widest uppercase text-primary mt-8">2.2 Information Automatically Collected</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website or source</li>
                <li>Device information and operating system</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Providing and improving our software development services</li>
              <li>Responding to inquiries and providing customer support</li>
              <li>Sending relevant updates about our services and industry insights</li>
              <li>Analyzing website usage to improve user experience</li>
              <li>Complying with legal obligations and protecting our rights</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication procedures</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight uppercase">5. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-slate-50 p-12 border-l-4 border-primary">
              <p className="font-black text-lg uppercase tracking-tight mb-4">Enterprise Solutions</p>
              <p className="space-y-1">
                Email: privacy@enterprisesolutions.com<br />
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