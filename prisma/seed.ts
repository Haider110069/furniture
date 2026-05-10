import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const seedProducts = [
  {
    name: "Nordic Chair",
    slug: "nordic-chair",
    price: 50.0,
    originalPrice: 75.0,
    description:
      "The Nordic Chair combines Scandinavian minimalism with exceptional comfort. Crafted from sustainably sourced oak wood with a natural finish, this chair features a ergonomically curved backrest and a plush cushioned seat upholstered in premium linen fabric. Perfect for dining rooms, home offices, or as an accent piece in any modern interior.",
    shortDescription: "Scandinavian-inspired design with premium oak construction",
    images: ["/images/nordic-chair.jpg", "/images/nordic-chair-2.jpg", "/images/nordic-chair-3.jpg"],
    category: "Chairs",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    colors: ["Natural Oak", "Walnut", "White"],
    dimensions: { width: "52cm", height: "82cm", depth: "48cm" },
  },
  {
    name: "Kruzo Aero Chair",
    slug: "kruzo-aero-chair",
    price: 78.0,
    originalPrice: null as number | null,
    description:
      "Experience weightless comfort with the Kruzo Aero Chair. Its innovative mesh back provides superior ventilation while the high-density foam seat offers lasting support throughout long sitting sessions. The sleek powder-coated steel frame ensures durability while maintaining an elegant profile.",
    shortDescription: "Breathable mesh design with ergonomic lumbar support",
    images: ["/images/kruzo-chair.jpg", "/images/kruzo-chair-2.jpg"],
    category: "Chairs",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: true,
    colors: ["Olive Green", "Charcoal", "Cream"],
    dimensions: { width: "58cm", height: "95cm", depth: "54cm" },
  },
  {
    name: "Ergonomic Chair",
    slug: "ergonomic-chair",
    price: 43.0,
    originalPrice: 65.0,
    description:
      "Designed for the modern workspace, the Ergonomic Chair features adjustable lumbar support, a breathable fabric seat, and smooth-rolling casters. The minimalist design fits seamlessly into any contemporary setting while providing all-day comfort for work or study.",
    shortDescription: "Adjustable comfort for the modern workspace",
    images: ["/images/ergonomic-chair.jpg", "/images/ergonomic-chair-2.jpg"],
    category: "Chairs",
    rating: 4.5,
    reviews: 156,
    inStock: true,
    featured: true,
    colors: ["Gray", "Blue", "Black"],
    dimensions: { width: "60cm", height: "100cm", depth: "58cm" },
  },
  {
    name: "Milano Sofa",
    slug: "milano-sofa",
    price: 899.0,
    originalPrice: 1199.0,
    description:
      "The Milano Sofa brings Italian elegance to your living space. Featuring deep cushioning with high-resilience foam, a solid hardwood frame, and premium velvet upholstery, this three-seater sofa is designed for both style and longevity. The tapered wooden legs add a mid-century modern touch.",
    shortDescription: "Italian-inspired luxury with velvet upholstery",
    images: ["/images/milano-sofa.jpg", "/images/milano-sofa-2.jpg"],
    category: "Sofas",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    featured: true,
    colors: ["Teal", "Emerald", "Navy"],
    dimensions: { width: "220cm", height: "85cm", depth: "95cm" },
  },
  {
    name: "Wooden Side Table",
    slug: "wooden-side-table",
    price: 35.0,
    originalPrice: null,
    description:
      "This minimalist wooden side table showcases the natural beauty of solid ash wood. The simple yet elegant design features clean lines and a smooth matte finish. Perfect as a bedside table, lamp stand, or accent piece beside your favorite reading chair.",
    shortDescription: "Minimalist ash wood with natural finish",
    images: ["/images/side-table.jpg", "/images/side-table-2.jpg"],
    category: "Tables",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    featured: false,
    colors: ["Natural", "Oak", "Ebony"],
    dimensions: { width: "45cm", height: "55cm", depth: "45cm" },
  },
  {
    name: "Modern Pendant Lamp",
    slug: "modern-pendant-lamp",
    price: 120.0,
    originalPrice: null,
    description:
      "Illuminate your space with the Modern Pendant Lamp. The sculptural shade is crafted from hand-blown glass with a subtle smoke tint, creating warm ambient lighting. Adjustable cord length allows for customization to fit any ceiling height.",
    shortDescription: "Hand-blown glass with adjustable cord",
    images: ["/images/pendant-lamp.jpg", "/images/pendant-lamp-2.jpg"],
    category: "Lighting",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    featured: false,
    colors: ["Smoke", "Clear", "Amber"],
    dimensions: { width: "30cm", height: "35cm", depth: "30cm" },
  },
  {
    name: "Loft Coffee Table",
    slug: "loft-coffee-table",
    price: 245.0,
    originalPrice: null,
    description:
      "The Loft Coffee Table combines industrial charm with refined aesthetics. A substantial oak top sits atop a sleek black steel frame, creating a striking centerpiece for your living room. The lower shelf provides practical storage for books and magazines.",
    shortDescription: "Industrial oak and steel construction",
    images: ["/images/coffee-table.jpg", "/images/coffee-table-2.jpg"],
    category: "Tables",
    rating: 4.8,
    reviews: 112,
    inStock: true,
    featured: true,
    colors: ["Oak/Black", "Walnut/Gold"],
    dimensions: { width: "120cm", height: "45cm", depth: "60cm" },
  },
  {
    name: "Velvet Accent Chair",
    slug: "velvet-accent-chair",
    price: 189.0,
    originalPrice: null,
    description:
      "Make a statement with the Velvet Accent Chair. The curved silhouette and plush velvet upholstery create a luxurious seating experience. Gold-finished legs add a touch of glamour, making this chair perfect for living rooms, bedrooms, or entryways.",
    shortDescription: "Luxurious velvet with gold-finished legs",
    images: ["/images/accent-chair.jpg", "/images/accent-chair-2.jpg"],
    category: "Chairs",
    rating: 4.7,
    reviews: 94,
    inStock: true,
    featured: false,
    colors: ["Blush Pink", "Sage Green", "Mustard"],
    dimensions: { width: "72cm", height: "78cm", depth: "68cm" },
  },
  {
    name: "Minimalist Bookshelf",
    slug: "minimalist-bookshelf",
    price: 320.0,
    originalPrice: null,
    description:
      "This open-concept bookshelf brings modern simplicity to your storage needs. Five generous shelves provide ample space for books, decor, and collectibles. The powder-coated steel frame and oak shelves create a timeless look that complements any interior style.",
    shortDescription: "Five-tier open shelving in oak and steel",
    images: ["/images/bookshelf.jpg", "/images/bookshelf-2.jpg"],
    category: "Storage",
    rating: 4.6,
    reviews: 145,
    inStock: true,
    featured: false,
    colors: ["White/Oak", "Black/Walnut"],
    dimensions: { width: "80cm", height: "180cm", depth: "35cm" },
  },
  {
    name: "Ceramic Table Lamp",
    slug: "ceramic-table-lamp",
    price: 85.0,
    originalPrice: null,
    description:
      "Handcrafted by artisans, each Ceramic Table Lamp features unique glazing patterns. The organic form and warm light create a cozy atmosphere. Paired with a natural linen shade, this lamp adds texture and warmth to any bedside or desk.",
    shortDescription: "Artisan-crafted with natural linen shade",
    images: ["/images/table-lamp.jpg", "/images/table-lamp-2.jpg"],
    category: "Lighting",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    featured: false,
    colors: ["Terracotta", "Sage", "Cream"],
    dimensions: { width: "25cm", height: "48cm", depth: "25cm" },
  },
  {
    name: "Modular Sectional Sofa",
    slug: "modular-sectional-sofa",
    price: 1450.0,
    originalPrice: null,
    description:
      "Create your perfect seating arrangement with the Modular Sectional Sofa. Each piece connects securely while allowing endless configuration possibilities. Premium bouclé fabric and deep cushioning ensure comfort, while the clean lines maintain a sophisticated aesthetic.",
    shortDescription: "Configurable bouclé fabric sectional",
    images: ["/images/sectional-sofa.jpg", "/images/sectional-sofa-2.jpg"],
    category: "Sofas",
    rating: 4.9,
    reviews: 43,
    inStock: true,
    featured: true,
    colors: ["Ivory", "Charcoal", "Camel"],
    dimensions: { width: "280cm", height: "75cm", depth: "170cm" },
  },
  {
    name: "Rattan Dining Chair",
    slug: "rattan-dining-chair",
    price: 125.0,
    originalPrice: null,
    description:
      "Bring natural beauty to your dining space with the Rattan Dining Chair. Expertly woven rattan on a solid teak frame creates a chair that's both sturdy and stunning. The curved back provides excellent support while the open weave keeps you cool.",
    shortDescription: "Hand-woven rattan on solid teak frame",
    images: ["/images/rattan-chair.jpg", "/images/rattan-chair-2.jpg"],
    category: "Chairs",
    rating: 4.6,
    reviews: 88,
    inStock: true,
    featured: false,
    colors: ["Natural Rattan", "Black Rattan"],
    dimensions: { width: "55cm", height: "85cm", depth: "52cm" },
  },
]

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  for (const p of seedProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        description: p.description,
        shortDescription: p.shortDescription,
        images: JSON.stringify(p.images),
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
        inStock: p.inStock,
        featured: p.featured,
        colors: JSON.stringify(p.colors),
        dimensions: p.dimensions ? JSON.stringify(p.dimensions) : null,
      },
    })
  }

  console.log(`Seeded ${seedProducts.length} products`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
