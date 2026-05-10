"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "@/components/review-form"
import { ReviewsDisplay } from "@/components/reviews-display"
import { categories, type Product } from "@/lib/products"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

type Props = {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const categorySlug =
    categories.find((c) => c.name === product.category)?.slug ?? product.category.toLowerCase()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "details" | "reviews">("description")
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor)
  }

  const handleReviewSubmitted = () => {
    setReviewRefreshTrigger(prev => prev + 1)
    toast.success("Thank you for your review!")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={categorySlug === "all" ? "/shop" : `/shop?category=${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-1 relative aspect-square bg-muted rounded-2xl overflow-hidden">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.originalPrice != null && (
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</span>
              <h1 className="text-3xl lg:text-4xl font-bold mt-2">{product.name}</h1>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice != null && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mt-6 text-muted-foreground leading-relaxed">{product.shortDescription}</p>

              <div className="mt-8">
                <span className="text-sm font-medium">
                  Color: <span className="text-muted-foreground">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        selectedColor === color
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border hover:border-secondary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted transition-colors rounded-l-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors rounded-r-full"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.inStock ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" /> In Stock
                      </span>
                    ) : (
                      "Out of Stock"
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-8 flex-wrap">
                <Button
                  size="lg"
                  className="flex-1 rounded-full bg-secondary hover:bg-secondary/90 min-w-[200px]"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-4" type="button">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-4" type="button">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Truck className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block">Free Shipping</span>
                    <span className="text-xs text-muted-foreground">On orders $50+</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block">2 Year Warranty</span>
                    <span className="text-xs text-muted-foreground">Full coverage</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <RotateCcw className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block">Easy Returns</span>
                    <span className="text-xs text-muted-foreground">30 day policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-8 border-b border-border">
            {(["description", "details", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "text-foreground border-b-2 border-secondary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === "details" && product.dimensions && (
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Dimensions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex justify-between py-2 border-b border-border">
                      <span>Width</span>
                      <span className="font-medium text-foreground">{product.dimensions.width}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-border">
                      <span>Height</span>
                      <span className="font-medium text-foreground">{product.dimensions.height}</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-border">
                      <span>Depth</span>
                      <span className="font-medium text-foreground">{product.dimensions.depth}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Available Colors</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.colors.map((color) => (
                      <li key={color} className="flex items-center gap-2 py-2 border-b border-border">
                        <Check className="w-4 h-4 text-secondary" />
                        <span>{color}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold">{product.rating}</div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Based on {product.reviews} reviews</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-full mb-8" 
                  type="button"
                  onClick={() => setReviewFormOpen(true)}
                >
                  Write a Review
                </Button>
                <ReviewsDisplay 
                  productId={product.id} 
                  refreshTrigger={reviewRefreshTrigger}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/shop/${relProduct.slug}`} className="block">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={relProduct.images[0]}
                        alt={relProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/shop/${relProduct.slug}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">{relProduct.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(relProduct.rating) ? "fill-primary text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg mt-2 block">${relProduct.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      
      <ReviewForm
        open={reviewFormOpen}
        onOpenChange={setReviewFormOpen}
        productId={product.id}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </main>
  )
}
