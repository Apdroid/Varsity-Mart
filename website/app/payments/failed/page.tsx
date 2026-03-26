import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentFailedPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-xl font-semibold">Payment Failed</h1>
              <p className="text-sm text-muted-foreground">
                We couldn't process your payment. Please try again or use a different payment method.
              </p>
              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline">
                  <Link href="/cart">Back to Cart</Link>
                </Button>
                <Button asChild>
                  <Link href="/checkout">Try Again</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
