import { NextResponse } from "next/server"
import { z } from "zod"
import { checkAdmin, adminUnauthorized } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { orderStatusFromUi, orderStatusToUi } from "@/lib/order-status"

const patchSchema = z.object({
  status: z.string(),
})

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(request)) return adminUnauthorized()
  const { id } = await context.params

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({
      id: order.orderNumber,
      dbId: order.id,
      status: orderStatusToUi(order.status),
      paymentMethod: order.paymentMethod ?? "",
      paymentLast4: order.paymentLast4,
      email: order.email,
      phone: order.phone,
      customer: `${order.firstName} ${order.lastName}`.trim(),
      address: `${order.address}, ${order.city}, ${order.state} ${order.zip}, ${order.country}`,
      shippingMethod: order.shippingMethod,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        color: i.selectedColor,
        imageUrl: i.imageUrl,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

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

  const status = orderStatusFromUi(parsed.data.status)
  if (!status) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json({ ok: true, id: updated.id, status: parsed.data.status })
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }
}
