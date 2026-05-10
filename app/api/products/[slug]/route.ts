import { NextResponse } from "next/server"
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products"

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  try {
    const product = await getProductBySlug(slug)
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const related = await getRelatedProducts(product, 4)
    return NextResponse.json({ product, related })
  } catch {
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 })
  }
}
