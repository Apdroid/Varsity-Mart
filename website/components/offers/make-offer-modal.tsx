"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/models"

interface MakeOfferModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (amount: number, message?: string) => void
}

export function MakeOfferModal({ product, open, onOpenChange, onSubmit }: MakeOfferModalProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const { isAuthenticated } = useAuthStore()

  const offerAmount = Number.parseFloat(amount) || 0
  const percentageOfAsking = product.price > 0 ? (offerAmount / product.price) * 100 : 0
  const percentageDifference = 100 - percentageOfAsking

  const isValidOffer = offerAmount >= product.price * 0.7 && offerAmount <= product.price * 0.99
  const canSubmit = isValidOffer && isAuthenticated

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      onSubmit(offerAmount, message || undefined)
      setAmount("")
      setMessage("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={product.images[0] || "/placeholder.svg?height=64&width=64"}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Seller is asking:{" "}
                <span className="font-semibold text-foreground">GH₵{product.price.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Offer Amount */}
          <div className="space-y-2">
            <Label htmlFor="offer-amount">Your Offer Amount</Label>
            <div className="relative flex items-center gap-2">
              <span className=" left-3 top-1/2 text-muted-foreground">GH₵</span>
              <Input
                id="offer-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "pl-3 text-lg h-12",
                  offerAmount > 0 && !isValidOffer && "border-red-500 focus-visible:ring-red-500",
                )}
                step="0.01"
                min="0"
              />
            </div>

            {/* Percentage Display */}
            {offerAmount > 0 && (
              <div className="space-y-1">
                <p className={cn("text-sm font-medium", isValidOffer ? "text-emerald-400" : "text-red-600")}>
                  Your offer is {percentageDifference.toFixed(0)}% {percentageDifference > 0 ? "below" : "above"} asking
                  price
                </p>
                {!isValidOffer && (
                  <p className="text-xs text-red-600">Offers must be between 30% and 95% of the asking price</p>
                )}
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="offer-message">
              Add a message to seller <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="offer-message"
              placeholder="Explain why you're offering this amount..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={150}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{message.length}/150</p>
          </div>

          {/* Rules Note */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              Offers expire in 48 hours. Once accepted, offers are binding. The seller may accept, decline, or send a
              counter offer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit} className="flex-1 bg-primary/80 hover:bg-primary/70">
              Submit Offer
            </Button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-center text-muted-foreground">
              Please{" "}
              <button type="button" className="text-primary hover:underline">
                log in
              </button>{" "}
              to make an offer
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
