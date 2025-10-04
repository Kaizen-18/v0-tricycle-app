"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { BookingCard } from "@/components/booking-card"
import { DriverCard } from "@/components/driver-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { bookingsAPI, driversAPI, transactionsAPI } from "@/lib/api"
import { MapPin, Plus, Wallet } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [earnings, setEarnings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      if (user?.role === "passenger") {
        // Fetch bookings and available drivers
        const [bookingsRes, driversRes] = await Promise.all([bookingsAPI.getBookings(), driversAPI.getDrivers()])

        setBookings(bookingsRes.data.slice(0, 5))
        setDrivers(driversRes.data.slice(0, 3))
      } else if (user?.role === "driver") {
        // Fetch driver's bookings and earnings
        const [bookingsRes, transactionsRes] = await Promise.all([
          bookingsAPI.getBookings(),
          transactionsAPI.getDriverTransactions(user.id),
        ])

        setBookings(bookingsRes.data.slice(0, 5))

        // Calculate total earnings
        const total = transactionsRes.data.reduce((sum: number, t: any) => sum + t.amount, 0)
        setEarnings(total)
      }
    } catch (error: any) {
      console.error("[v0] Failed to fetch data:", error)
      showToast("Failed to load data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl text-white font-bold">
              {user.name.charAt(0)}
            </div>
          </div>

          {user.role === "driver" && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold text-white">₱{earnings.toFixed(2)}</p>
                </div>
                <Wallet className="w-10 h-10 text-white/60" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 -mt-4">
          {user.role === "passenger" ? (
            <>
              {/* Book Tricycle Button */}
              <Button
                onClick={() => router.push("/booking")}
                className="w-full h-16 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg mb-6"
              >
                <Plus className="w-6 h-6 mr-2" />
                Book a Tricycle
              </Button>

              {/* Available Drivers */}
              {drivers.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Available Drivers</h2>
                    <Button variant="ghost" onClick={() => router.push("/drivers")} className="text-primary">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {drivers.map((driver) => (
                      <DriverCard key={driver.id} driver={driver} onClick={() => router.push("/drivers")} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Bookings */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Bookings</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} onClick={() => router.push("/bookings")} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No bookings yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Book your first ride to get started</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Driver View - Assigned Rides */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Your Rides</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} onClick={() => router.push("/bookings")} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No rides assigned yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Wait for passengers to book</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
