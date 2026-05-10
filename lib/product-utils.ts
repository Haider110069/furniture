import type { Product } from "@/lib/products"
import type { Product as DbProduct } from "@prisma/client"

export function dbProductToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    description: row.description,
    shortDescription: row.shortDescription,
    images: JSON.parse(row.images) as string[],
    category: row.category,
    rating: row.rating,
    reviews: row.reviews,
    inStock: row.inStock,
    featured: row.featured,
    colors: JSON.parse(row.colors) as string[],
    dimensions: row.dimensions
      ? (JSON.parse(row.dimensions) as Product["dimensions"])
      : undefined,
  }
}
