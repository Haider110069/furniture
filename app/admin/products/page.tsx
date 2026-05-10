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
  Plus,
  Edit2,
  Trash2,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { categories } from "@/lib/products"
import type { Product } from "@/lib/products"
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

type EditForm = {
  name: string
  slug: string
  price: string
  originalPrice: string
  category: string
  shortDescription: string
  description: string
  colors: string
  images: string
  featured: boolean
  inStock: boolean
  rating: string
  reviews: string
}

function productToForm(p: Product): EditForm {
  return {
    name: p.name,
    slug: p.slug,
    price: String(p.price),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
    category: p.category,
    shortDescription: p.shortDescription,
    description: p.description,
    colors: p.colors.join(", "),
    images: p.images.join(", "),
    featured: p.featured,
    inStock: p.inStock,
    rating: String(p.rating),
    reviews: String(p.reviews),
  }
}

export default function AdminProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState<EditForm | null>(null)

  const load = useCallback(async () => {
    setError(null)
    const res = await adminFetch("/api/admin/products")
    if (!res.ok) {
      setError("Could not load products. Check admin API key.")
      setProducts([])
      return
    }
    setProducts(await res.json())
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const onAuth = () => void load()
    window.addEventListener("furni-admin-auth", onAuth)
    return () => window.removeEventListener("furni-admin-auth", onAuth)
  }, [load])

  const filteredProducts = products.filter((product) => {
    const cat = categories.find((c) => c.slug === selectedCategory)
    const matchesCategory =
      selectedCategory === "all" || (cat && cat.name !== "All" && product.category === cat.name)
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const openEdit = (p: Product) => {
    setEditId(p.id)
    setEditForm(productToForm(p))
    setEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editId || !editForm) return
    const price = Number.parseFloat(editForm.price)
    if (Number.isNaN(price)) {
      toast.error("Invalid price")
      return
    }
    const orig = editForm.originalPrice.trim()
    const origNum = orig === "" ? null : Number.parseFloat(orig)
    const body: Record<string, unknown> = {
      name: editForm.name.trim(),
      slug: editForm.slug.trim(),
      price,
      originalPrice: origNum !== null && !Number.isNaN(origNum) ? origNum : null,
      category: editForm.category.trim(),
      shortDescription: editForm.shortDescription.trim(),
      description: editForm.description.trim(),
      featured: editForm.featured,
      inStock: editForm.inStock,
      rating: Number.parseFloat(editForm.rating) || 0,
      reviews: Number.parseInt(editForm.reviews, 10) || 0,
      colors: editForm.colors.split(",").map((c) => c.trim()).filter(Boolean),
      images: editForm.images.split(",").map((c) => c.trim()).filter(Boolean),
    }
    const res = await adminFetch(`/api/admin/products/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      toast.error("Could not save product")
      return
    }
    toast.success("Product updated")
    setEditOpen(false)
    await load()
  }

  const openAdd = () => {
    setAddForm({
      name: "",
      slug: "",
      price: "",
      originalPrice: "",
      category: "",
      shortDescription: "",
      description: "",
      colors: "",
      images: "",
      featured: false,
      inStock: true,
      rating: "0",
      reviews: "0",
    })
    setAddOpen(true)
  }

  const saveAdd = async () => {
    if (!addForm) return
    const price = Number.parseFloat(addForm.price)
    if (Number.isNaN(price)) {
      toast.error("Invalid price")
      return
    }
    const orig = addForm.originalPrice.trim()
    const origNum = orig === "" ? null : Number.parseFloat(orig)
    const body: Record<string, unknown> = {
      name: addForm.name.trim(),
      slug: addForm.slug.trim(),
      price,
      originalPrice: origNum !== null && !Number.isNaN(origNum) ? origNum : null,
      category: addForm.category.trim(),
      shortDescription: addForm.shortDescription.trim(),
      description: addForm.description.trim(),
      featured: addForm.featured,
      inStock: addForm.inStock,
      rating: Number.parseFloat(addForm.rating) || 0,
      reviews: Number.parseInt(addForm.reviews, 10) || 0,
      colors: addForm.colors.split(",").map((c) => c.trim()).filter(Boolean),
      images: addForm.images.split(",").map((c) => c.trim()).filter(Boolean),
    }
    const res = await adminFetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      toast.error("Could not create product")
      return
    }
    toast.success("Product created")
    setAddOpen(false)
    await load()
  }

  const runDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Delete failed")
      return
    }
    toast.success("Product deleted")
    setDeleteOpen(false)
    setDeleteId(null)
    await load()
  }

  const exportProducts = () => {
    const headers = ["id", "name", "slug", "price", "category", "featured", "in_stock", "rating", "reviews"]
    const rows = products.map((p) => [
      p.id,
      p.name,
      p.slug,
      p.price,
      p.category,
      p.featured ? "yes" : "no",
      p.inStock ? "yes" : "no",
      p.rating,
      p.reviews,
    ])
    downloadCsv(`furni-products-${Date.now()}.csv`, headers, rows)
    toast.success("Products exported")
  }

  const bulkMarkFeatured = async (featured: boolean) => {
    if (selectedProducts.length === 0) {
      toast.message("Select products first")
      return
    }
    for (const id of selectedProducts) {
      const res = await adminFetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      })
      if (!res.ok) {
        toast.error(`Failed updating ${id}`)
        return
      }
    }
    toast.success(featured ? "Marked as featured" : "Removed featured")
    setSelectedProducts([])
    await load()
  }

  const bulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.message("Select products first")
      return
    }
    const ok = typeof window !== "undefined" ? window.confirm(`Delete ${selectedProducts.length} products?`) : false
    if (!ok) return
    for (const id of selectedProducts) {
      await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" })
    }
    toast.success("Selected products deleted")
    setSelectedProducts([])
    await load()
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
                link.id === "products"
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
              <h1 className="text-xl font-semibold">Products</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                title="Notifications"
                onClick={() => toast.message("Notifications", { description: "No new alerts right now." })}
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" className="rounded-lg" type="button" onClick={() => exportProducts()}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button className="rounded-lg bg-secondary hover:bg-secondary/90" type="button" onClick={openAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="bg-secondary/10 rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm">{selectedProducts.length} products selected</span>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="rounded-lg" type="button" onClick={() => void bulkMarkFeatured(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Mark featured
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" type="button" onClick={() => void bulkMarkFeatured(false)}>
                  Unmark featured
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg text-red-600 hover:bg-red-50" type="button" onClick={() => void bulkDelete()}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete selected
                </Button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === filteredProducts.length && filteredProducts.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="accent-primary"
                      />
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Product
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Price
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Stock
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Rating
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="accent-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-muted-foreground">ID: {product.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-muted rounded text-xs">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                          {product.originalPrice != null && (
                            <span className="text-xs text-muted-foreground line-through ml-2">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            onClick={() => openEdit(product)}
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            type="button"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            onClick={() => {
                              setDeleteId(product.id)
                              setDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add new product</DialogTitle>
          </DialogHeader>
          {addForm && (
            <div className="space-y-3 py-2">
              <div>
                <Label>Name</Label>
                <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={addForm.slug} onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Price</Label>
                  <Input value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} />
                </div>
                <div>
                  <Label>Original price (optional)</Label>
                  <Input
                    value={addForm.originalPrice}
                    onChange={(e) => setAddForm({ ...addForm, originalPrice: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                />
              </div>
              <div>
                <Label>Short description</Label>
                <Input
                  value={addForm.shortDescription}
                  onChange={(e) => setAddForm({ ...addForm, shortDescription: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Colors (comma separated)</Label>
                <Input value={addForm.colors} onChange={(e) => setAddForm({ ...addForm, colors: e.target.value })} />
              </div>
              <div>
                <Label>Image URLs (comma separated)</Label>
                <Input value={addForm.images} onChange={(e) => setAddForm({ ...addForm, images: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Rating</Label>
                  <Input value={addForm.rating} onChange={(e) => setAddForm({ ...addForm, rating: e.target.value })} />
                </div>
                <div>
                  <Label>Reviews count</Label>
                  <Input value={addForm.reviews} onChange={(e) => setAddForm({ ...addForm, reviews: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={addForm.featured}
                    onChange={(e) => setAddForm({ ...addForm, featured: e.target.checked })}
                    className="accent-primary"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={addForm.inStock}
                    onChange={(e) => setAddForm({ ...addForm, inStock: e.target.checked })}
                    className="accent-primary"
                  />
                  In stock
                </label>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void saveAdd()} className="bg-secondary hover:bg-secondary/90">
              Create product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-3 py-2">
              <div>
                <Label>Name</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Price</Label>
                  <Input value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                </div>
                <div>
                  <Label>Original price (optional)</Label>
                  <Input
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                />
              </div>
              <div>
                <Label>Short description</Label>
                <Input
                  value={editForm.shortDescription}
                  onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Colors (comma separated)</Label>
                <Input value={editForm.colors} onChange={(e) => setEditForm({ ...editForm, colors: e.target.value })} />
              </div>
              <div>
                <Label>Image URLs (comma separated)</Label>
                <Input value={editForm.images} onChange={(e) => setEditForm({ ...editForm, images: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Rating</Label>
                  <Input value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} />
                </div>
                <div>
                  <Label>Reviews count</Label>
                  <Input value={editForm.reviews} onChange={(e) => setEditForm({ ...editForm, reviews: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                    className="accent-primary"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.inStock}
                    onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                    className="accent-primary"
                  />
                  In stock
                </label>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void saveEdit()} className="bg-secondary hover:bg-secondary/90">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>This removes the product from the catalog. Existing orders stay unchanged.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && void runDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
