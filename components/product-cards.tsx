import Image from "next/image"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/data/products"

export async function ProductCards() {
  const featured = await getFeaturedProducts(12)
  const products = featured.filter((p) =>
    ["nordic-chair", "kruzo-aero-chair", "ergonomic-chair"].includes(p.slug)
  )
  const list = products.length >= 3 ? products.slice(0, 3) : featured.slice(0, 3)

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {list.map((product) => (
            <div key={product.id} className="flex gap-4 items-start">
              <Link
                href={`/shop/${product.slug}`}
                className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </Link>
              <div>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-semibold text-foreground text-sm mb-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-xs mb-2 leading-relaxed">{product.shortDescription}</p>
                <Link href={`/shop/${product.slug}`} className="text-primary text-xs font-medium hover:underline">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
