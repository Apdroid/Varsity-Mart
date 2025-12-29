"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Offer } from "@/types/models"

interface CounterOfferModalProps {
  offer: Offer
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (amount: number, message?: string) => void
}

export function CounterOfferModal({ offer, open, onOpenChange, onSubmit }: CounterOfferModalProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")

  const counterAmount = Number.parseFloat(amount) || 0
  const isValidCounter = counterAmount > offer.amount && counterAmount <= offer.product.price

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidCounter) {
      onSubmit(counterAmount, message || undefined)
      setAmount("")
      setMessage("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Counter Offer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Negotiation Timeline */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Negotiation History</p>
            <div className="flex items-center gap-2 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Original Price</p>
                <p className="font-semibold">GH₵{offer.product.price.toLocaleString()}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Buyer's Offer</p>
                <p className="font-semibold text-blue-600">GH₵{offer.amount.toLocaleString()}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Your Counter</p>
                <p className="font-semibold text-primary">
                  {counterAmount > 0 ? `GH₵${counterAmount.toLocaleString()}` : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm">
              <span className="font-medium">
                {offer.buyer.firstName} {offer.buyer.lastName}
              </span>{" "}
              offered <span className="font-semibold text-blue-600">GH₵{offer.amount.toLocaleString()}</span>
            </p>
            {offer.message && <p className="text-sm text-muted-foreground mt-1 italic">"{offer.message}"</p>}
          </div>

          {/* Counter Amount */}
          <div className="space-y-2">
            <Label htmlFor="counter-amount">Counter Offer Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">GH₵</span>
              <Input
                id="counter-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "pl-10 text-lg h-12",
                  counterAmount > 0 && !isValidCounter && "border-red-500 focus-visible:ring-red-500",
                )}
                step="0.01"
                min="0"
              />
            </div>

            {counterAmount > 0 && !isValidCounter && (
              <p className="text-xs text-red-600">
                Counter offer must be more than buyer's offer and not exceed your asking price
              </p>
            )}
          </div>

          {/* Counter Message */}
          <div className="space-y-2">
            <Label htmlFor="counter-message">Explain your counter offer</Label>
            <Textarea
              id="counter-message"
              placeholder="Let the buyer know why you're countering..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={150}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{message.length}/150</p>
          </div>

          {/* Note */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              Buyer has 24 hours to respond to your counter offer. Be reasonable to increase chances of acceptance.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValidCounter} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Send Counter Offer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
