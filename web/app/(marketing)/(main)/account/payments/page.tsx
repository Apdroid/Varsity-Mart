"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
	ArrowLeft,
	Building2,
	CreditCard,
	Loader2,
	Pencil,
	Plus,
	Smartphone,
	Star,
	Trash2,
	Wallet,
} from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
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
	useUpdatePaymentMethod,
} from "@/hooks/queries/use-payments"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/lib/api/types"

// ---------------------------------------------------------------------------
// Zod schema for adding a MoMo payment method
// ---------------------------------------------------------------------------
const momoSchema = z.object({
	provider: z.enum(["MTN", "Vodafone", "AirtelTigo"], {
		message: "Please select a network provider",
	}),
	phone: z.string().min(9, "Phone number must be at least 9 digits"),
})

type MomoFormValues = z.infer<typeof momoSchema>

// ---------------------------------------------------------------------------
// Provider pill config
// ---------------------------------------------------------------------------
const PROVIDERS = [
	{ value: "MTN", label: "MTN", color: "bg-yellow-400 text-yellow-900 hover:bg-yellow-400" },
	{ value: "Vodafone", label: "Vodafone", color: "bg-red-500 text-white hover:bg-red-500" },
	{ value: "AirtelTigo", label: "AirtelTigo", color: "bg-blue-500 text-white hover:bg-blue-500" },
] as const

// ---------------------------------------------------------------------------
// Helper: icon + label for a payment method rowN
// ---------------------------------------------------------------------------
const PROVIDER_LOGOS: Record<string, { src: string; bg: string }> = {
	MTN: { src: "/logo/mtn.svg", bg: "bg-yellow-400" },
	Vodafone: { src: "/logo/Vodafone_Symbol_0.svg", bg: "bg-red-500" },
	AirtelTigo: { src: "/logo/at.webp", bg: "bg-accent" },
}

function MethodIcon({ method }: { method: PaymentMethod }) {
	if (method.type === "momo" && method.provider && PROVIDER_LOGOS[method.provider]) {
		const { src, bg } = PROVIDER_LOGOS[method.provider]
		return (
			<div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}>
				<Image src={src} alt={method.provider} width={24} height={24} className="object-contain" />
			</div>
		)
	}
	const icon =
		method.type === "card"
			? <CreditCard className="h-5 w-5 text-muted-foreground" />
			: method.type === "momo"
				? <Smartphone className="h-5 w-5 text-muted-foreground" />
				: <Building2 className="h-5 w-5 text-muted-foreground" />
	return (
		<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
			{icon}
		</div>
	)
}

function methodTitle(method: PaymentMethod): string {
	if (method.type === "momo") return method.provider ?? "MoMo"
	if (method.type === "card") return `Card ···· ${method.last4 ?? "????"}`
	return `Bank · ${method.last4 ?? "????"}`
}

function methodSubtitle(method: PaymentMethod): string | null {
	if (method.type === "momo") return method.number ?? null
	return null
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

	const selectedProvider = useWatch({ control: form.control, name: "provider" })

	async function onSubmit(values: MomoFormValues) {
		try {
			await addMethod({
				name: `${PROVIDERS.find(p => p.value === values.provider)?.label ?? values.provider} MoMo`,
				is_default: false,
				provider: values.provider,
				number: values.phone,
			})
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
													<Input
														{...field}
														type="tel"
														placeholder="+233 XX XXX XXXX"
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
// Edit method dialog
// ---------------------------------------------------------------------------
const editSchema = z.object({
	provider: z.enum(["MTN", "Vodafone", "AirtelTigo"], { message: "Please select a network provider" }),
	phone: z.string().min(9, "Phone number must be at least 9 digits"),
})
type EditFormValues = z.infer<typeof editSchema>

function EditMethodDialog({ method }: { method: PaymentMethod }) {
	const [open, setOpen] = React.useState(false)
	const { mutateAsync: updateMethod, isPending } = useUpdatePaymentMethod()

	const form = useForm<EditFormValues>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			provider: (method.provider as EditFormValues["provider"]) ?? "MTN",
			phone: method.number ?? "",
		},
	})

	async function onSubmit(values: EditFormValues) {
		try {
			await updateMethod({
				methodId: method.method_id,
				data: {
					provider: values.provider,
					number: values.phone,
				},
			})
			toast.success("Payment method updated")
			setOpen(false)
		} catch {
			toast.error("Failed to update payment method")
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit payment method</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
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
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone number</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="tel"
											placeholder="+233 XX XXX XXXX"
											inputMode="numeric"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full vm-button" disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save changes
						</Button>
					</form>
				</Form>
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
	const isDefault = method.isDefault || method.is_default

	function handleSetDefault() {
		setDefault(method.method_id, {
			onSuccess: () => toast.success("Default payment method updated"),
			onError: () => toast.error("Failed to update default method"),
		})
	}

	function handleRemove() {
		remove(method.method_id, {
			onSuccess: () => toast.success("Payment method removed"),
			onError: () => toast.error("Failed to remove payment method"),
		})
	}

	return (
		<div className="flex items-center gap-4 rounded-lg bg-card p-4">
			<MethodIcon method={method} />

			{/* Label + number + default badge */}
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{methodTitle(method)}</p>
				{methodSubtitle(method) && (
					<p className="text-sm text-muted-foreground">{methodSubtitle(method)}</p>
				)}
				{isDefault && (
					<Badge className="mt-1 gap-1 bg-amber-100 text-amber-800 text-xs hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
						<Star className="h-3 w-3 fill-current" />
						Default
					</Badge>
				)}
			</div>

			{/* Actions */}
			<div className="flex shrink-0 items-center gap-2">
				{!isDefault && (
					<Button variant="ghost" size="sm" onClick={handleSetDefault} disabled={isSettingDefault}>
						{isSettingDefault ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set default"}
					</Button>
				)}

				{method.type === "momo" && <EditMethodDialog method={method} />}

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="ghost" size="icon" disabled={isRemoving} className="text-destructive hover:text-destructive">
							{isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Remove payment method?</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently remove{" "}
								<span className="font-medium">{methodTitle(method)}</span> from your account.
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
				<div key={i} className="flex items-center gap-4 rounded-lg  bg-card p-4">
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
	const { data: methodsData, isLoading: isMethodsLoading } = usePaymentMethods()
	const methods = methodsData?.methods ?? []

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
