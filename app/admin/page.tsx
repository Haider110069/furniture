"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  DollarSign,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminFetch } from "@/lib/admin-client"
import { toast } from "sonner"
import type { Product } from "@/lib/products"

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "products", label: "Products", icon: Package, href: "/admin/products" },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
]

type Stats = {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  ordersByStatus: Record<string, number>
}

type OrderRow = {
  id: string
  customer: string
  email: string
  date: string
  total: number
  status: string
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("dashboard")
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoadError(null)
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        adminFetch("/api/admin/stats"),
        adminFetch("/api/admin/orders"),
        adminFetch("/api/admin/products"),
      ])
      if (!statsRes.ok || !ordersRes.ok || !productsRes.ok) {
        setLoadError("Unauthorized or server error. Save your admin API key above.")
        setStats(null)
        setRecentOrders([])
        setTopProducts([])
        return
      }
      const statsJson = (await statsRes.json()) as Stats
      const ordersJson = (await ordersRes.json()) as OrderRow[]
      const productsJson = (await productsRes.json()) as Product[]
      setStats(statsJson)
      setRecentOrders(ordersJson.slice(0, 5))
      setTopProducts(productsJson.slice(0, 5))
    } catch {
      setLoadError("Failed to load dashboard.")
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    const onAuth = () => void loadDashboard()
    window.addEventListener("furni-admin-auth", onAuth)
    return () => window.removeEventListener("furni-admin-auth", onAuth)
  }, [loadDashboard])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700"
      case "In Transit":
        return "bg-blue-100 text-blue-700"
      case "Processing":
        return "bg-yellow-100 text-yellow-700"
      case "Pending":
        return "bg-gray-100 text-gray-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const statCards = stats
    ? [
        {
          label: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: "",
          trend: "up" as const,
          icon: DollarSign,
        },
        {
          label: "Total Orders",
          value: String(stats.totalOrders),
          change: "",
          trend: "up" as const,
          icon: ShoppingCart,
        },
        {
          label: "Total Products",
          value: String(stats.totalProducts),
          change: "",
          trend: "up" as const,
          icon: Package,
        },
        {
          label: "Total Customers",
          value: String(stats.totalCustomers),
          change: "",
          trend: "up" as const,
          icon: Users,
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">
            Furni<span className="text-primary">.</span>{" "}
            <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setActiveLink(link.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                activeLink === link.id
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-secondary/10 rounded-xl p-4">
            <p className="text-sm font-medium mb-2">Storefront</p>
            <p className="text-xs text-muted-foreground mb-3">View the public site</p>
            <Button asChild size="sm" variant="outline" className="w-full rounded-lg text-xs">
              <Link href="/">Open site</Link>
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-muted rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() =>
                  toast.message("Notifications", { description: "No new alerts." })
                }
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="relative w-9 h-9 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"
                    alt="Admin"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
            {loadError && <p className="text-sm text-destructive mt-2">{loadError}</p>}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <stat.icon className="w-5 h-5 text-secondary" />
                  </div>
                  {stat.change ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  ) : null}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-semibold">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View All <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Order
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Customer
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Date
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Total
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                          No orders yet or save your admin key to load data.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(order.email)}`}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm">{order.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button type="button" className="p-1 hover:bg-muted rounded">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-semibold">Products</h2>
                <Link href="/admin/products" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View All <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products loaded.</p>
                ) : (
                  topProducts.map((product, idx) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-muted-foreground w-4">{idx + 1}</span>
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.reviews} reviews</p>
                      </div>
                      <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
