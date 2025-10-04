"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { ratingsAPI } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

export default function RatingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { showToast, ToastComponent } = useToast()

  const userId = searchParams.get("userId")
  const userName = searchParams.get("userName") || "User"

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      showToast("Please select a rating", "error")
      return
    }

    if (!userId) {
      showToast("Invalid user ID", "error")
      return
    }

    setIsLoading(true)

    try {
      await ratingsAPI.rateUser(userId, {
        rating,
        comment: comment || undefined,
      })

      showToast("Rating submitted successfully!", "success")
      router.back()
    } catch (error: any) {
      console.error("[v0] Failed to submit rating:", error)
      showToast(error.response?.data?.message || "Failed to submit rating", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getRatingEmoji = () => {
    if (rating === 0) return "😐"
    if (rating === 1) return "😞"
    if (rating === 2) return "😕"
    if (rating === 3) return "😊"
    if (rating === 4) return "😄"
    return "🤩"
  }

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Rate Your Experience</h1>
          </div>
        </div>

        {/* Rating Form */}
        <div className="px-6 -mt-4">
          <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl text-white font-bold mx-auto mb-3">
                  {userName.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-foreground">{userName}</h2>
                <p className="text-sm text-muted-foreground">How was your ride?</p>
              </div>

              {/* Star Rating */}
              <div className="text-center space-y-4">
                <div className="text-6xl">{getRatingEmoji()}</div>
                <div className="flex justify-center">
                  <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                </div>
                {rating > 0 && (
                  <p className="text-sm font-medium text-foreground">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Additional Comments (Optional)</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-32 text-base rounded-2xl resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || rating === 0}
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Submit Rating"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
