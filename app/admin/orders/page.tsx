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
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminFetch } from "@/lib/admin-client"
import { downloadCsv } from "@/lib/csv"
import { toast } from "sonner"

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "products", label: "Products", icon: Package, href: "/admin/products" },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
]

const statusFilters = ["All", "Pending", "Processing", "In Transit", "Delivered", "Cancelled"]

type OrderRow = {
  id: string
  dbId: string
  customer: string
  email: string
  date: string
  items: number
  total: number
  status: string
  paymentMethod?: string
}

type OrderDetail = {
  id: string
  dbId: string
  status: string
  paymentMethod: string
  paymentLast4: string | null
  email: string
  phone: string | null
  customer: string
  address: string
  shippingMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: string
  items: { name: string; quantity: number; unitPrice: number; color: string; imageUrl: string }[]
}

const payLabel: Record<string, string> = {
  cash_on_delivery: "Cash on delivery",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
  card: "Card",
}

export default function AdminOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<OrderDetail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    const res = await adminFetch("/api/admin/orders")
    if (!res.ok) {
      setError("Could not load orders. Check admin API key.")
      setOrders([])
      return
    }
    setOrders(await res.json())
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const exportOrders = () => {
    const headers = ["order_number", "customer", "email", "date", "items", "total", "status", "payment"]
    const rows = orders.map((o) => [
      o.id,
      o.customer,
      o.email,
      o.date,
      o.items,
      o.total,
      o.status,
      payLabel[o.paymentMethod ?? ""] ?? o.paymentMethod ?? "",
    ])
    downloadCsv(`furni-orders-${Date.now()}.csv`, headers, rows)
    toast.success("Orders exported")
  }

  const openOrder = async (dbId: string) => {
    const res = await adminFetch(`/api/admin/orders/${dbId}`)
    if (!res.ok) {
      toast.error("Could not load order")
      return
    }
    const d = (await res.json()) as OrderDetail
    setDetail(d)
    setDetailOpen(true)
  }

  const updateStatus = async (dbId: string, status: string) => {
    const res = await adminFetch(`/api/admin/orders/${dbId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success("Status updated")
      void load()
    } else toast.error("Update failed")
  }

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
                link.id === "orders"
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
              <h1 className="text-xl font-semibold">Orders</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() =>
                  toast.message("Notifications", {
                    description: "You are all caught up.",
                  })
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
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statusFilters.slice(1).map((status) => {
              const count = orders.filter((o) => o.status === status).length
              return (
                <div key={status} className="bg-card rounded-xl border border-border p-4">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{status}</p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedStatus === status
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="outline" className="rounded-lg" type="button" onClick={() => exportOrders()}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Order ID
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Items
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Total
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.dbId} className="border-b border-border last:border-0 hover:bg-muted/30">
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
                          <div>
                            <span className="text-sm font-medium block">{order.customer}</span>
                            <span className="text-xs text-muted-foreground">{order.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">{order.items} items</td>
                      <td className="px-6 py-4 text-sm font-medium">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => void updateStatus(order.dbId, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          {statusFilters
                            .filter((s) => s !== "All")
                            .map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg"
                          type="button"
                          onClick={() => void openOrder(order.dbId)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled type="button">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-secondary text-secondary-foreground" type="button">
                  1
                </Button>
                <Button variant="outline" size="sm" type="button">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {detail?.id}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="text-sm space-y-3">
              <div>
                <span className="font-medium text-foreground">Customer: </span>
                {detail.customer} ({detail.email})
              </div>
              {detail.phone && (
                <div>
                  <span className="font-medium text-foreground">Phone: </span>
                  {detail.phone}
                </div>
              )}
              <div>
                <span className="font-medium text-foreground">Address: </span>
                {detail.address}
              </div>
              <div>
                <span className="font-medium text-foreground">Payment: </span>
                {payLabel[detail.paymentMethod] ?? detail.paymentMethod ?? "—"}
                {detail.paymentLast4 ? ` · last digits ${detail.paymentLast4}` : ""}
              </div>
              <div>
                <span className="font-medium text-foreground">Shipping: </span>
                {detail.shippingMethod}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs border border-border rounded-lg p-3">
                <span>Subtotal ${detail.subtotal.toFixed(2)}</span>
                <span>Ship ${detail.shippingCost.toFixed(2)}</span>
                <span>Tax ${detail.tax.toFixed(2)}</span>
                <span className="col-span-3 font-semibold">Total ${detail.total.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-medium text-foreground block mb-2">Items</span>
                <ul className="space-y-2">
                  {detail.items.map((li, i) => (
                    <li key={i} className="flex justify-between gap-2 border-b border-border pb-2">
                      <span>
                        {li.name} × {li.quantity} ({li.color})
                      </span>
                      <span>${(li.unitPrice * li.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-muted-foreground text-xs">Placed {new Date(detail.createdAt).toLocaleString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
