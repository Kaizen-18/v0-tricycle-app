"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookingCardProps {
  booking: {
    id: string
    pickup_location: string
    destination: string
    fare_estimate: number
    status: string
    created_at: string
    driver?: {
      name: string
      plate_number: string
    }
  }
  onClick?: () => void
}

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "accepted":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="p-4 rounded-2xl border-2 hover:border-primary/50 transition-all cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <Badge className={`${getStatusColor(booking.status)} border`}>{booking.status}</Badge>
        <span className="text-lg font-bold text-foreground">₱{booking.fare_estimate}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Pickup</p>
            <p className="text-sm font-medium text-foreground">{booking.pickup_location}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Destination</p>
            <p className="text-sm font-medium text-foreground">{booking.destination}</p>
          </div>
        </div>
      </div>

      {booking.driver && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Driver</p>
          <p className="text-sm font-medium text-foreground">
            {booking.driver.name} • {booking.driver.plate_number}
          </p>
        </div>
      )}
    </Card>
  )
}
