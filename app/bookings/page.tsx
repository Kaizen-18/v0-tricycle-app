"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { BookingCard } from "@/components/booking-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { bookingsAPI } from "@/lib/api"
import { ArrowLeft, MapPin } from "lucide-react"

export default function BookingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await bookingsAPI.getBookings()
      setBookings(response.data)
    } catch (error: any) {
      console.error("[v0] Failed to fetch bookings:", error)
      showToast("Failed to load bookings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await bookingsAPI.completeBooking(bookingId)
      showToast("Booking completed!", "success")
      fetchBookings()
    } catch (error: any) {
      console.error("[v0] Failed to complete booking:", error)
      showToast("Failed to complete booking", "error")
    }
  }

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-background pb-24">
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
            <h1 className="text-2xl font-bold text-white">My Bookings</h1>
          </div>
        </div>

        {/* Bookings List */}
        <div className="px-6 -mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id}>
                  <BookingCard booking={booking} />
                  {user?.role === "driver" && booking.status === "accepted" && (
                    <Button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="w-full mt-2 rounded-2xl bg-green-600 hover:bg-green-700"
                    >
                      Complete Ride
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No bookings found</p>
              <p className="text-sm text-muted-foreground mt-1">Your bookings will appear here</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
