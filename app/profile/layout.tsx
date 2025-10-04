import type React from "react"
import { BottomNav } from "@/components/bottom-nav"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
