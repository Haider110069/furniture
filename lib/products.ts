export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  description: string
  shortDescription: string
  images: string[]
  category: string
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
  colors: string[]
  dimensions?: {
    width: string
    height: string
    depth: string
  }
}

export const categories = [
  { name: "All", slug: "all" },
  { name: "Chairs", slug: "chairs" },
  { name: "Sofas", slug: "sofas" },
  { name: "Tables", slug: "tables" },
  { name: "Lighting", slug: "lighting" },
  { name: "Storage", slug: "storage" },
] as const

export function cartLineId(productId: string, selectedColor: string): string {
  return `${productId}::${selectedColor}`
}
