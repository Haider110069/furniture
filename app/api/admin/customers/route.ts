import { NextResponse } from "next/server"
import { checkAdmin, adminUnauthorized } from "@/lib/admin-auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  if (!checkAdmin(request)) return adminUnauthorized()

  try {
    const grouped = await prisma.order.groupBy({
      by: ["email"],
      _count: { id: true },
      _sum: { total: true },
      _min: { createdAt: true },
      _max: { createdAt: true },
    })

    const payload = await Promise.all(
      grouped.map(async (g, index) => {
        const lastOrder = await prisma.order.findFirst({
          where: { email: g.email },
          orderBy: { createdAt: "desc" },
          select: { firstName: true, lastName: true },
        })
        const spent = g._sum.total ?? 0
        const orders = g._count.id
        let status = "Active"
        if (spent > 2000) status = "VIP"
        else if (
          orders <= 2 &&
          (g._max.createdAt?.getTime() ?? 0) > Date.now() - 30 * 24 * 3600 * 1000
        ) {
          status = "New"
        }

        const name =
          lastOrder && `${lastOrder.firstName} ${lastOrder.lastName}`.trim()
            ? `${lastOrder.firstName} ${lastOrder.lastName}`
            : g.email

        return {
          id: String(index + 1),
          name,
          email: g.email,
          orders,
          spent,
          joined: (g._min.createdAt ?? new Date()).toISOString().slice(0, 10),
          status,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(g.email)}`,
        }
      })
    )

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: "Failed to load customers" }, { status: 500 })
  }
}
