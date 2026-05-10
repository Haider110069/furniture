"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

interface Review {
  id: string
  name: string
  rating: number
  title: string
  content: string
  verified: boolean
  createdAt: string
}

interface ReviewsDisplayProps {
  productId: string
  refreshTrigger?: number
}

export function ReviewsDisplay({ productId, refreshTrigger }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId, refreshTrigger])

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to write a review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-6 last:border-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{review.name}</h4>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <h5 className="font-medium mb-2">{review.title}</h5>
          <p className="text-muted-foreground leading-relaxed">{review.content}</p>
        </div>
      ))}
    </div>
  )
}
