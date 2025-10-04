"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  phone_number: string
  role: "passenger" | "driver"
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    phone_number: string
    password: string
    role: "passenger" | "driver"
  }) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedToken = localStorage.getItem("tricy_token")
    const storedUser = localStorage.getItem("tricy_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      const { access_token, user: userData } = response.data

      localStorage.setItem("tricy_token", access_token)
      localStorage.setItem("tricy_user", JSON.stringify(userData))

      setToken(access_token)
      setUser(userData)
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const register = async (data: {
    name: string
    email: string
    phone_number: string
    password: string
    role: "passenger" | "driver"
  }) => {
    try {
      const response = await authAPI.register(data)
      const { access_token, user: userData } = response.data

      localStorage.setItem("tricy_token", access_token)
      localStorage.setItem("tricy_user", JSON.stringify(userData))

      setToken(access_token)
      setUser(userData)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("tricy_token")
    localStorage.removeItem("tricy_user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
