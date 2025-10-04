"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DriverCard } from "@/components/driver-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { driversAPI } from "@/lib/api"
import { ArrowLeft, Users } from "lucide-react"

export default function DriversPage() {
  const router = useRouter()
  const { showToast, ToastComponent } = useToast()
  const [drivers, setDrivers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setIsLoading(true)
      const response = await driversAPI.getDrivers()
      setDrivers(response.data)
    } catch (error: any) {
      console.error("[v0] Failed to fetch drivers:", error)
      showToast("Failed to load drivers", "error")
    } finally {
      setIsLoading(false)
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
            <h1 className="text-2xl font-bold text-white">Available Drivers</h1>
          </div>
        </div>

        {/* Drivers List */}
        <div className="px-6 -mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : drivers.length > 0 ? (
            <div className="space-y-3">
              {drivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No drivers available</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
