"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownLeft, ArrowUpRight, CheckCircle2 } from "lucide-react"

interface TransactionCardProps {
  transaction: {
    id: string
    amount: number
    status: string
    payment_method: string
    created_at: string
    booking?: {
      pickup_location: string
      destination: string
    }
  }
  onConfirm?: (id: string) => void
  showConfirmButton?: boolean
}

export function TransactionCard({ transaction, onConfirm, showConfirmButton }: TransactionCardProps) {
  const isIncome = transaction.amount > 0
  const isPending = transaction.status.toLowerCase() === "pending"

  return (
    <Card className="p-4 rounded-2xl border-2">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isIncome ? "bg-green-500/10" : "bg-red-500/10"
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{isIncome ? "Income" : "Payment"}</p>
            <p className="text-xs text-muted-foreground">{transaction.payment_method}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}>
            {isIncome ? "+" : "-"}₱{Math.abs(transaction.amount).toFixed(2)}
          </p>
          <Badge
            className={`mt-1 ${
              isPending
                ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                : "bg-green-500/10 text-green-700 border-green-500/20"
            } border`}
          >
            {transaction.status}
          </Badge>
        </div>
      </div>

      {transaction.booking && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="truncate">From: {transaction.booking.pickup_location}</p>
          <p className="truncate">To: {transaction.booking.destination}</p>
        </div>
      )}

      {showConfirmButton && isPending && onConfirm && (
        <Button
          onClick={() => onConfirm(transaction.id)}
          className="w-full mt-3 rounded-2xl bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Confirm Cash Payment
        </Button>
      )}

      <p className="text-xs text-muted-foreground mt-3">{new Date(transaction.created_at).toLocaleString()}</p>
    </Card>
  )
}
