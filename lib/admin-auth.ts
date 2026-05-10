import { NextResponse } from "next/server"

export function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function checkAdmin(request: Request): boolean {
  const secret = process.env.ADMIN_API_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  return auth === `Bearer ${secret}`
}
