"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import { useEffect, useState } from "react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="animate-pulse">
              <div className="h-10 bg-muted rounded w-48 mb-8" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shopping Cart</span>
          </nav>

          <h1 className="text-3xl lg:text-4xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any items yet.</p>
              <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90">
                <Link href="/shop">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                  <span className="text-sm text-muted-foreground">{items.length} item(s) in cart</span>
                  <button 
                    onClick={clearCart}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.lineId} className="flex gap-6 p-4 bg-card rounded-2xl border border-border">
                      <Link href={`/shop/${item.product.slug}`} className="shrink-0">
                        <div className="relative w-28 h-28 bg-muted rounded-xl overflow-hidden">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/shop/${item.product.slug}`}>
                                <h3 className="font-semibold hover:text-primary transition-colors">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1">
                                Color: {item.selectedColor}
                              </p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.lineId)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border rounded-full">
                            <button 
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors rounded-l-full"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                              className="p-2 hover:bg-muted transition-colors rounded-r-full"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-bold text-lg">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link 
                    href="/shop" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    {shipping > 0 && (
                      <div className="bg-primary/10 text-primary text-sm p-3 rounded-lg">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </div>
                    )}
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-xl">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6">
                    <label className="text-sm font-medium mb-2 block">Promo Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button variant="outline" className="rounded-lg">Apply</Button>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full mt-6 rounded-full bg-secondary hover:bg-secondary/90">
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>

                  <div className="mt-6 flex items-center justify-center gap-4">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" width={40} height={24} className="opacity-50" />
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" width={40} height={24} className="opacity-50" />
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" width={40} height={24} className="opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
