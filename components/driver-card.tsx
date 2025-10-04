"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface DriverCardProps {
  driver: {
    id: string
    name: string
    plate_number: string
    rating: number
    total_rides: number
    photo_url?: string
  }
  onClick?: () => void
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  return (
    <Card className="p-4 rounded-2xl border-2 hover:border-primary/50 transition-all cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl text-white font-bold flex-shrink-0">
          {driver.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg truncate">{driver.name}</h3>
          <p className="text-sm text-muted-foreground">{driver.plate_number}</p>

          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium text-foreground">{driver.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{driver.total_rides} rides</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
