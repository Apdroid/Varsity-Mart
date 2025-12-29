"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, MapPin, CreditCard, Shield, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { mockCheckoutCartItems as mockCartItems, savedAddresses, paymentMethods } from "@/data/checkout/checkout-items"

type CheckoutStep = "address" | "payment" | "review"

export function CheckoutPageContent() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id)
  const [selectedPayment, setSelectedPayment] = useState("momo")
  const [momoNumber, setMomoNumber] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = 25
  const serviceFee = Math.round(subtotal * 0.02)
  const total = subtotal + deliveryFee + serviceFee

  const steps = [
    { id: "address", label: "Address" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    window.location.href = "/checkout/success"
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/cart" className="hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                index <= currentStepIndex
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground border border-border",
              )}
            >
              {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium hidden sm:block",
                index <= currentStepIndex ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-4 text-muted-foreground hidden sm:block" />
            )}
            {index < steps.length - 1 && <div className="w-8 h-px bg-border sm:hidden mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Address Step */}
          {currentStep === "address" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg text-foreground">Delivery Address</h2>
              </div>

              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-3">
                {savedAddresses.map((address) => (
                  <label
                    key={address.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors",
                      selectedAddress === address.id
                        ? "text-primary bg-primary/10 dark:bg-primary-80"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    <RadioGroupItem value={address.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{address.label}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{address.street}</p>
                      <p className="text-sm text-muted-foreground">{address.city}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <Button variant="outline" className="w-full bg-accent hover:bg-primary/10">
                + Add New Address
              </Button>

              <div className="space-y-2">
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for delivery..."
                  value={orderNotes}
									className="bg-accent"
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button className="text-slate-200 hover:text-slate-100 gap-2" onClick={() => setCurrentStep("payment")}>
                  Continue to Payment
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg text-foreground">Payment Method</h2>
              </div>

              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors",
                      selectedPayment === method.id
                        ? "text-primary bg-primary/10 dark:bg-primary/20"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    <RadioGroupItem value={method.id} className="mt-1" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{method.name}</span>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {selectedPayment === "momo" && (
                <div className="space-y-2 p-6 rounded-xl bg-muted/90">
                  <Label htmlFor="momoNumber">Mobile Money Number</Label>
                  <Input
                    id="momoNumber"
										className="bg-background"
                    type="tel"
                    placeholder="024 XXX XXXX"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">You will receive a prompt to authorize the payment</p>
                </div>
              )}

              <div className="flex items-center gap-2 p-4 rounded-xl text-primary  border border-primary/20 ">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-primary dark:text-primary">
                  Your payment is protected by escrow. Funds are only released to the seller after you confirm delivery.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" className="bg-transparent gap-2" onClick={() => setCurrentStep("address")}>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button className="text-slate-100 hover:text-slate-50 gap-2" onClick={() => setCurrentStep("review")}>
                  Review Order
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-lg text-foreground">Review Your Order</h2>

              {/* Delivery Address */}
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Delivery Address</span>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => setCurrentStep("address")}
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-foreground">{savedAddresses.find((a) => a.id === selectedAddress)?.street}</p>
                <p className="text-muted-foreground">{savedAddresses.find((a) => a.id === selectedAddress)?.city}</p>
              </div>

              {/* Payment Method */}
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Payment Method</span>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => setCurrentStep("payment")}
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-foreground">{paymentMethods.find((p) => p.id === selectedPayment)?.name}</p>
                {selectedPayment === "momo" && momoNumber && <p className="text-muted-foreground">{momoNumber}</p>}
              </div>

              {/* Order Items */}
              <div className="p-4 rounded-xl border border-border">
                <span className="text-sm font-medium text-muted-foreground">Order Items</span>
                <div className="mt-3 space-y-3">
                  {mockCartItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        GH₵{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" className="bg-transparent gap-2" onClick={() => setCurrentStep("payment")}>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  className="text-slate-50 hover:text-slate-100 gap-2"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Place Order - GH₵{total.toLocaleString()}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-lg text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {mockCartItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    GH₵{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">GH₵{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">GH₵{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">GH₵{serviceFee}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">GH₵{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
