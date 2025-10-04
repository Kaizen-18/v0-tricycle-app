"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SplashPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          router.push("/home")
        } else {
          router.push("/login")
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex flex-col items-center justify-center p-6">
      <div className="animate-fade-in text-center">
        <div className="text-8xl mb-6">🛺</div>
        <h1 className="text-5xl font-bold text-white mb-4">TRICY</h1>
        <p className="text-xl text-white/90 font-medium">Ride Anywhere, Anytime</p>
      </div>
    </div>
  )
}
