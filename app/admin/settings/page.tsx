"use client"

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

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border hidden lg:block">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-xl font-bold">
            Furni<span className="text-primary">.</span> Admin
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                link.id === "settings" ? "bg-secondary text-secondary-foreground" : "hover:bg-muted text-muted-foreground"
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
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 hover:bg-muted rounded-lg"
              onClick={() => toast.message("Notifications", { description: "Configure alerts in a future update." })}
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

        <main className="p-6 max-w-2xl space-y-6">
          <div className="bg-card border rounded-xl p-6 space-y-2 text-sm">
            <h2 className="font-semibold text-base">Public store details</h2>
            <p>
              Name: <strong>{SITE.storeName}</strong>
            </p>
            <p>Address: {SITE.addressLines.join(", ")}, {SITE.city}</p>
            <p>Phone: {SITE.phoneInternational}</p>
            <p>Emails: {SITE.email}, {SITE.supportEmail}</p>
            <p className="text-muted-foreground text-xs mt-4">
              To change storefront text sitewide, edit <code className="font-mono bg-muted px-1 rounded">lib/site-config.ts</code>{" "}
              and rebuild.
            </p>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-2 text-sm">
            <h2 className="font-semibold text-base">Admin API</h2>
            <p>Set <strong>ADMIN_API_SECRET</strong> in your <code className="font-mono bg-muted px-1">.env</code> file. Paste</p>
            <p>The same value into the yellow bar on admin pages.</p>
            <Button
              type="button"
              className="mt-2 rounded-lg bg-secondary hover:bg-secondary/90"
              onClick={() =>
                navigator.clipboard
                  ?.writeText("ADMIN_API_SECRET=your-strong-secret-here")
                  .then(() => toast.success("Sample line copied (edit before use)."))
                  .catch(() => toast.message("Copy to .env manually"))
              }
            >
              Copy sample env line
            </Button>
          </div>

          <Button asChild variant="outline" type="button" className="rounded-lg lg:hidden">
            <Link href="/admin">
              <Menu className="w-4 h-4 mr-2 inline" />
              Dashboard menu
            </Link>
          </Button>
        </main>
      </div>
    </div>
  )
}
