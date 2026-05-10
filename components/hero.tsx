import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] bg-[#2d4a3e] overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-white z-10 relative">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-balance">
              Modern Interior
              <br />
              Design Studio
            </h1>
            <p className="text-white/70 text-sm lg:text-base max-w-md mb-8 leading-relaxed">
              Discover thoughtfully chosen furniture that fits Pakistani homes—from compact city apartments to spacious family
              lounges. Comfort, quality, and style in every piece.
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full font-medium">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-2.5 rounded-full font-medium bg-transparent">
                <Link href="/shop">Explore</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[300px] lg:h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
              alt="Modern teal sofa"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute bottom-8 left-6 lg:left-12 flex gap-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-primary" />
        ))}
      </div>
    </section>
  )
}
