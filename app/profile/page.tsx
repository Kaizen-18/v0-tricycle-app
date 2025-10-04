"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ArrowLeft, Mail, Phone, MapPin, Star, LogOut, Settings, HelpCircle } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl text-white font-bold border-4 border-white/30 mb-3">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
          <Badge className="bg-white/20 text-white border-white/30 border">{user.role}</Badge>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-8">
        <Card className="p-6 rounded-2xl border-2 border-border shadow-lg mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{user.phone}</p>
                </div>
              </div>
            )}

            {user.address && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">{user.address}</p>
                </div>
              </div>
            )}

            {user.role === "driver" && user.rating !== undefined && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-medium text-foreground">{user.rating.toFixed(1)} / 5.0</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/settings")}
            className="w-full h-14 justify-start text-left rounded-2xl bg-card hover:bg-card/80 text-foreground border-2 border-border"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>

          <Button
            onClick={() => router.push("/help")}
            className="w-full h-14 justify-start text-left rounded-2xl bg-card hover:bg-card/80 text-foreground border-2 border-border"
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Support
          </Button>

          <Button
            onClick={handleLogout}
            className="w-full h-14 justify-start text-left rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 border-2 border-red-500/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
