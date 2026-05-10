import { prisma } from "@/lib/db"
import { dbProductToProduct } from "@/lib/product-utils"
import { categories } from "@/lib/products"
import type { Product } from "@/lib/products"

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { name: "asc" } })
  return rows.map(dbProductToProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } })
  return row ? dbProductToProduct(row) : null
}

export async function getFeaturedProducts(limit: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { name: "asc" },
  })
  return rows.map(dbProductToProduct)
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (categorySlug === "all") return getAllProducts()
  const cat = categories.find((c) => c.slug === categorySlug)
  if (!cat || cat.slug === "all") return getAllProducts()
  const rows = await prisma.product.findMany({
    where: { category: cat.name },
    orderBy: { name: "asc" },
  })
  return rows.map(dbProductToProduct)
}

export async function getRelatedProducts(product: Product, limit: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: limit,
    orderBy: { name: "asc" },
  })
  return rows.map(dbProductToProduct)
}
