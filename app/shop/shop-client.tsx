"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Star, ShoppingCart, Filter, Grid, List } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { categories, type Product } from "@/lib/products"
import { useCart } from "@/lib/cart"
import { useSearchParams } from "next/navigation"

type ShopClientProps = {
  initialProducts: Product[]
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") || "all"
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const { addItem } = useCart()

  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/products?category=${encodeURIComponent(selectedCategory)}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (!cancelled && Array.isArray(data)) setProducts(data)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
    return () => {
      cancelled = true
    }
  }, [selectedCategory])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
          <nav className="flex items-center gap-2 text-sm text-secondary-foreground/60 mb-4">
            <Link href="/" className="hover:text-secondary-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-secondary-foreground">Shop</span>
          </nav>
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-foreground">Our Collection</h1>
          <p className="mt-4 text-secondary-foreground/70 max-w-xl">
            Discover our carefully curated collection of modern furniture designed to transform your living
            spaces.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === "all" ? "/shop" : `/shop?category=${cat.slug}`}
                  scroll={false}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border-l border-border pl-4">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-muted" : ""}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-muted" : ""}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">Showing {sortedProducts.length} products</p>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/shop/${product.slug}`} className="block">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.originalPrice != null && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                          Sale
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {product.category}
                    </span>
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-semibold mt-1 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        {product.originalPrice != null && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full bg-secondary hover:bg-secondary/90"
                        onClick={(e) => {
                          e.preventDefault()
                          addItem(product)
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex gap-6 bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 p-4"
                >
                  <Link href={`/shop/${product.slug}`} className="shrink-0">
                    <div className="relative w-40 h-40 bg-muted rounded-xl overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {product.category}
                      </span>
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-semibold text-lg mt-1 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.shortDescription}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({product.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">${product.price.toFixed(2)}</span>
                        {product.originalPrice != null && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button className="rounded-full bg-secondary hover:bg-secondary/90" onClick={() => addItem(product)}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
