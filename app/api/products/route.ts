import { NextResponse } from "next/server"
import { getAllProducts, getProductsByCategory } from "@/lib/data/products"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") ?? "all"

  try {
    const products =
      category === "all" ? await getAllProducts() : await getProductsByCategory(category)
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}
