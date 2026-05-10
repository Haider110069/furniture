import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const checkpoints = [
  "Curated sofas, tables, lighting, and storage for city living",
  "Dimensions and finishes listed so you can plan your space confidently",
  "Delivery coordination for Karachi—we call before dispatch",
  "Support on WhatsApp-friendly hours when you shop with Furni.pk",
]

export function InteriorSection() {
  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-1 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary" />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-[200px] lg:h-[250px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea8?w=500&q=80"
                  alt="Minimal lounge furniture"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-[200px] lg:h-[250px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80"
                  alt="Comfortable seating area"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="pt-8">
              <div className="relative h-[350px] lg:h-[450px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=550&q=80"
                  alt="Statement sofa interior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 leading-tight">
              We Help You Make
              <br />
              Modern Interior Design
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-md">
              Whether you are furnishing a new flat or upgrading a family room, we combine sensible layouts with finishes
              that stay beautiful for years—all with clear English descriptions and Pakistani-friendly payment choices.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {checkpoints.map((text, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-lg font-medium">
              <Link href="/shop">Explore the shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
