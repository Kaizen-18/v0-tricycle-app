"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

interface NotificationCardProps {
  notification: {
    id: string
    title: string
    message: string
    type: string
    is_read: boolean
    created_at: string
  }
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type.toLowerCase()) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-600" />
      default:
        return <Info className="w-6 h-6 text-blue-600" />
    }
  }

  const getBgColor = () => {
    switch (notification.type.toLowerCase()) {
      case "success":
        return "bg-green-500/10"
      case "warning":
        return "bg-yellow-500/10"
      case "error":
        return "bg-red-500/10"
      default:
        return "bg-blue-500/10"
    }
  }

  return (
    <Card
      className={`p-4 rounded-2xl border-2 ${notification.is_read ? "opacity-60" : "border-primary/30"} transition-all`}
    >
      <div className="flex gap-3">
        <div className={`w-12 h-12 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{notification.title}</h3>
            {!notification.is_read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleString()}</p>
        </div>
      </div>
    </Card>
  )
}
