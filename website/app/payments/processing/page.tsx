import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function PaymentProcessingPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h1 className="text-xl font-semibold">Processing Payment</h1>
              <p className="text-sm text-muted-foreground">
                Please wait while we process your payment. Do not close this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
