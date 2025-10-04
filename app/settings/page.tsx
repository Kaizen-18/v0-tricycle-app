"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { authAPI } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.updateProfile(formData)
      await refreshUser()
      showToast("Profile updated successfully!", "success")
    } catch (error: any) {
      console.error("[v0] Failed to update profile:", error)
      showToast(error.response?.data?.message || "Failed to update profile", "error")
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
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </div>

        {/* Settings Form */}
        <div className="px-6 -mt-4">
          <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <Input
                  type="text"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
