import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { SITE } from "@/lib/site-config"

export default function AboutPage() {
  const team = [
    {
      name: "Ayesha Malik",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a?w=320&h=320&fit=crop",
    },
    {
      name: "Hassan Raza",
      role: "Lead Designer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&h=320&fit=crop",
    },
    {
      name: "Fatima Siddiqui",
      role: "Interior Architect",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=320&h=320&fit=crop",
    },
    {
      name: "Omar Sheikh",
      role: "Operations & Logistics",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=320&fit=crop",
    },
  ]

  const values = [
    "Honest descriptions in plain English—no filler Latin text",
    "Wood, metal, and fabrics chosen for Karachi’s climate and daily use",
    "Clear communication on delivery schedules and COD / wallet payments",
    "Design support for compact apartments and larger family homes",
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-secondary text-secondary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">About Furni</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto text-pretty">
            Karachi-based furniture and interiors—beautiful pieces, practical service, rooted in Pakistan.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Furni started as a small showroom team in Clifton, Karachi, helping families find sofas and tables that
                actually fit Pakistani rooms. Today we combine local craftsmanship with curated imports so you see real
                photos, accurate sizes, and English copy you can trust.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Reach us anytime at{" "}
                <a href={`tel:${SITE.phone}`} className="text-primary font-medium">
                  {SITE.phoneInternational}
                </a>{" "}
                or{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary font-medium">
                  {SITE.email}
                </a>
                .
              </p>
              <ul className="space-y-3">
                {values.map((value, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=500&fit=crop"
                alt="Modern living room with Furni furniture"
                width={600}
                height={500}
                className="rounded-2xl object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl">
                <p className="text-3xl font-bold">Karachi</p>
                <p className="text-sm">Home base</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-secondary mb-2">5000+</p>
              <p className="text-muted-foreground">Happy customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary mb-2">200+</p>
              <p className="text-muted-foreground">Designs in catalog</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary mb-2">Nationwide</p>
              <p className="text-muted-foreground">Delivery options*</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary mb-2">COD</p>
              <p className="text-muted-foreground">+ wallets accepted</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            *Contact us with your city for timelines outside Karachi metro.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The Karachi crew behind Furni’s customer experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={220}
                  height={220}
                  className="w-full aspect-square object-cover rounded-2xl mb-4 mx-auto max-w-[220px]"
                />
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
