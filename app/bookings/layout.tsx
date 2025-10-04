import type React from "react"
import { BottomNav } from "@/components/bottom-nav"

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
