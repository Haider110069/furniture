"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useState } from "react"
import { SITE, fullAddressInline } from "@/lib/site-config"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = encodeURIComponent(`From: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)
    window.location.href = `mailto:${SITE.supportEmail}?subject=${encodeURIComponent(formData.subject)}&body=${body}`
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit us",
      details: [SITE.addressLines[0], SITE.addressLines[1], `${SITE.city}, ${SITE.country}`],
    },
    {
      icon: Phone,
      title: "Call us",
      details: [SITE.phoneInternational, `Retail: ${SITE.hoursWeekday}`],
    },
    {
      icon: Mail,
      title: "Email",
      details: [SITE.email, SITE.supportEmail],
    },
    {
      icon: Clock,
      title: "Hours",
      details: [SITE.hoursWeekday, SITE.hoursSunday],
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-secondary text-secondary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Contact Us</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto text-pretty">
            Serving Karachi today—message us about stock, finishes, delivery to your area, or a custom quotation.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl border border-border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-base"
                >
                  Open email to send
                </Button>
                <p className="text-xs text-muted-foreground">
                  Opens your mail app addressed to {SITE.supportEmail}. You can also WhatsApp-call {SITE.phoneInternational}.
                </p>
              </form>
            </div>

            <div className="rounded-2xl overflow-hidden bg-card border border-border">
              <iframe
                src="https://maps.google.com/maps?q=Clifton+Karachi+Pakistan&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "500px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${SITE.storeName} — ${fullAddressInline()}`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "How long does Karachi delivery take?",
                a: "Typically 2–5 business days once the item is confirmed in stock. We call before dispatch.",
              },
              {
                q: "Can I pay with JazzCash or EasyPaisa?",
                a: "Yes—select your wallet at checkout and enter your registered mobile wallet number.",
              },
              {
                q: "Do you ship outside Karachi?",
                a: "Yes for many regions. Rates and ETA depend on your city—contact us with your postal area.",
              },
              {
                q: "What is cash on delivery?",
                a: "Pay the courier or our team when furniture arrives—have exact change ready if possible.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
