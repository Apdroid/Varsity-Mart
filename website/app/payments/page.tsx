import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Smartphone, Wallet, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentsPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Payment Methods</h1>
        <p className="text-muted-foreground mb-6">Manage your payment options</p>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment integration is currently in testing phase. Some features may be limited.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          {/* Mobile Money */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Mobile Money</CardTitle>
                  <CardDescription>MTN, Vodafone, AirtelTigo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No mobile money accounts linked</p>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Mobile Money
              </Button>
            </CardContent>
          </Card>
          
          {/* Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Debit/Credit Card</CardTitle>
                  <CardDescription>Visa, Mastercard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No cards added</p>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </CardContent>
          </Card>
          
          {/* Wallet */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">VarsityMart Wallet</CardTitle>
                  <CardDescription>Balance: GH₵0.00</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Top Up Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
