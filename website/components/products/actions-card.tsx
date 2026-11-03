"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Tag, Heart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CartIcon from "@/components/ui/cart-icon"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAddToCart } from "@/hooks/queries/use-cart"
import { useAuthGate } from "@/providers/auth-gate-provider"

type Props = {
  productId: string
  price: string
  stock?: number
  title: string
  quantity: number
}

function formatGHS(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount)
}

type OfferModalProps = {
  open: boolean
  onClose: () => void
  price: number
  quantity: number
  title: string
}

function OfferModal({ open, onClose, price, quantity, title }: OfferModalProps) {
  const [offerPrice, setOfferPrice] = React.useState("")
  const offerNum = parseFloat(offerPrice) || 0
  const total = offerNum * quantity
  const invalid = offerNum <= 0 || offerNum >= price

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (invalid) return
    toast.success("Offer sent!", {
      description: quantity > 1
        ? `${quantity} items at ${formatGHS(offerNum)} each — ${formatGHS(total)} total`
        : `${formatGHS(offerNum)} for "${title}"`,
    })
    onClose()
    setOfferPrice("")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {quantity > 1 ? `Make Offer for ${quantity} items` : "Make an Offer"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Your offer per item (max {formatGHS(price - 1)})
            </label>
            <Input
              type="number"
              min={1}
              max={price - 1}
              step={1}
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Enter amount in GHS"
              className="h-10"
              autoFocus
            />
            {offerNum >= price && (
              <p className="mt-1 text-xs text-destructive">Offer must be below the listed price</p>
            )}
          </div>

          {quantity > 1 && offerNum > 0 && !invalid && (
            <div className="rounded-lg bg-muted/60 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{quantity} × {formatGHS(offerNum)} = </span>
              <span className="font-semibold text-foreground">{formatGHS(total)}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={invalid || !offerPrice}
              className="flex-1 bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
            >
              Send Offer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ActionsCard({ productId, price, stock, title, quantity }: Props) {
  const [liked, setLiked] = React.useState(false)
  const [offerOpen, setOfferOpen] = React.useState(false)
  const isSoldOut = stock === undefined || stock <= 0
  const priceNum = Number(price)
  const total = priceNum * quantity

  const { mutate: addToCart, isPending } = useAddToCart()
  const { requireAuth } = useAuthGate()
  const router = useRouter()

  const handleAddToCart = () => {
    requireAuth(() =>
      addToCart(
        { productId, quantity },
        {
          onSuccess: () =>
            toast.success(quantity > 1 ? `${quantity} items added to cart` : "Added to cart", {
              description: title,
              action: { label: "View Cart", onClick: () => router.push("/cart") },
            }),
          onError: () => toast.error("Failed to add to cart"),
        }
      )
    )
  }

  return (
    <>
      {isSoldOut ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-5">
            <span className="text-sm font-medium text-muted-foreground">Sold Out</span>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className={cn("w-full h-11 font-semibold", liked && "border-red-300 text-red-500")}
            onClick={() => requireAuth(() => setLiked((v) => !v))}
          >
            <Heart className={cn("mr-2 h-4 w-4", liked && "fill-red-500 text-red-500")} />
            {liked ? "Saved to Favourites" : "Save to Favourites"}
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <Button
            className="w-full h-11 bg-vm-tangerine font-semibold text-vm-tangerine-foreground hover:bg-vm-tangerine/90 vm-button"
            size="lg"
            disabled={isPending}
            onClick={handleAddToCart}
          >
            <CartIcon size={16} className="mr-2" />
            {isPending
              ? "Adding…"
              : quantity > 1
                ? `Add ${quantity} to Cart — ${formatGHS(total)}`
                : "Add to Cart"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="vm-button  w-full h-11 font-semibold "
            onClick={() => requireAuth(() => setOfferOpen(true))}
          >
            <Tag className="mr-2 h-4 w-4" />
            {quantity > 1 ? `Make Offer for ${quantity} items` : "Make an Offer"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={cn("vm-button w-full h-11 font-semibold", liked && "border-red-300 text-red-500")}
            onClick={() => requireAuth(() => setLiked((v) => !v))}
          >
            <Heart className={cn("mr-2 h-4 w-4", liked && "fill-red-500 text-red-500")} />
            {liked ? "Saved to Favourites" : "Save to Favourites"}
          </Button>
        </div>
      )}

      <OfferModal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        price={priceNum}
        quantity={quantity}
        title={title}
      />
    </>
  )
}
