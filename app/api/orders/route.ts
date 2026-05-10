import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { orderStatusToUi } from "@/lib/order-status"

const lineSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  selectedColor: z.string(),
})

const createOrderSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card", "cash_on_delivery", "jazzcash", "easypaisa"]),
  paymentLast4: z.string().max(4).optional(),
  walletAccount: z.string().optional(),
  items: z.array(lineSchema).min(1),
})

function newOrderNumber(): string {
  return `FRN-${randomBytes(4).toString("hex").toUpperCase()}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")
  if (!email) {
    return NextResponse.json({ error: "email query required" }, { status: 400 })
  }

  try {
    const orders = await prisma.order.findMany({
      where: { email: email.toLowerCase().trim() },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })

    const payload = orders.map((o) => ({
      id: o.orderNumber,
      dbId: o.id,
      date: o.createdAt.toISOString(),
      status: orderStatusToUi(o.status),
      total: o.total,
      items: o.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        price: i.unitPrice,
        image: i.imageUrl,
        selectedColor: i.selectedColor,
      })),
    }))

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order", details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const productIds = [...new Set(data.items.map((i) => i.productId))]

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, inStock: true },
    })

    const byId = new Map(products.map((p) => [p.id, p]))
    let subtotal = 0

    const lineData: {
      productId: string
      productName: string
      productSlug: string
      unitPrice: number
      quantity: number
      selectedColor: string
      imageUrl: string
    }[] = []

    for (const line of data.items) {
      const p = byId.get(line.productId)
      if (!p) {
        return NextResponse.json({ error: `Product unavailable: ${line.productId}` }, { status: 400 })
      }
      const colors = JSON.parse(p.colors) as string[]
      if (!colors.includes(line.selectedColor)) {
        return NextResponse.json({ error: `Invalid color for ${p.name}` }, { status: 400 })
      }
      const price = p.price
      subtotal += price * line.quantity
      const images = JSON.parse(p.images) as string[]
      lineData.push({
        productId: p.id,
        productName: p.name,
        productSlug: p.slug,
        unitPrice: price,
        quantity: line.quantity,
        selectedColor: line.selectedColor,
        imageUrl: images[0] ?? "/placeholder.svg",
      })
    }

    const shippingCost =
      data.shippingMethod === "express"
        ? 19.99
        : subtotal > 50
          ? 0
          : 9.99
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100

    let paymentLast4Out: string | null = null
    if (data.paymentMethod === "card") {
      paymentLast4Out = data.paymentLast4?.slice(-4) ?? null
    } else if (data.paymentMethod === "jazzcash" || data.paymentMethod === "easypaisa") {
      const d = data.walletAccount?.replace(/\D/g, "") ?? ""
      paymentLast4Out = d.slice(-4) || null
    }

    const orderNumber = newOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: data.email.toLowerCase().trim(),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? null,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        shippingMethod: data.shippingMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        paymentLast4: paymentLast4Out,
        paymentMethod: data.paymentMethod,
        items: {
          create: lineData,
        },
      },
    })

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      total,
      email: order.email,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
