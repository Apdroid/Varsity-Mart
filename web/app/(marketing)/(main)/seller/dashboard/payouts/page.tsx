"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  ArrowLeft,
  BadgeDollarSign,
  Clock,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useEscrowBalance, useBanks, useRequestPayout } from "@/hooks/queries/use-payments"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

function formatGHS(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(n)
}

const payoutSchema = z.object({
  amount: z.coerce.number().min(10, "Minimum payout is GHS 10"),
  bank_code: z.string().min(1, "Please select a bank"),
  account_number: z.string().min(10, "Account number must be at least 10 digits").max(13),
  account_name: z.string().min(2, "Please enter the account holder name"),
})

type PayoutForm = z.infer<typeof payoutSchema>

function BalanceCard({
  label,
  value,
  icon: Icon,
  valueClass,
}: {
  label: string
  value: number
  icon: React.ElementType
  valueClass?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className={cn("text-xl font-bold tabular-nums", valueClass)}>{formatGHS(value)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

function PayoutSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

export default function SellerPayoutsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const {
    data: balance,
    isLoading: balanceLoading,
    isFetching: balanceFetching,
    isError: balanceError,
    refetch: refetchBalance,
  } = useEscrowBalance()
  const { data: banks, isLoading: banksLoading } = useBanks()
  const { mutateAsync: requestPayout, isPending: payoutPending } = useRequestPayout()

  const form = useForm<PayoutForm>({
    resolver: zodResolver(payoutSchema) as Resolver<PayoutForm>,
    defaultValues: {
      amount: 0,
      bank_code: "",
      account_number: "",
      account_name: "",
    },
  })

  React.useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace("/login?redirect=/seller/dashboard/payouts")
      return
    }
    if (!user.hasStore) {
      router.replace("/seller/status")
    }
  }, [authLoading, user, router])

  async function onSubmit(values: PayoutForm) {
    try {
      await requestPayout({
        amount: values.amount,
        bank_code: values.bank_code,
        account_number: values.account_number,
        account_name: values.account_name,
      })
      toast.success("Payout request submitted. Processing takes 1–3 business days.")
      form.reset()
    } catch {
      toast.error("Failed to submit payout request. Please try again.")
    }
  }

  if (authLoading || balanceLoading) return <PayoutSkeleton />

  const available = balance?.available ?? 0
  const pending = balance?.pending ?? 0
  const total = balance?.total ?? 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/seller/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <h1 className="mb-6 text-2xl font-bold font-heading">Payouts</h1>

      {balanceError ? (
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">Could not load your balance.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5 vm-button"
            onClick={() => refetchBalance()}
            disabled={balanceFetching}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", balanceFetching && "animate-spin")} />
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <BalanceCard
            icon={Wallet}
            label="Available to withdraw"
            value={available}
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
          <BalanceCard
            icon={Clock}
            label="Pending (in escrow)"
            value={pending}
            valueClass="text-amber-600 dark:text-amber-400"
          />
          <BalanceCard
            icon={TrendingUp}
            label="Total earned"
            value={total}
          />
        </div>
      )}

      <Separator className="my-6" />

      {available <= 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <BadgeDollarSign className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">No funds available to withdraw</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Funds become available after orders are delivered and cleared.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-base font-semibold">Request a payout</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (GHS)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          GHS
                        </span>
                        <Input
                          type="number"
                          min={10}
                          max={available}
                          step={0.01}
                          className="pl-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Max: {formatGHS(available)} · Min: GHS 10
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={banksLoading ? "Loading banks…" : "Select your bank"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(banks ?? []).map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="account_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kwame Mensah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={payoutPending}
                className="w-full h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
              >
                {payoutPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Request payout
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}

      <Separator className="my-6" />

      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">Payout history coming soon.</p>
      </div>
    </div>
  )
}
