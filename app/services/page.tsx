import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sofa, Paintbrush, Ruler, Truck, Wrench, Lightbulb } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Sofa,
      title: "Custom Furniture",
      description: "Bespoke furniture pieces designed and crafted to your exact specifications and preferences.",
    },
    {
      icon: Paintbrush,
      title: "Interior Styling",
      description: "Expert styling services to create cohesive, beautiful spaces that reflect your personality.",
    },
    {
      icon: Ruler,
      title: "Space Planning",
      description: "Optimize your living spaces with professional layout and arrangement consultations.",
    },
    {
      icon: Truck,
      title: "Delivery & Setup",
      description: "White-glove delivery service with professional assembly and placement in your home.",
    },
    {
      icon: Wrench,
      title: "Restoration",
      description: "Breathe new life into your beloved furniture with our expert restoration services.",
    },
    {
      icon: Lightbulb,
      title: "Design Consultation",
      description: "One-on-one sessions with our designers to bring your vision to life.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Our Services</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto text-pretty">
            From design to delivery, we offer comprehensive services to transform your space.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How We Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures a seamless experience from start to finish.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Share your vision and requirements with our team" },
              { step: "02", title: "Design", desc: "We create detailed plans and 3D visualizations" },
              { step: "03", title: "Production", desc: "Expert craftsmen bring designs to life" },
              { step: "04", title: "Delivery", desc: "Professional setup in your home" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=500&fit=crop"
              alt="Interior design consultation"
              width={600}
              height={500}
              className="rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Transform Your Space?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Book a free consultation with our design experts and take the first step towards your dream interior. We&apos;ll help you create a space that&apos;s uniquely yours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                  Book Consultation
                </Button>
                <Button variant="outline" className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
