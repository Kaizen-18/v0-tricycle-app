"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Mail, Phone, HelpCircle } from "lucide-react"

export default function HelpPage() {
  const router = useRouter()

  const faqItems = [
    {
      question: "How do I book a tricycle?",
      answer:
        "Go to the Home screen and tap 'Book a Tricycle'. Fill in your pickup location, destination, and fare estimate.",
    },
    {
      question: "How do I become a driver?",
      answer:
        "Contact our support team to register as a driver. You'll need to provide your vehicle details and documents.",
    },
    {
      question: "How do payments work?",
      answer: "Payments can be made via cash or GCash. Drivers can confirm cash payments in the Transactions screen.",
    },
    {
      question: "How do I rate a driver?",
      answer: "After completing a ride, you'll be able to rate your driver from the bookings screen.",
    },
  ]

  return (
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
          <h1 className="text-2xl font-bold text-white">Help & Support</h1>
        </div>
      </div>

      {/* Contact Options */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="p-6 rounded-2xl border-2 border-border shadow-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Us</h2>
          <div className="space-y-3">
            <Button className="w-full h-14 justify-start text-left rounded-2xl bg-card hover:bg-card/80 text-foreground border-2 border-border">
              <MessageCircle className="w-5 h-5 mr-3 text-primary" />
              Live Chat
            </Button>
            <Button className="w-full h-14 justify-start text-left rounded-2xl bg-card hover:bg-card/80 text-foreground border-2 border-border">
              <Mail className="w-5 h-5 mr-3 text-primary" />
              support@tricy.com
            </Button>
            <Button className="w-full h-14 justify-start text-left rounded-2xl bg-card hover:bg-card/80 text-foreground border-2 border-border">
              <Phone className="w-5 h-5 mr-3 text-primary" />
              +63 123 456 7890
            </Button>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <Card key={index} className="p-4 rounded-2xl border-2 border-border">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
