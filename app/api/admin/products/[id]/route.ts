import type { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"
import { checkAdmin, adminUnauthorized } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { dbProductToProduct } from "@/lib/product-utils"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().positive().nullable().optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  images: z.array(z.string()).min(1).optional(),
  category: z.string().min(1).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  colors: z.array(z.string()).min(1).optional(),
  dimensions: z
    .object({
      width: z.string(),
      height: z.string(),
      depth: z.string(),
    })
    .nullable()
    .optional(),
})

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(request)) return adminUnauthorized()
  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const d = parsed.data
  const data: Record<string, unknown> = {}
  if (d.name !== undefined) data.name = d.name
  if (d.slug !== undefined) data.slug = d.slug
  if (d.price !== undefined) data.price = d.price
  if (d.originalPrice !== undefined) data.originalPrice = d.originalPrice
  if (d.description !== undefined) data.description = d.description
  if (d.shortDescription !== undefined) data.shortDescription = d.shortDescription
  if (d.images !== undefined) data.images = JSON.stringify(d.images)
  if (d.category !== undefined) data.category = d.category
  if (d.rating !== undefined) data.rating = d.rating
  if (d.reviews !== undefined) data.reviews = d.reviews
  if (d.inStock !== undefined) data.inStock = d.inStock
  if (d.featured !== undefined) data.featured = d.featured
  if (d.colors !== undefined) data.colors = JSON.stringify(d.colors)
  if (d.dimensions !== undefined) {
    data.dimensions = d.dimensions ? JSON.stringify(d.dimensions) : null
  }

  try {
    const row = await prisma.product.update({
      where: { id },
      data: data as Prisma.ProductUpdateInput,
    })
    return NextResponse.json(dbProductToProduct(row))
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(request)) return adminUnauthorized()
  const { id } = await context.params

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
