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
  Mail,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminFetch } from "@/lib/admin-client"
import { SITE } from "@/lib/site-config"
import { toast } from "sonner"

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "products", label: "Products", icon: Package, href: "/admin/products" },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
]

type CustomerRow = {
  id: string
  name: string
  email: string
  orders: number
  spent: number
  joined: string
  status: string
  avatar: string
}

export default function AdminCustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    const res = await adminFetch("/api/admin/customers")
    if (!res.ok) {
      setError("Could not load customers. Check admin API key.")
      setCustomers([])
      return
    }
    setCustomers(await res.json())
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const onAuth = () => void load()
    window.addEventListener("furni-admin-auth", onAuth)
    return () => window.removeEventListener("furni-admin-auth", onAuth)
  }, [load])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "VIP":
        return "bg-purple-100 text-purple-700"
      case "New":
        return "bg-blue-100 text-blue-700"
      case "Inactive":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSpent = customers.reduce((acc, c) => acc + c.spent, 0)

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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                link.id === "customers"
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold">Customers</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => toast.message("Notifications", { description: "No new alerts." })}
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
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-2xl font-bold">{customers.filter((c) => c.status === "Active").length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-2xl font-bold">{customers.filter((c) => c.status === "VIP").length}</p>
              <p className="text-sm text-muted-foreground">VIP Members</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground col-span-full">
                No customers yet. Orders will create customer records here.
              </p>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.email} className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted">
                        <Image src={customer.avatar} alt={customer.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <button type="button" className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      First order {new Date(customer.joined).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-lg font-bold">{customer.orders}</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">${customer.spent.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                  </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 rounded-lg gap-2"
                  type="button"
                  asChild
                >
                  <a
                    href={`mailto:${customer.email}?subject=${encodeURIComponent(`Message from ${SITE.storeName}`)}&body=${encodeURIComponent(`Hi ${customer.name},\n\n`)}`}
                    onClick={() => toast.success("Opening your email app…")}
                  >
                    <Mail className="w-4 h-4" />
                    Send email
                  </a>
                </Button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
