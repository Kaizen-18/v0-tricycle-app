"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { NotificationCard } from "@/components/notification-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { notificationsAPI } from "@/lib/api"
import { ArrowLeft, Bell } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await notificationsAPI.getUserNotifications(user.id)
      setNotifications(response.data)
    } catch (error: any) {
      console.error("[v0] Failed to fetch notifications:", error)
      showToast("Failed to load notifications", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && <p className="text-white/80 text-sm">{unreadCount} unread</p>}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="px-6 -mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">You'll be notified about your bookings here</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
