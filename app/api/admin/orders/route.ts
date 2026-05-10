import { NextResponse } from "next/server"
import { checkAdmin, adminUnauthorized } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { orderStatusToUi } from "@/lib/order-status"

export async function GET(request: Request) {
  if (!checkAdmin(request)) return adminUnauthorized()

  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })

    const payload = orders.map((o) => ({
      id: o.orderNumber,
      dbId: o.id,
      customer: `${o.firstName} ${o.lastName}`,
      email: o.email,
      date: o.createdAt.toISOString(),
      items: o.items.length,
      total: o.total,
      status: orderStatusToUi(o.status),
      paymentMethod: o.paymentMethod ?? "",
    }))

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 })
  }
}
