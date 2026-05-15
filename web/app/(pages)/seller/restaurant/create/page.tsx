"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import Image from "next/image"
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Clock,
	ImageIcon,
	Loader2,
	MapPin,
	Phone,
	Store,
	Truck,
	Upload,
	UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCreateRestaurant } from "@/hooks/queries/use-restaurants"
import { useRestaurantCategories } from "@/hooks/queries/use-categories"
import { cn } from "@/lib/utils"

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
	restaurantName: z.string().min(2, "Restaurant name must be at least 2 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.string().min(1, "Please select a category"),
	location: z.string().min(2, "Please enter a location"),
	deliveryFee: z.coerce.number().min(0, "Delivery fee cannot be negative"),
	minOrder: z.coerce.number().min(1, "Minimum order must be at least 1"),
	openingTime: z.string().min(1, "Opening time is required"),
	closingTime: z.string().min(1, "Closing time is required"),
	deliveryTime: z.string().optional(),
	phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const STEP_FIELDS: (keyof FormData)[][] = [
	["restaurantName", "description", "category", "location"],
	["deliveryFee", "minOrder"],
	["openingTime", "closingTime", "deliveryTime", "phone"],
	[],
]

const STEPS = [
	{ label: "Info", icon: UtensilsCrossed },
	{ label: "Pricing", icon: Truck },
	{ label: "Hours", icon: Clock },
	{ label: "Photos", icon: ImageIcon },
]

// ── Progress bar ──────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
	return (
		<div className="mb-8">
			<div className="relative flex items-center justify-between">
				<div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
				<div
					className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-vm-tangerine transition-all duration-500"
					style={{ width: `${(current / (total - 1)) * 100}%` }}
				/>
				{STEPS.map((step, i) => {
					const done = i < current
					const active = i === current
					const Icon = step.icon
					return (
						<div key={step.label} className="relative flex flex-col items-center gap-2 z-10">
							<div
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
									done
										? "border-vm-tangerine bg-vm-tangerine text-white"
										: active
											? "border-vm-tangerine bg-background text-vm-tangerine"
											: "border-border bg-background text-muted-foreground"
								)}
							>
								{done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
							</div>
							<span
								className={cn(
									"hidden text-[11px] font-medium sm:block transition-colors",
									active ? "text-vm-tangerine" : done ? "text-foreground" : "text-muted-foreground"
								)}
							>
								{step.label}
							</span>
						</div>
					)
				})}
			</div>
			<p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">
				Step {current + 1} of {total} — <span className="font-medium text-foreground">{STEPS[current].label}</span>
			</p>
		</div>
	)
}

// ── Image upload field ────────────────────────────────────────────────────────

function ImageUploadField({
	label,
	hint,
	aspectClass,
	value,
	onChange,
}: {
	label: string
	hint: string
	aspectClass: string
	value: File | null
	onChange: (file: File | null) => void
}) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [preview, setPreview] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (!value) { setPreview(null); return }
		const url = URL.createObjectURL(value)
		setPreview(url)
		return () => URL.revokeObjectURL(url)
	}, [value])

	return (
		<div className="space-y-2">
			<div>
				<p className="text-sm font-medium">{label}</p>
				<p className="text-xs text-muted-foreground">{hint}</p>
			</div>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				className={cn(
					"group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-vm-tangerine hover:bg-vm-tangerine/5",
					aspectClass
				)}
			>
				{preview ? (
					<Image src={preview} alt={label} fill className="object-cover" />
				) : (
					<div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-vm-tangerine">
						<Upload className="h-7 w-7" />
						<span className="text-xs font-medium">Click to upload</span>
					</div>
				)}
				{preview && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
						<Upload className="h-6 w-6 text-white" />
						<span className="ml-2 text-sm font-medium text-white">Change</span>
					</div>
				)}
			</button>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					onChange(e.target.files?.[0] ?? null)
					e.target.value = ""
				}}
			/>
			{value && (
				<button
					type="button"
					onClick={() => onChange(null)}
					className="text-xs text-destructive hover:underline"
				>
					Remove
				</button>
			)}
		</div>
	)
}

// ── Step 1: Restaurant info ───────────────────────────────────────────────────

function StepBasicInfo({ form, categories, categoriesLoading }: {
	form: ReturnType<typeof useForm<FormData>>
	categories: { id: string; name: string }[] | undefined
	categoriesLoading: boolean
}) {
	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Tell us about your restaurant</h2>
				<p className="text-sm text-muted-foreground">This is what hungry students will see first.</p>
			</div>

			<FormField
				control={form.control}
				name="restaurantName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Restaurant name</FormLabel>
						<FormControl>
							<Input placeholder="e.g. Campus Grill" autoFocus {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Tell customers what you serve and what makes your food special…"
								className="min-h-28 resize-none"
								{...field}
							/>
						</FormControl>
						<FormDescription>At least 10 characters</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cuisine type</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={categoriesLoading ? "Loading…" : "Select"} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{(categories ?? []).map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<span className="flex items-center gap-1">
									<MapPin className="h-3.5 w-3.5" />
									Location
								</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="e.g. Main Campus" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	)
}

// ── Step 2: Pricing ───────────────────────────────────────────────────────────

function StepPricing({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
	const deliveryFee = form.watch("deliveryFee")
	const minOrder = form.watch("minOrder")

	const fmt = (n: number | string) =>
		new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(Number(n) || 0)

	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Set your pricing</h2>
				<p className="text-sm text-muted-foreground">Let customers know what to expect.</p>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					control={form.control}
					name="deliveryFee"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Delivery fee (GHS)</FormLabel>
							<FormControl>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
										GHS
									</span>
									<Input type="number" min={0} step={0.5} className="pl-12" {...field} />
								</div>
							</FormControl>
							<FormDescription>Set to 0 for free delivery</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="minOrder"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Minimum order (GHS)</FormLabel>
							<FormControl>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
										GHS
									</span>
									<Input type="number" min={1} step={1} className="pl-12" {...field} />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Live preview */}
			<div className="rounded-xl border border-border bg-muted/40 p-4">
				<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Delivery fee</span>
					<span className="font-medium">{Number(deliveryFee) === 0 ? "Free" : fmt(deliveryFee)}</span>
				</div>
				<Separator className="my-2" />
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Minimum order</span>
					<span className="font-medium">{fmt(minOrder)}</span>
				</div>
			</div>
		</div>
	)
}

// ── Step 3: Hours & contact ───────────────────────────────────────────────────

function StepHours({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Hours &amp; contact</h2>
				<p className="text-sm text-muted-foreground">Required: let customers know when you&apos;re open.</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					control={form.control}
					name="openingTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<span className="flex items-center gap-1">
									<Clock className="h-3.5 w-3.5" />
									Opening time
								</span>
							</FormLabel>
							<FormControl>
								<Input type="time" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="closingTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<span className="flex items-center gap-1">
									<Clock className="h-3.5 w-3.5" />
									Closing time
								</span>
							</FormLabel>
							<FormControl>
								<Input type="time" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="deliveryTime"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<span className="flex items-center gap-1">
								<Truck className="h-3.5 w-3.5" />
								Typical delivery time
								<span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
							</span>
						</FormLabel>
						<FormControl>
							<Input placeholder="e.g. 20–30 min" {...field} />
						</FormControl>
						<FormDescription>Shown on your restaurant card</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="phone"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<span className="flex items-center gap-1">
								<Phone className="h-3.5 w-3.5" />
								Phone number
								<span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
							</span>
						</FormLabel>
						<FormControl>
							<Input type="tel" placeholder="+233 20 000 0000" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

// ── Step 4: Photos + review ───────────────────────────────────────────────────

function StepPhotos({
	form,
	logo,
	banner,
	onLogoChange,
	onBannerChange,
}: {
	form: ReturnType<typeof useForm<FormData>>
	logo: File | null
	banner: File | null
	onLogoChange: (f: File | null) => void
	onBannerChange: (f: File | null) => void
}) {
	const values = form.getValues()

	const fmt = (n: number | string) =>
		new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(Number(n) || 0)

	const formatTime = (t?: string) => {
		if (!t) return "—"
		const [h, m] = t.split(":")
		const hour = Number(h)
		return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`
	}

	const rows: [string, string][] = [
		["Restaurant", values.restaurantName],
		["Category", values.category],
		["Location", values.location],
		["Delivery fee", Number(values.deliveryFee) === 0 ? "Free" : fmt(values.deliveryFee)],
		["Min. order", fmt(values.minOrder)],
		["Opens", formatTime(values.openingTime)],
		["Closes", formatTime(values.closingTime)],
		...(values.deliveryTime ? [["Delivery time", values.deliveryTime] as [string, string]] : []),
		...(values.phone ? [["Phone", values.phone] as [string, string]] : []),
	]

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Photos &amp; review</h2>
				<p className="text-sm text-muted-foreground">Upload images and confirm your details.</p>
			</div>

			<ImageUploadField
				label="Banner image"
				hint="Appears at the top of your restaurant page — 3:1 ratio recommended"
				aspectClass="aspect-[3/1]"
				value={banner}
				onChange={onBannerChange}
			/>

			<ImageUploadField
				label="Logo"
				hint="Square image — shown on the restaurant card"
				aspectClass="aspect-square max-w-[140px]"
				value={logo}
				onChange={onLogoChange}
			/>

			<Separator />

			<div>
				<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</p>
				<div className="divide-y divide-border rounded-xl border border-border">
					{rows.map(([label, value]) => (
						<div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
							<span className="text-muted-foreground">{label}</span>
							<span className="font-medium text-right max-w-[60%] truncate">{value}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreateRestaurantPage() {
	const router = useRouter()
	const [step, setStep] = React.useState(0)
	const [logo, setLogo] = React.useState<File | null>(null)
	const [banner, setBanner] = React.useState<File | null>(null)

	const { data: categories, isLoading: categoriesLoading } = useRestaurantCategories()

	const { mutateAsync: createRestaurant, isPending } = useCreateRestaurant()

	const form = useForm<FormData>({
		resolver: zodResolver(schema) as Resolver<FormData>,
		defaultValues: {
			restaurantName: "",
			description: "",
			category: "",
			location: "",
			deliveryFee: 0,
			minOrder: 1,
			openingTime: "",
			closingTime: "",
			deliveryTime: "",
			phone: "",
		},
	})

	const totalSteps = STEPS.length

	async function goNext() {
		const fields = STEP_FIELDS[step]
		const valid = fields.length === 0 || await form.trigger(fields)
		if (valid) setStep((s) => Math.min(s + 1, totalSteps - 1))
	}

	function goBack() {
		setStep((s) => Math.max(s - 1, 0))
	}

	async function onSubmit(values: FormData) {
		try {
			await createRestaurant({
				restaurantName: values.restaurantName,
				description: values.description,
				category: values.category,
				location: values.location,
				deliveryFee: values.deliveryFee,
				minOrder: values.minOrder,
				openingTime: values.openingTime,
				closingTime: values.closingTime,
				deliveryTime: values.deliveryTime || undefined,
				phone: values.phone || undefined,
				logo: logo ?? undefined,
				banner: banner ?? undefined,
			})
			toast.success("Restaurant created! Welcome aboard.")
			router.replace("/seller/restaurant")
		} catch {
			toast.error("Failed to create restaurant. Please try again.")
		}
	}

	return (
		<div className="mx-auto max-w-xl px-4 pb-16 pt-8">
			{/* Back nav */}
			<button
				type="button"
				onClick={() => (step === 0 ? router.back() : goBack())}
				className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				{step === 0 ? "Back" : "Previous step"}
			</button>

			<StepProgress current={step} total={totalSteps} />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && step < totalSteps - 1) {
							e.preventDefault()
							goNext()
						}
					}}
				>
					{step === 0 && (
						<StepBasicInfo form={form} categories={categories} categoriesLoading={categoriesLoading} />
					)}
					{step === 1 && <StepPricing form={form} />}
					{step === 2 && <StepHours form={form} />}
					{step === 3 && (
						<StepPhotos
							form={form}
							logo={logo}
							banner={banner}
							onLogoChange={setLogo}
							onBannerChange={setBanner}
						/>
					)}

					<div className="mt-8 flex gap-3">
						{step > 0 && (
							<Button type="button" variant="outline" className="flex-1 h-11" onClick={goBack}>
								<ArrowLeft className="mr-1.5 h-4 w-4" />
								Back
							</Button>
						)}

						{step < totalSteps - 1 ? (
							<Button
								type="button"
								className="flex-1 h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
								onClick={goNext}
							>
								Continue
								<ArrowRight className="ml-1.5 h-4 w-4" />
							</Button>
						) : (
							<Button
								type="submit"
								disabled={isPending}
								className="flex-1 h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating…
									</>
								) : (
									<>
										<Store className="mr-2 h-4 w-4" />
										Open restaurant
									</>
								)}
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	)
}
