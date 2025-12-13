import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"

export const metadata = {
  title: "Order Confirmed - VarsityMart",
  description: "Your order has been placed successfully",
}

export default function CheckoutSuccessPage() {
  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been placed successfully and is being processed.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="font-semibold text-lg text-foreground">VM-2024-005</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Link href="/account/orders">
                <Package className="h-4 w-4" />
                Track Your Order
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent gap-2">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
