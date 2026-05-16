"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVerifyPayment } from "@/hooks/queries/use-payments"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get("reference") || searchParams.get("trxref")

  useEffect(() => {
    if (!reference) {
      router.replace("/")
    }
  }, [reference, router])

  const { data: result, isLoading, isError, error } = useVerifyPayment(reference)

  if (!reference) return null

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-vm-tangerine" />
        <p className="text-base font-medium">Verifying your payment…</p>
        <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
      </div>
    )
  }

  if (isError || !result?.success) {
    const message =
      (error instanceof Error ? error.message : null) ||
      result?.message ||
      "Your payment could not be verified. Please contact support if funds were deducted."

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Payment could not be verified</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="w-full rounded-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
              <Link href="/checkout">Try again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold">Payment confirmed!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your order has been placed successfully.</p>

        {(result.orderId || result.amount) && (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left text-sm">
            {result.orderId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">#{result.orderId.slice(0, 8).toUpperCase()}</span>
              </div>
            )}
            {result.amount && (
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Amount paid</span>
                <span className="font-medium text-emerald-600">{formatGHS(result.amount)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button asChild className="w-full rounded-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90">
            <Link href={result.orderId ? `/orders/${result.orderId}` : "/account/orders"}>
              View your order
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
