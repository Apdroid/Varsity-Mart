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
	ShoppingBag,
	Store,
	Upload,
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
import { TimePicker } from "@/components/ui/time-picker"
import { useCreateStore } from "@/hooks/queries/use-stores"
import { useStoreCategories } from "@/hooks/queries/use-categories"
import { useUniversities, useCampusesByUniversity } from "@/hooks/queries/use-campus"
import { useCampus } from "@/providers/campus-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
	storeName: z.string().min(2, "Store name must be at least 2 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.string().min(1, "Please select a category"),
	universityId: z.string().min(1, "Please select an institution"),
	campusId: z.string().min(1, "Please select a campus"),
	location: z.string().min(2, "Please enter a location"),
	deliveryFee: z.coerce.number().min(0, "Delivery fee cannot be negative"),
	minOrder: z.coerce.number().min(1, "Minimum order must be at least 1"),
	phone: z.string().optional(),
	openingTime: z.string().optional(),
	closingTime: z.string().optional(),
})

type FormData = z.infer<typeof schema>

// Fields that belong to each step (for per-step validation)
const STEP_FIELDS: (keyof FormData)[][] = [
	["storeName", "description", "category", "universityId", "campusId", "location"],
	["deliveryFee", "minOrder"],
	["openingTime", "closingTime", "phone"],
	[], // images step — no schema fields, just file state
]

// ── Step config ───────────────────────────────────────────────────────────────

const STEPS = [
	{ label: "Store info", icon: Store },
	{ label: "Pricing", icon: ShoppingBag },
	{ label: "Hours", icon: Clock },
	{ label: "Photos", icon: ImageIcon },
]

// ── Progress bar ──────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
	return (
		<div className="mb-8">
			{/* Step dots */}
			<div className="relative flex items-center justify-between">
				{/* Connector track */}
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

			{/* Mobile step label */}
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

// ── Step panels ───────────────────────────────────────────────────────────────

function StepBasicInfo({ form, categories, categoriesLoading }: {
	form: ReturnType<typeof useForm<FormData>>
	categories: { id: string; name: string }[] | undefined
	categoriesLoading: boolean
}) {
	const universityId = form.watch("universityId")
	const { data: universities, isLoading: universitiesLoading } = useUniversities()
	const { data: campuses, isLoading: campusesLoading } = useCampusesByUniversity(universityId)

	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Tell us about your store</h2>
				<p className="text-sm text-muted-foreground">This is what shoppers will see first.</p>
			</div>

			<FormField
				control={form.control}
				name="storeName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Store name</FormLabel>
						<FormControl>
							<Input placeholder="e.g. Campus Essentials" autoFocus {...field} />
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
								placeholder="Tell shoppers what you sell and why they should choose you…"
								className="min-h-28 resize-none"
								{...field}
							/>
						</FormControl>
						<FormDescription>At least 10 characters</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="category"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Category</FormLabel>
						<Select value={field.value} onValueChange={field.onChange}>
							<FormControl>
								<SelectTrigger className="w-full">
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

			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="universityId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Institution</FormLabel>
							<Select
								value={field.value}
								onValueChange={(v) => {
									field.onChange(v)
									// Campus belongs to a university — clear it when the university changes
									form.setValue("campusId", "", { shouldValidate: false })
								}}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={universitiesLoading ? "Loading…" : "Select"} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{(universities ?? []).map((uni) => (
										<SelectItem key={uni.id} value={uni.id}>
											{uni.name}
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
					name="campusId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Campus</FormLabel>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={!universityId || campusesLoading}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												!universityId
													? "Select an institution first"
													: campusesLoading
														? "Loading…"
														: "Select"
											}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{(campuses ?? []).map((campus) => (
										<SelectItem key={campus.id} value={campus.id}>
											{campus.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

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
							<Input placeholder="e.g. Unity Hall annex, near the main gate" {...field} />
						</FormControl>
						<FormDescription>A landmark or street so customers can find you</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

function StepPricing({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
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
									<Input
										type="number"
										min={0}
										step={0.5}
										className="pl-12"
										{...field}
									/>
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
									<Input
										type="number"
										min={1}
										step={1}
										className="pl-12"
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Visual preview */}
			<div className="rounded-xl border border-border bg-muted/40 p-4">
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Delivery</span>
					<span className="font-medium">
						{Number(form.watch("deliveryFee")) === 0
							? "Free"
							: `GHS ${Number(form.watch("deliveryFee")).toFixed(2)}`}
					</span>
				</div>
				<Separator className="my-2" />
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Min. order</span>
					<span className="font-medium">GHS {Number(form.watch("minOrder")).toFixed(2)}</span>
				</div>
			</div>
		</div>
	)
}

function StepHours({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Hours &amp; contact</h2>
				<p className="text-sm text-muted-foreground">All fields optional — you can update these later.</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="openingTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<span className="flex items-center gap-1">
									<Clock className="h-3.5 w-3.5" />
									Opens
								</span>
							</FormLabel>
							<FormControl>
								<TimePicker value={field.value} onChange={field.onChange} />
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
									Closes
								</span>
							</FormLabel>
							<FormControl>
								<TimePicker value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="phone"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<span className="flex items-center gap-1">
								<Phone className="h-3.5 w-3.5" />
								Contact number
							</span>
						</FormLabel>
						<FormControl>
							<Input type="tel" placeholder="+233 50 123 4567" {...field} />
						</FormControl>
						<FormDescription>Customers can reach you directly</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

function StepPhotos({
	logo, setLogo, banner, setBanner,
}: {
	logo: File | null
	setLogo: (f: File | null) => void
	banner: File | null
	setBanner: (f: File | null) => void
}) {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Add photos</h2>
				<p className="text-sm text-muted-foreground">
					A great banner and logo help customers recognise your store. Skip for now if you prefer.
				</p>
			</div>

			<ImageUploadField
				label="Banner"
				hint="Recommended 1200 × 400 px · shown at the top of your store page"
				aspectClass="aspect-[3/1]"
				value={banner}
				onChange={setBanner}
			/>

			<Separator />

			<ImageUploadField
				label="Logo"
				hint="Recommended 400 × 400 px · shown in search results and listings"
				aspectClass="aspect-square max-h-44"
				value={logo}
				onChange={setLogo}
			/>
		</div>
	)
}

// ── Review summary (shown on final step above CTA) ────────────────────────────

function ReviewSummary({
	values,
	logo,
	banner,
	categories,
}: {
	values: FormData
	logo: File | null
	banner: File | null
	categories: { id: string; name: string }[] | undefined
}) {
	const categoryName = categories?.find((c) => c.id === values.category)?.name ?? values.category

	const { data: universities } = useUniversities()
	const { data: campuses } = useCampusesByUniversity(values.universityId)
	const universityName = universities?.find((u) => u.id === values.universityId)?.name ?? "—"
	const campusName = campuses?.find((c) => c.id === values.campusId)?.name ?? "—"

	function fmt(time?: string) {
		if (!time) return "—"
		const [h, m] = time.split(":")
		const hr = Number(h)
		return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`
	}

	const rows = [
		{ label: "Store name", value: values.storeName },
		{ label: "Category", value: categoryName },
		{ label: "Institution", value: universityName },
		{ label: "Campus", value: campusName },
		{ label: "Location", value: values.location },
		{
			label: "Delivery fee",
			value: Number(values.deliveryFee) === 0 ? "Free" : `GHS ${Number(values.deliveryFee).toFixed(2)}`,
		},
		{ label: "Min. order", value: `GHS ${Number(values.minOrder).toFixed(2)}` },
		{ label: "Hours", value: values.openingTime ? `${fmt(values.openingTime)} – ${fmt(values.closingTime)}` : "—" },
		{ label: "Phone", value: values.phone || "—" },
		{ label: "Banner", value: banner ? banner.name : "None" },
		{ label: "Logo", value: logo ? logo.name : "None" },
	]

	return (
		<div className="rounded-2xl border border-border bg-muted/30 divide-y divide-border overflow-hidden">
			{rows.map(({ label, value }) => (
				<div key={label} className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
					<span className="text-muted-foreground shrink-0">{label}</span>
					<span className="font-medium text-right truncate max-w-[55%]">{value}</span>
				</div>
			))}
		</div>
	)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreateStorePage() {
	const router = useRouter()
	const { refreshUser, user, isLoading: authLoading, isAuthenticated } = useAuth()
	const createStore = useCreateStore()
	const { universityId: defaultUniversityId, campusId: defaultCampusId } = useCampus()

	const { data: categories, isLoading: categoriesLoading } = useStoreCategories()

	const [step, setStep] = React.useState(0)
	const [logo, setLogo] = React.useState<File | null>(null)
	const [banner, setBanner] = React.useState<File | null>(null)

	const totalSteps = STEPS.length

	const form = useForm<FormData>({
		resolver: zodResolver(schema) as Resolver<FormData>,
		defaultValues: {
			storeName: "",
			description: "",
			category: "",
			universityId: defaultUniversityId ?? "",
			campusId: defaultCampusId ?? "",
			location: "",
			deliveryFee: 5,
			minOrder: 10,
			phone: "",
			openingTime: "08:00",
			closingTime: "20:00",
		},
		mode: "onTouched",
	})

	React.useEffect(() => {
		if (authLoading) return
		if (!isAuthenticated) {
			router.replace("/login?next=/seller/store/create")
			return
		}
		if (user?.kycStatus !== "approved") {
			router.replace("/seller/kyc")
		}
	}, [authLoading, isAuthenticated, user, router])

	if (authLoading || !isAuthenticated || user?.kycStatus !== "approved") {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		)
	}

	const goNext = async () => {
		const fields = STEP_FIELDS[step]
		if (fields.length > 0) {
			const valid = await form.trigger(fields)
			if (!valid) return
		}
		setStep((s) => Math.min(s + 1, totalSteps - 1))
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const goBack = () => {
		setStep((s) => Math.max(s - 1, 0))
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const onSubmit = async (values: FormData) => {
		try {
			await createStore.mutateAsync({
				...values,
				phone: values.phone || undefined,
				openingTime: values.openingTime ? `${values.openingTime}:00` : undefined,
				closingTime: values.closingTime ? `${values.closingTime}:00` : undefined,
				logo: logo ?? undefined,
				banner: banner ?? undefined,
			})
			await refreshUser()
			toast.success("Store created! Welcome to VarsityMart.")
			router.replace("/seller/store")
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to create store. Please try again."
			toast.error(msg)
		}
	}

	const isLastStep = step === totalSteps - 1

	return (
		<div className="mx-auto max-w-lg px-4 pb-16 pt-8">
			{/* Back nav */}
			<button
				type="button"
				onClick={step === 0 ? () => router.back() : goBack}
				className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				{step === 0 ? "Back" : "Previous step"}
			</button>

			{/* Progress */}
			<StepProgress current={step} total={totalSteps} />

			{/* Form */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					{/* Step panels */}
					{step === 0 && (
						<StepBasicInfo
							form={form}
							categories={categories}
							categoriesLoading={categoriesLoading}
						/>
					)}
					{step === 1 && <StepPricing form={form} />}
					{step === 2 && <StepHours form={form} />}
					{step === 3 && (
						<>
							<StepPhotos
								logo={logo}
								setLogo={setLogo}
								banner={banner}
								setBanner={setBanner}
							/>
							<Separator />
							<div className="space-y-3">
								<p className="text-sm font-semibold">Review your store</p>
								<ReviewSummary
									values={form.getValues()}
									logo={logo}
									banner={banner}
									categories={categories}
								/>
							</div>
						</>
					)}

					{/* Navigation */}
					<div className="flex gap-3">
						{step > 0 && (
							<Button
								type="button"
								variant="outline"
								onClick={goBack}
								className="flex-1"
							>
								<ArrowLeft className="mr-1.5 h-4 w-4" />
								Back
							</Button>
						)}

						{isLastStep ? (
							<Button
								type="submit"
								disabled={createStore.isPending}
								className="flex-1 bg-vm-tangerine text-white hover:bg-vm-tangerine/90 font-semibold"
							>
								{createStore.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Check className="mr-2 h-4 w-4" />
								)}
								{createStore.isPending ? "Creating…" : "Create store"}
							</Button>
						) : (
							<Button
								type="button"
								onClick={goNext}
								className="flex-1 bg-vm-tangerine text-white hover:bg-vm-tangerine/90 font-semibold"
							>
								Continue
								<ArrowRight className="ml-1.5 h-4 w-4" />
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	)
}
