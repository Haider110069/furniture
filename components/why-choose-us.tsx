import Image from "next/image"
import { Truck, ShoppingBag, Headphones, RefreshCw } from "lucide-react"
import { SITE } from "@/lib/site-config"

const features = [
  {
    icon: Truck,
    title: "Fast delivery in Karachi",
    description: "Reliable courier and crew for Karachi and surroundings. Scheduling calls so someone is home.",
  },
  {
    icon: ShoppingBag,
    title: "Easy to shop online",
    description: "Browse clear photos, specs, and colors. COD and mobile wallets accepted at checkout.",
  },
  {
    icon: Headphones,
    title: "Local customer support",
    description: `Call ${SITE.phoneInternational} during retail hours—we are here before and after delivery.`,
  },
  {
    icon: RefreshCw,
    title: "Hassle-free returns",
    description: "Report issues quickly. Unused items may be eligible for return per our shipping and terms pages.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-md leading-relaxed">
              We focus on sturdy materials, timeless shapes, and service you can rely on—from Clifton to Gulshan and
              beyond.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae27?w=900&q=80"
              alt="Modern living room with sofa and furnishings"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
