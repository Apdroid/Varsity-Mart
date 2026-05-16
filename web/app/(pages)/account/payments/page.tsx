"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Loader2,
  Plus,
  Smartphone,
  Star,
  Trash2,
  Wallet,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  usePaymentMethods,
  useAddPaymentMethod,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/hooks/queries/use-payments"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/lib/api/types"

// ---------------------------------------------------------------------------
// Zod schema for adding a MoMo payment method
// ---------------------------------------------------------------------------
const momoSchema = z.object({
  provider: z.enum(["mtn", "vodafone", "airteltigo"], {
    message: "Please select a network provider",
  }),
  phone: z.string().min(9, "Phone number must be at least 9 digits"),
})

type MomoFormValues = z.infer<typeof momoSchema>

// ---------------------------------------------------------------------------
// Provider pill config
// ---------------------------------------------------------------------------
const PROVIDERS = [
  { value: "mtn", label: "MTN", color: "bg-yellow-400 text-yellow-900 hover:bg-yellow-400" },
  { value: "vodafone", label: "Vodafone", color: "bg-red-500 text-white hover:bg-red-500" },
  { value: "airteltigo", label: "AirtelTigo", color: "bg-blue-500 text-white hover:bg-blue-500" },
] as const

// ---------------------------------------------------------------------------
// Helper: icon + label for a payment method row
// ---------------------------------------------------------------------------
function methodIcon(method: PaymentMethod) {
  if (method.type === "momo") return <Smartphone className="h-5 w-5 text-muted-foreground" />
  if (method.type === "card") return <CreditCard className="h-5 w-5 text-muted-foreground" />
  return <Building2 className="h-5 w-5 text-muted-foreground" />
}

function methodLabel(method: PaymentMethod) {
  if (method.type === "momo") {
    const providerLabel =
      method.provider === "mtn"
        ? "MTN"
        : method.provider === "vodafone"
          ? "Vodafone"
          : method.provider === "airteltigo"
            ? "AirtelTigo"
            : method.provider ?? "MoMo"
    return `${providerLabel} · ••• ${method.last4 ?? "????"}`
  }
  if (method.type === "card") return `Card · •••• ${method.last4 ?? "????"}`
  return `Bank · ${method.last4 ?? "????"}`
}

// ---------------------------------------------------------------------------
// Add method dialog
// ---------------------------------------------------------------------------
function AddMethodDialog() {
  const [open, setOpen] = React.useState(false)
  const { mutateAsync: addMethod, isPending } = useAddPaymentMethod()

  const form = useForm<MomoFormValues>({
    resolver: zodResolver(momoSchema),
    defaultValues: { phone: "" },
  })

  const selectedProvider = form.watch("provider")

  async function onSubmit(values: MomoFormValues) {
    try {
      await addMethod({ provider: values.provider, phone: values.phone })
      toast.success("Payment method added")
      form.reset()
      setOpen(false)
    } catch {
      toast.error("Failed to add payment method")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) form.reset(); setOpen(next) }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add payment method</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="momo" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="momo" className="flex-1">
              MoMo
            </TabsTrigger>
            <TabsTrigger value="card" className="flex-1">
              Card
            </TabsTrigger>
          </TabsList>

          {/* MoMo tab */}
          <TabsContent value="momo" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Provider pills */}
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network provider</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {PROVIDERS.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => field.onChange(p.value)}
                              className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-medium ring-2 ring-transparent transition-all",
                                field.value === p.value
                                  ? `${p.color} ring-offset-1 ring-foreground/30`
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                            +233
                          </span>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="XX XXX XXXX"
                            className="rounded-l-none"
                            inputMode="numeric"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !selectedProvider}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save MoMo number
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Card tab — coming soon */}
          <TabsContent value="card" className="mt-4">
            <div className="flex flex-col items-center gap-3 py-8 text-center text-muted-foreground">
              <CreditCard className="h-10 w-10 opacity-40" />
              <p className="text-sm">Card payments coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Method row
// ---------------------------------------------------------------------------
function MethodRow({ method }: { method: PaymentMethod }) {
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultPaymentMethod()
  const { mutate: remove, isPending: isRemoving } = useRemovePaymentMethod()

  function handleSetDefault() {
    setDefault(method.id, {
      onSuccess: () => toast.success("Default payment method updated"),
      onError: () => toast.error("Failed to update default method"),
    })
  }

  function handleRemove() {
    remove(method.id, {
      onSuccess: () => toast.success("Payment method removed"),
      onError: () => toast.error("Failed to remove payment method"),
    })
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        {methodIcon(method)}
      </div>

      {/* Label + default badge */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{methodLabel(method)}</p>
        {method.isDefault && (
          <Badge variant="secondary" className="mt-1 gap-1 text-xs">
            <Star className="h-3 w-3 fill-current" />
            Default
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {!method.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSetDefault}
            disabled={isSettingDefault}
          >
            {isSettingDefault ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Set default"
            )}
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isRemoving} className="text-destructive hover:text-destructive">
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove payment method?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove{" "}
                <span className="font-medium">{methodLabel(method)}</span> from your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function PaymentsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PaymentsPage() {
  const router = useRouter()
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth()
  const { data: methods, isLoading: isMethodsLoading } = usePaymentMethods()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?redirect=/account/payments")
    }
  }, [isAuthLoading, isAuthenticated, router])

  const isLoading = isAuthLoading || isMethodsLoading

  if (!isAuthLoading && !isAuthenticated) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/account" className="rounded-md p-1 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 items-center gap-2">
            <Wallet className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Payment methods</h1>
          </div>
          <AddMethodDialog />
        </div>

        <Separator className="mb-6" />

        {/* Content */}
        {isLoading ? (
          <PaymentsSkeleton />
        ) : !methods || methods.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <Wallet className="h-12 w-12 opacity-30" />
            <p className="font-medium">No payment methods saved</p>
            <p className="text-sm">Add a MoMo number to pay faster at checkout.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <MethodRow key={method.id} method={method} />
            ))}
          </div>
        )}

        {/* Footer note */}
        {!isLoading && (
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Your payment details are encrypted and stored securely. VarsityMart never
            stores your full account credentials.
          </p>
        )}
      </div>
    </div>
  )
}
