import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-xl font-semibold">Payment Successful</h1>
              <p className="text-sm text-muted-foreground">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>
              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline">
                  <Link href="/orders">View Orders</Link>
                </Button>
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
