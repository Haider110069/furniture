import type { Metadata } from "next"
import { AdminApiKeyBanner } from "@/components/admin-api-key-banner"

export const metadata: Metadata = {
  title: "Admin Dashboard - Furni",
  description: "Manage your furniture store",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminApiKeyBanner />
      {children}
    </>
  )
}
