"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Loader2, MapPin, Phone, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { normalizeCartData, useCart } from "@/hooks/queries/use-cart"
import { useCreateOrder } from "@/hooks/queries/use-orders"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: cartData, isLoading: cartLoading } = useCart({ enabled: isAuthenticated })
  const createOrderMutation = useCreateOrder()

  const [deliveryMethod, setDeliveryMethod] = useState<"campus_delivery" | "pickup">("campus_delivery")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [momoNumber, setMomoNumber] = useState("")
  const [momoProvider, setMomoProvider] = useState("mtn")

  const cart = normalizeCartData(cartData?.data)
  const items = cart?.items || []
  const subtotal = cart?.total || 0
  const deliveryFee = deliveryMethod === "campus_delivery" ? 5 : 0
  const serviceFee = Math.round(subtotal * 0.02 * 100) / 100
  const total = subtotal + deliveryFee + serviceFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (deliveryMethod === "campus_delivery" && !deliveryAddress) {
      toast.error("Please enter a delivery address")
      return
    }

    if (paymentMethod === "momo" && !momoNumber) {
      toast.error("Please enter your mobile money number")
      return
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === "campus_delivery" ? deliveryAddress : undefined,
        delivery_instructions: deliveryInstructions || undefined,
        payment_method: paymentMethod === "card" ? "card" : "momo",
        momo_number: paymentMethod === "momo" ? momoNumber : undefined,
        momo_provider: paymentMethod === "momo" ? momoProvider : undefined,
      })

      if (result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl
      } else {
        toast.success("Order placed successfully!")
        router.push(`/orders/${result.data?.orderId}`)
      }
    } catch {
      toast.error("Failed to place order. Please try again.")
    }
  }

  if (authLoading || cartLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md rounded-lg bg-card p-8 text-center">
          <h1 className="text-2xl font-bold">Sign in to checkout</h1>
          <p className="mt-2 text-muted-foreground">
            You need to be signed in to complete your purchase
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/login?redirect=/checkout">Sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md rounded-lg bg-card p-8 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add some products to your cart before checking out
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <h2 className="mb-4 font-semibold">Delivery Method</h2>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={(v) => setDeliveryMethod(v as "campus_delivery" | "pickup")}
                className="space-y-3"
              >
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="campus_delivery" id="delivery" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Campus Delivery</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Delivered to your hostel or campus location
                    </p>
                    <p className="mt-1 text-sm font-medium">{formatGHS(5)} delivery fee</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Pickup</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pick up from seller&apos;s location
                    </p>
                    <p className="mt-1 text-sm font-medium text-green-600">Free</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {deliveryMethod === "campus_delivery" && (
              <div className="rounded-lg border bg-card p-4">
                <h2 className="mb-4 font-semibold">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="e.g., Room 205, Unity Hall, KNUST"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Delivery Instructions (optional)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Any special instructions for delivery..."
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border bg-card p-4">
              <h2 className="mb-4 font-semibold">Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="momo" id="momo" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Mobile Money</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">Card</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pay with Visa, Mastercard, or other cards
                    </p>
                  </div>
                </label>
              </RadioGroup>

              {paymentMethod === "momo" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="momoProvider">Provider</Label>
                    <RadioGroup
                      value={momoProvider}
                      onValueChange={setMomoProvider}
                      className="mt-2 flex gap-4"
                    >
                      <label className="flex cursor-pointer items-center gap-2">
                        <RadioGroupItem value="mtn" id="mtn" />
                        <span className="text-sm">MTN MoMo</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <RadioGroupItem value="vodafone" id="vodafone" />
                        <span className="text-sm">Vodafone Cash</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <RadioGroupItem value="airteltigo" id="airteltigo" />
                        <span className="text-sm">AirtelTigo</span>
                      </label>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="momoNumber">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="momoNumber"
                        type="tel"
                        placeholder="0201234567"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-6 text-base"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Place Order - {formatGHS(total)}
            </Button>
          </form>
        </div>

        <div>
          <div className="sticky top-20 rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold">Order Summary</h2>

            <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded-lg bg-muted" />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatGHS(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatGHS(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : formatGHS(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee (2%)</span>
                <span>{formatGHS(serviceFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatGHS(total)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                By placing your order, you agree to our Terms of Service and acknowledge that your payment will be held in escrow until you confirm delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
