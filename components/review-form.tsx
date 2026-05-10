"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface ReviewFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ open, onOpenChange, productId, onReviewSubmitted }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.title || !formData.content) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast.success("Review submitted successfully!")
      setFormData({ name: "", email: "", rating: 5, title: "", content: "" })
      onOpenChange(false)
      onReviewSubmitted()
    } catch (error) {
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating} out of 5
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Review</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your thoughts about this product..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
