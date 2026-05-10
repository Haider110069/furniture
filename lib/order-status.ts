import type { OrderStatus } from "@prisma/client"

const toUi: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
}

const fromUi: Record<string, OrderStatus> = {
  Pending: "PENDING",
  Processing: "PROCESSING",
  "In Transit": "IN_TRANSIT",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
}

export function orderStatusToUi(status: OrderStatus): string {
  return toUi[status]
}

export function orderStatusFromUi(label: string): OrderStatus | undefined {
  return fromUi[label]
}
