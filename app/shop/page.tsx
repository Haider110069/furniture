import { Suspense } from "react"
import { getProductsByCategory } from "@/lib/data/products"
import { ShopClient } from "./shop-client"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categoryParam } = await searchParams
  const category = categoryParam ?? "all"
  const initialProducts = await getProductsByCategory(category)

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopClient initialProducts={initialProducts} />
    </Suspense>
  )
}

function ShopFallback() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto animate-pulse space-y-8">
        <div className="h-10 bg-muted rounded w-64" />
        <div className="h-96 bg-muted rounded" />
      </div>
    </main>
  )
}
