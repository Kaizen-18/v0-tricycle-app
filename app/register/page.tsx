"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "passenger" as "passenger" | "driver",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(formData)
      showToast("Account created successfully!", "success")
      router.push("/home")
    } catch (error: any) {
      console.error("[v0] Registration failed:", error)
      showToast(error.response?.data?.message || "Registration failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-12">
          <div className="text-center">
            <div className="text-6xl mb-3">🛺</div>
            <h1 className="text-3xl font-bold text-white">TRICY</h1>
          </div>
        </div>

        {/* Register Form */}
        <div className="flex-1 -mt-6 bg-background rounded-t-3xl p-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-8">Join TRICY and start your journey</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 912 345 6789"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-14 text-base rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "passenger" })}
                    className={`h-14 rounded-2xl border-2 font-semibold transition-all ${
                      formData.role === "passenger"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground hover:border-primary/50"
                    }`}
                  >
                    Passenger
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "driver" })}
                    className={`h-14 rounded-2xl border-2 font-semibold transition-all ${
                      formData.role === "driver"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground hover:border-primary/50"
                    }`}
                  >
                    Driver
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
