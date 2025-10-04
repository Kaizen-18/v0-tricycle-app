"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-lg animate-fade-in max-w-sm w-full mx-4",
        type === "success" && "bg-success text-success-foreground",
        type === "error" && "bg-destructive text-destructive-foreground",
        type === "info" && "bg-card text-card-foreground border border-border",
      )}
    >
      <p className="text-center font-medium">{message}</p>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = React.useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type })
  }

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null

  return { showToast, ToastComponent }
}
