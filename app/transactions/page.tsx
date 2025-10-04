"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { TransactionCard } from "@/components/transaction-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { transactionsAPI } from "@/lib/api"
import { ArrowLeft, Wallet } from "lucide-react"

export default function TransactionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"user" | "driver">("user")

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user, activeTab])

  const fetchTransactions = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response =
        activeTab === "user"
          ? await transactionsAPI.getUserTransactions(user.id)
          : await transactionsAPI.getDriverTransactions(user.id)

      setTransactions(response.data)
    } catch (error: any) {
      console.error("[v0] Failed to fetch transactions:", error)
      showToast("Failed to load transactions", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmTransaction = async (transactionId: string) => {
    try {
      await transactionsAPI.confirmTransaction(transactionId)
      showToast("Payment confirmed!", "success")
      fetchTransactions()
    } catch (error: any) {
      console.error("[v0] Failed to confirm transaction:", error)
      showToast("Failed to confirm payment", "error")
    }
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
          </div>

          {/* Total Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Balance</p>
                <p className="text-3xl font-bold text-white">₱{totalAmount.toFixed(2)}</p>
              </div>
              <Wallet className="w-10 h-10 text-white/60" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        {user?.role === "driver" && (
          <div className="px-6 -mt-4 mb-4">
            <div className="bg-card rounded-2xl p-1 border-2 border-border flex gap-1">
              <button
                onClick={() => setActiveTab("user")}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "user"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                User Transactions
              </button>
              <button
                onClick={() => setActiveTab("driver")}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "driver"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Driver Earnings
              </button>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onConfirm={handleConfirmTransaction}
                  showConfirmButton={activeTab === "driver"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Your transactions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
