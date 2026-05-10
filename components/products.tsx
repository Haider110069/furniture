import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getFeaturedProducts } from "@/lib/data/products"

export async function Products() {
  const featured = await getFeaturedProducts(12)
  const products = featured.slice(0, 3)

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-4">
              Crafted with
              <br />
              excellent
              <br />
              material.
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Solid wood accents, breathable fabrics, and careful finishing—chosen for everyday life in Karachi and cities
              across Pakistan.
            </p>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-lg font-medium"
            >
              <Link href="/shop">Explore</Link>
            </Button>
          </div>

          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group">
              <div className="relative bg-muted rounded-lg p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain transition-transform group-hover:scale-105"
                />
                {product.featured && (
                  <span className="absolute bottom-4 left-4 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </span>
                )}
              </div>
              <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-foreground font-semibold">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
