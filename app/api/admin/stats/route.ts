import { NextResponse } from "next/server"
import { checkAdmin, adminUnauthorized } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"
import { orderStatusToUi } from "@/lib/order-status"

export async function GET(request: Request) {
  if (!checkAdmin(request)) return adminUnauthorized()

  try {
    const [orderAgg, productCount, customerRows, revenueAgg] = await Promise.all([
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.product.count(),
      prisma.order.groupBy({
        by: ["email"],
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ])

    const ordersByStatus = Object.fromEntries(
      orderAgg.map((r) => [orderStatusToUi(r.status), r._count.id])
    )

    const totalOrders = orderAgg.reduce((a, r) => a + r._count.id, 0)
    const totalRevenue = revenueAgg._sum.total ?? 0

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts: productCount,
      totalCustomers: customerRows.length,
      ordersByStatus,
    })
  } catch {
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
