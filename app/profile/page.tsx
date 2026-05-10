"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut, Edit2, Eye, Truck, Banknote, Smartphone } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import type { FurniUserSession } from "@/lib/furni-session"
import { readFurniSession, saveFurniSession, clearFurniSession } from "@/lib/furni-session"
import { SITE } from "@/lib/site-config"
import { toast } from "sonner"

const tabs = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "settings", label: "Account Settings", icon: Settings },
]

type OrderFromApi = {
  id: string
  date: string
  status: string
  total: number
  items: { name: string; quantity: number; price: number; image: string; selectedColor?: string }[]
}

const mockWishlist = [
  { id: "1", name: "Nordic Chair", price: 50.0, image: "/images/nordic-chair.jpg", slug: "nordic-chair" },
  { id: "4", name: "Milano Sofa", price: 899.0, image: "/images/milano-sofa.jpg", slug: "milano-sofa" },
  { id: "8", name: "Velvet Accent Chair", price: 189.0, image: "/images/accent-chair.jpg", slug: "velvet-accent-chair" },
]

export default function ProfilePage() {
  const router = useRouter()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<FurniUserSession | null>(null)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginName, setLoginName] = useState("")

  const [activeTab, setActiveTab] = useState("orders")
  const [ordersEmail, setOrdersEmail] = useState("")
  const [orders, setOrders] = useState<OrderFromApi[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [profilePhone, setProfilePhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const s = readFurniSession()
    setSession(s)
    if (s) {
      setOrdersEmail(s.email)
      setProfileName(s.name)
      setProfileEmail(s.email)
      setProfilePhone("")
      setAvatarUrl(s.avatar ?? null)
    }
  }, [])

  useEffect(() => {
    if (!ordersEmail.trim()) {
      setOrders([])
      return
    }
    let cancelled = false
    setOrdersLoading(true)
    setOrdersError(null)
    fetch(`/api/orders?email=${encodeURIComponent(ordersEmail.trim())}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (!Array.isArray(data)) {
          setOrdersError("Could not load orders")
          setOrders([])
          return
        }
        setOrders(data as OrderFromApi[])
      })
      .catch(() => {
        if (!cancelled) {
          setOrdersError("Could not load orders")
          setOrders([])
        }
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [ordersEmail])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const email = loginEmail.trim().toLowerCase()
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }
    const next: FurniUserSession = {
      email,
      name: loginName.trim() || email.split("@")[0],
      avatar: null,
    }
    saveFurniSession(next)
    localStorage.setItem("furni-account-email", email)
    setSession(next)
    setOrdersEmail(email)
    setProfileName(next.name)
    setProfileEmail(next.email)
    setProfilePhone("")
    setAvatarUrl(null)
    toast.success(`Signed in as ${next.email}`)
    setLoginEmail("")
    setLoginName("")
    router.refresh()
  }

  const handleLogout = () => {
    clearFurniSession()
    setSession(null)
    setOrdersEmail("")
    setOrders([])
    setProfileName("")
    setProfileEmail("")
    setAvatarUrl(null)
    toast.message("Logged out — sign in with another Gmail anytime.")
    router.refresh()
  }

  const saveProfileSettings = () => {
    if (!session) return
    const next: FurniUserSession = {
      ...session,
      name: profileName.trim() || session.name,
      avatar: avatarUrl,
    }
    saveFurniSession(next)
    setSession(next)
    if (profileEmail.trim() && profileEmail.trim() !== session.email) {
      localStorage.setItem("furni-account-email", profileEmail.trim().toLowerCase())
      setOrdersEmail(profileEmail.trim().toLowerCase())
    }
    toast.success("Profile saved")
  }

  const onPhotoChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith("image/")) {
      toast.error("Choose an image file")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setAvatarUrl(url)
      if (session) {
        saveFurniSession({ ...session, avatar: url })
        setSession({ ...session, avatar: url })
      }
      toast.success("Photo updated (saved on this device)")
    }
    reader.readAsDataURL(file)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700"
      case "In Transit":
        return "bg-blue-100 text-blue-700"
      case "Processing":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-40 text-center text-muted-foreground text-sm">Loading…</div>
        <Footer />
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Sign in</h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Use your Gmail (or any email). This is demo sign-in—it stores your profile on this device only so you can
              switch accounts and verify orders under each email.
            </p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-medium block mb-1">Display name</label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Sara Khan"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
                  placeholder="yourname@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>
              <Button type="submit" className="w-full rounded-full bg-secondary hover:bg-secondary/90">
                Continue to account
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const displayAvatar = avatarUrl ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop"

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">My account</span>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                    <Image
                      src={avatarUrl ?? displayAvatar}
                      alt={profileName}
                      fill
                      className="object-cover"
                      unoptimized={!!avatarUrl}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{profileName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{profileEmail}</p>
                  </div>
                </div>

                <nav className="mt-6 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id
                          ? "bg-secondary text-secondary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="w-5 h-5" />
                    Log out
                  </button>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My orders</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Orders are matched to{" "}
                    <span className="font-medium text-foreground">{profileEmail}</span>. Use checkout with the same email,
                    or change it below.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <input
                      type="email"
                      placeholder="Orders lookup email"
                      value={ordersEmail}
                      onChange={(e) => setOrdersEmail(e.target.value)}
                      className="flex-1 min-w-[220px] px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        localStorage.setItem("furni-account-email", ordersEmail.trim().toLowerCase())
                        toast.success("Email saved on this browser")
                      }}
                    >
                      Save email on device
                    </Button>
                  </div>
                  {ordersError && <p className="text-sm text-destructive mb-4">{ordersError}</p>}
                  {ordersLoading && <p className="text-sm text-muted-foreground mb-4">Loading orders…</p>}
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                          <div className="flex items-center gap-6 flex-wrap">
                            <div>
                              <span className="text-sm text-muted-foreground">Order</span>
                              <p className="font-semibold">{order.id}</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Date</span>
                              <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Total</span>
                              <p className="font-semibold">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="py-4 space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                  {item.selectedColor ? ` · ${item.selectedColor}` : ""}
                                </p>
                              </div>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <Button variant="outline" size="sm" className="rounded-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </Button>
                          {order.status === "In Transit" && (
                            <Button variant="outline" size="sm" className="rounded-full">
                              <Truck className="w-4 h-4 mr-2" />
                              Track order
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!ordersLoading && orders.length === 0 && ordersEmail.trim() && (
                      <p className="text-muted-foreground text-sm">No orders found for this email.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockWishlist.map((item) => (
                      <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden group">
                        <Link href={`/shop/${item.slug}`}>
                          <div className="relative aspect-square bg-muted overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/shop/${item.slug}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
                          </Link>
                          <p className="font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
                          <Button asChild size="sm" className="w-full mt-4 rounded-full bg-secondary hover:bg-secondary/90">
                            <Link href={`/shop/${item.slug}`}>View product</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Saved addresses</h2>
                    <Button type="button" className="rounded-full bg-secondary hover:bg-secondary/90" disabled>
                      Add address (coming soon)
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-card rounded-2xl border border-border p-6 relative">
                      <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        Default
                      </span>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-secondary" />
                        <h3 className="font-semibold">Karachi showroom</h3>
                      </div>
                      <div className="text-muted-foreground text-sm space-y-1">
                        <p className="font-medium text-foreground">{SITE.storeName}</p>
                        <p>{SITE.addressLines.join(", ")}</p>
                        <p>
                          {SITE.city}, {SITE.region} {SITE.postalCode}
                        </p>
                        <p>
                          Phone:{" "}
                          <a href={`tel:${SITE.phone}`} className="text-primary">
                            {SITE.phoneInternational}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "payment" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Payment methods</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-card rounded-2xl border border-border p-6 flex gap-4">
                      <Banknote className="w-8 h-8 text-secondary shrink-0" />
                      <div>
                        <h3 className="font-semibold">Cash on delivery</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Pay when furniture reaches your Karachi address—or per courier instructions nationwide.
                        </p>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl border border-border p-6 flex gap-4">
                      <Smartphone className="w-8 h-8 text-secondary shrink-0" />
                      <div>
                        <h3 className="font-semibold">JazzCash & EasyPaisa</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Secure mobile wallet checkout. Enter your registered wallet number during payment on the checkout
                          page.
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-secondary-foreground">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm opacity-80">Debit / credit card</span>
                      </div>
                      <p className="font-mono text-lg tracking-wider mb-2">Stored only at checkout when you choose card</p>
                      <p className="text-xs opacity-80">Pakistani bank cards accepted where your issuing bank permits online use.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account settings</h2>
                  <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Profile</h3>
                      <div className="flex items-center gap-6 mb-6 flex-wrap">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted shrink-0">
                          <Image
                            src={avatarUrl ?? displayAvatar}
                            alt="You"
                            fill
                            className="object-cover"
                            unoptimized={!!avatarUrl}
                          />
                        </div>
                        <div>
                          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChosen} />
                          <Button type="button" variant="outline" className="rounded-full" onClick={() => photoInputRef.current?.click()}>
                            Change photo
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">Saved on this browser only.</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full name</label>
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email</label>
                          <input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium mb-2 block">Phone</label>
                          <input
                            type="tel"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder={SITE.phone}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="button" className="rounded-full bg-secondary hover:bg-secondary/90" onClick={saveProfileSettings}>
                      Save changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
