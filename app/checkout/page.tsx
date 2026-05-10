"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { CreditCard, Truck, Shield, ChevronRight, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, name: "Shipping" },
  { id: 2, name: "Payment" },
  { id: 3, name: "Review" },
]

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Sindh",
    zip: "75600",
    country: "Pakistan",
  })

  type PayMethod = "cash_on_delivery" | "jazzcash" | "easypaisa" | "card"
  const [payMethod, setPayMethod] = useState<PayMethod>("cash_on_delivery")
  const [walletMobile, setWalletMobile] = useState("")

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  const [shippingMethod, setShippingMethod] = useState("standard")

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
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (items.length === 0 && !orderPlaced) {
    router.push("/cart")
    return null
  }

  const subtotal = getTotalPrice()
  const shippingCost = shippingMethod === "express" ? 19.99 : subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handlePlaceOrder = async () => {
    setCheckoutError(null)
    setSubmitting(true)
    try {
      const cardDigits = paymentInfo.cardNumber.replace(/\s/g, "")
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: shippingInfo.email,
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          phone: shippingInfo.phone || undefined,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          country: shippingInfo.country,
          shippingMethod,
          paymentMethod: payMethod,
          walletAccount:
            payMethod === "jazzcash" || payMethod === "easypaisa" ? walletMobile : undefined,
          paymentLast4:
            payMethod === "card" ? cardDigits.slice(-4) || undefined : undefined,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            selectedColor: i.selectedColor,
          })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCheckoutError(typeof data.error === "string" ? data.error : "Could not place order")
        return
      }
      if (typeof window !== "undefined" && shippingInfo.email) {
        localStorage.setItem("furni-account-email", shippingInfo.email.trim().toLowerCase())
      }
      setPlacedOrderNumber(data.orderNumber ?? null)
      setOrderPlaced(true)
      clearCart()
    } catch {
      setCheckoutError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        
        <section className="pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order confirmation has been sent to {shippingInfo.email || "your email"}
            </p>
            
            <div className="bg-card rounded-2xl border border-border p-6 text-left mb-8">
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-medium">#{placedOrderNumber ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-medium">
                    {shippingMethod === "express" ? "2-3 business days" : "5-7 business days"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/profile">View Orders</Link>
              </Button>
              <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </nav>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id 
                      ? "bg-secondary text-secondary-foreground" 
                      : currentStep === step.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="hidden sm:inline font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 mx-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Shipping Information
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <input 
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <input 
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <input 
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <input 
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Address</label>
                      <input 
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <input 
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">State</label>
                        <input 
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                        <input 
                          type="text"
                          value={shippingInfo.zip}
                          onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="shipping" 
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={() => setShippingMethod("standard")}
                            className="accent-primary"
                          />
                          <div>
                            <span className="font-medium">Standard Shipping</span>
                            <p className="text-sm text-muted-foreground">5-7 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">{subtotal > 50 ? "Free" : "$9.99"}</span>
                      </label>
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="shipping" 
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={() => setShippingMethod("express")}
                            className="accent-primary"
                          />
                          <div>
                            <span className="font-medium">Express Shipping</span>
                            <p className="text-sm text-muted-foreground">2-3 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">$19.99</span>
                      </label>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep(2)} 
                    className="w-full mt-6 rounded-full bg-secondary hover:bg-secondary/90"
                  >
                    Continue to payment
                  </Button>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment (Pakistan)
                  </h2>

                  <p className="text-sm text-muted-foreground mb-4">
                    Choose how you want to pay. Cash on delivery and mobile wallets are available across Pakistan.
                  </p>

                  <div className="space-y-2 mb-6">
                    {(
                      [
                        { id: "cash_on_delivery" as const, title: "Cash on delivery", sub: "Pay when your order arrives" },
                        { id: "jazzcash" as const, title: "JazzCash", sub: "Pay from your JazzCash wallet" },
                        { id: "easypaisa" as const, title: "EasyPaisa", sub: "Pay from your EasyPaisa account" },
                        { id: "card" as const, title: "Debit / credit card", sub: "Visa, Mastercard (demo checkout)" },
                      ] satisfies { id: PayMethod; title: string; sub: string }[]
                    ).map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          payMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pay"
                          checked={payMethod === opt.id}
                          onChange={() => setPayMethod(opt.id)}
                          className="accent-primary mt-1"
                        />
                        <div>
                          <span className="font-medium block">{opt.title}</span>
                          <span className="text-xs text-muted-foreground">{opt.sub}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {(payMethod === "jazzcash" || payMethod === "easypaisa") && (
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-2 block">Mobile account number</label>
                      <input
                        type="tel"
                        value={walletMobile}
                        onChange={(e) => setWalletMobile(e.target.value)}
                        placeholder="03XXXXXXXXX"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  {payMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Card number</label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Cardholder name</label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Expiry</label>
                          <input
                            type="text"
                            value={paymentInfo.expiry}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">CVV</label>
                          <input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-6 p-4 bg-muted rounded-lg">
                    <Shield className="w-5 h-5 text-secondary shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Card details are demo-only. For production, integrate a secure gateway (e.g. bank or Stripe).
                    </span>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 rounded-full">
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if ((payMethod === "jazzcash" || payMethod === "easypaisa") && walletMobile.replace(/\D/g, "").length < 10) {
                          setCheckoutError("Please enter a valid 11-digit mobile wallet number.")
                          return
                        }
                        if (
                          payMethod === "card" &&
                          (!paymentInfo.cardNumber.trim() ||
                            !paymentInfo.cardName.trim() ||
                            !paymentInfo.expiry.trim() ||
                            !paymentInfo.cvv.trim())
                        ) {
                          setCheckoutError("Please fill in all card fields.")
                          return
                        }
                        setCheckoutError(null)
                        setCurrentStep(3)
                      }}
                      className="flex-1 rounded-full bg-secondary hover:bg-secondary/90"
                    >
                      Review order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold mb-4">Shipping Address</h3>
                    <p className="text-muted-foreground">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />
                      {shippingInfo.country}
                    </p>
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-primary hover:underline mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold mb-4">Payment method</h3>
                    <p className="text-muted-foreground">
                      {payMethod === "cash_on_delivery" && "Cash on delivery — pay when your order arrives."}
                      {payMethod === "jazzcash" && `JazzCash — account ending ${walletMobile.replace(/\D/g, "").slice(-4) || "****"}`}
                      {payMethod === "easypaisa" && `EasyPaisa — account ending ${walletMobile.replace(/\D/g, "").slice(-4) || "****"}`}
                      {payMethod === "card" && `Card ending in ${paymentInfo.cardNumber.replace(/\s/g, "").slice(-4) || "****"}`}
                    </p>
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-primary hover:underline mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.lineId} className="flex gap-4">
                          <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.selectedColor} x {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {checkoutError && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{checkoutError}</p>
                  )}
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(2)} 
                      className="flex-1 rounded-full"
                      disabled={submitting}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => void handlePlaceOrder()} 
                      className="flex-1 rounded-full bg-secondary hover:bg-secondary/90"
                      disabled={submitting}
                    >
                      {submitting ? "Placing order…" : `Place Order - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={item.lineId} className="flex gap-3">
                      <div className="relative w-14 h-14 bg-muted rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.selectedColor}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
