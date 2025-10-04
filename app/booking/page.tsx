"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { bookingsAPI } from "@/lib/api"
import { ArrowLeft, MapPin, Navigation } from "lucide-react"

export default function BookingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [formData, setFormData] = useState({
    pickup_location: "",
    destination: "",
    fare_estimate: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await bookingsAPI.createBooking({
        pickup_location: formData.pickup_location,
        destination: formData.destination,
        fare_estimate: Number.parseFloat(formData.fare_estimate),
        notes: formData.notes || undefined,
      })

      showToast("Booking created successfully!", "success")
      router.push("/bookings")
    } catch (error: any) {
      console.error("[v0] Booking failed:", error)
      showToast(error.response?.data?.message || "Failed to create booking", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Book a Tricycle</h1>
          </div>
        </div>

        {/* Booking Form */}
        <div className="px-6 -mt-4">
          <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Pickup Location
                </label>
                <Input
                  type="text"
                  placeholder="Enter pickup location"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Navigation className="w-4 h-4 inline mr-1" />
                  Destination
                </label>
                <Input
                  type="text"
                  placeholder="Enter destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fare Estimate</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₱</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.fare_estimate}
                    onChange={(e) => setFormData({ ...formData, fare_estimate: e.target.value })}
                    required
                    className="h-14 text-base rounded-2xl pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-24 text-base rounded-2xl resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Book Now"}
              </Button>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-500/10 border-2 border-blue-500/20 rounded-2xl p-4">
            <p className="text-sm text-blue-700 font-medium">
              A driver will be assigned to your booking shortly. You'll receive a notification once confirmed.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
