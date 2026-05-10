import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products"
import { ProductDetailClient } from "./product-detail-client"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const relatedProducts = await getRelatedProducts(product, 4)
  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
