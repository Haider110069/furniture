"use client"

import { useEffect, useState, useCallback } from "react"
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
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminFetch } from "@/lib/admin-client"
import { toast } from "sonner"

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

export default function AdminAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/stats")
    if (!res.ok) {
      setErr("Save admin API key to view analytics.")
      setStats(null)
      return
    }
    setErr(null)
    setStats(await res.json())
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const fn = () => void load()
    window.addEventListener("furni-admin-auth", fn)
    return () => window.removeEventListener("furni-admin-auth", fn)
  }, [load])

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
            Furni<span className="text-primary">.</span> Admin
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                link.id === "analytics" ? "bg-secondary text-secondary-foreground" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Analytics</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 hover:bg-muted rounded-lg"
              onClick={() =>
                toast.message("Notifications", { description: "No new alerts. Connect email webhooks later for real pings." })
              }
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="relative w-9 h-9 rounded-full overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop" alt="" fill className="object-cover" />
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </div>
        </header>

        <main className="p-6 space-y-8">
          {err && <p className="text-sm text-destructive">{err}</p>}
          {stats && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border rounded-xl p-6">
                  <p className="text-muted-foreground text-sm">Total revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <p className="text-muted-foreground text-sm">Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <p className="text-muted-foreground text-sm">Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <p className="text-muted-foreground text-sm">Distinct customers</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Orders by status</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  {Object.entries(stats.ordersByStatus).map(([k, v]) => (
                    <div key={k} className="p-4 rounded-lg bg-muted/60">
                      <p className="text-muted-foreground">{k}</p>
                      <p className="text-xl font-bold">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <Button type="button" variant="outline" onClick={() => void load()}>
            Refresh data
          </Button>
        </main>
      </div>
    </div>
  )
}
