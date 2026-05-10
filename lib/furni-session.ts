"use client"

export type FurniUserSession = {
  email: string
  name: string
  avatar: string | null
}

const KEY = "furni-user-session"

export function readFurniSession(): FurniUserSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Partial<FurniUserSession>
    if (!p.email || typeof p.email !== "string") return null
    return {
      email: p.email.trim().toLowerCase(),
      name: typeof p.name === "string" && p.name.trim() ? p.name.trim() : "Customer",
      avatar: typeof p.avatar === "string" && p.avatar.startsWith("data:") ? p.avatar : null,
    }
  } catch {
    return null
  }
}

export function saveFurniSession(session: FurniUserSession) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearFurniSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
  localStorage.removeItem("furni-account-email")
}
