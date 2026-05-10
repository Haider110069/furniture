import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"

const createReviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1),
  content: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createReviewSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { productId, name, email, rating, title, content } = parsed.data

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        productId,
        name,
        email,
        rating,
        title,
        content,
      },
    })

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId }
    })

    const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviews: allReviews.length,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Review creation error:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to 50 most recent reviews
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Review fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
