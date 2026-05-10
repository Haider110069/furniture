import { NextResponse } from "next/server"
import { z } from "zod"
import { checkAdmin, adminUnauthorized } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { dbProductToProduct } from "@/lib/product-utils"

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional().nullable(),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  images: z.array(z.string()).min(1),
  category: z.string().min(1),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  colors: z.array(z.string()).min(1),
  dimensions: z
    .object({
      width: z.string(),
      height: z.string(),
      depth: z.string(),
    })
    .optional()
    .nullable(),
})

export async function GET(request: Request) {
  if (!checkAdmin(request)) return adminUnauthorized()

  try {
    const rows = await prisma.product.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(rows.map(dbProductToProduct))
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) return adminUnauthorized()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product", details: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data
  try {
    const row = await prisma.product.create({
      data: {
        name: d.name,
        slug: d.slug,
        price: d.price,
        originalPrice: d.originalPrice ?? null,
        description: d.description,
        shortDescription: d.shortDescription,
        images: JSON.stringify(d.images),
        category: d.category,
        rating: d.rating ?? 0,
        reviews: d.reviews ?? 0,
        inStock: d.inStock ?? true,
        featured: d.featured ?? false,
        colors: JSON.stringify(d.colors),
        dimensions: d.dimensions ? JSON.stringify(d.dimensions) : null,
      },
    })
    return NextResponse.json(dbProductToProduct(row))
  } catch {
    return NextResponse.json({ error: "Create failed (duplicate slug?)" }, { status: 400 })
  }
}
