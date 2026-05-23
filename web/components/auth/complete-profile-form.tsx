"use client"

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useCampusesByUniversity, useUniversities } from "@/hooks/queries/use-campus"
import { useUpdateProfile } from "@/hooks/queries/use-user"
import { useAuth } from "@/providers/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

function hasValue(value?: string | null) {
	return Boolean(value && value.trim().length > 0)
}

const schema = z.object({
	phone: z.string().optional(),
	universityId: z.string().optional(),
	campusId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CompleteProfileForm() {
	const { user, refreshUser } = useAuth()
	const router = useRouter()
	const updateProfileMutation = useUpdateProfile()

	const { data: universities = [], isLoading: loadingUniversities } = useUniversities()

	const missing = useMemo(() => ({
		phone: !hasValue(user?.phone),
		campus: !hasValue(user?.campus?.id),
	}), [user?.phone, user?.campus?.id])

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "onBlur",
		defaultValues: {
			phone: user?.phone || "",
			universityId: user?.university?.id || "",
			campusId: user?.campus?.id || "",
		},
	})

	const selectedUniversityId = form.watch("universityId") ?? ""
	const { data: campuses = [], isLoading: loadingCampuses } = useCampusesByUniversity(selectedUniversityId)

	const onSubmit = async (values: FormData) => {
		const phone = values.phone?.trim() ?? ""
		const campusId = values.campusId?.trim() ?? ""

		if (missing.phone && phone.length < 8) {
			form.setError("phone", { message: "Enter a valid phone number." })
			return
		}
		if (missing.campus && !campusId) {
			form.setError("campusId", { message: "Select your campus." })
			return
		}
		try {
			const formData = new FormData()
			if (missing.phone) formData.append("phone", phone)
			if (missing.campus) formData.append("campus_id", campusId)
			await updateProfileMutation.mutateAsync(formData)
			await refreshUser()
			toast.success("Profile completed!")
			router.replace("/")
		} catch {
			toast.error("Failed to save your details. Please try again.")
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				noValidate
				className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
			>
				{missing.phone && (
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone number</FormLabel>
								<FormControl>
									<Input
										type="tel"
										placeholder="+233201234567"
										autoFocus
										className="rounded-full p-6"
										{...field}
									/>
								</FormControl>
								<FormDescription>Used for delivery updates and order contact.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{missing.campus && (
					<>
						<FormField
							control={form.control}
							name="universityId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>University</FormLabel>
									<Select
										value={field.value}
										onValueChange={(val) => {
											field.onChange(val)
											form.setValue("campusId", "")
										}}
										disabled={loadingUniversities}
									>
										<FormControl>
											<SelectTrigger className="h-auto w-full rounded-full px-6 py-6">
												<SelectValue placeholder={loadingUniversities ? "Loading..." : "Select university"} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{universities.map((u) => (
												<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
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
										disabled={!selectedUniversityId || loadingCampuses}
									>
										<FormControl>
											<SelectTrigger className="h-auto w-full rounded-full px-6 py-6">
												<SelectValue placeholder={
													!selectedUniversityId ? "Select a university first" :
													loadingCampuses ? "Loading..." :
													"Select campus"
												} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{campuses.map((c) => (
												<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}

				<Button
					type="submit"
					disabled={updateProfileMutation.isPending}
					className="w-full rounded-full p-6 text-base my-6"
				>
					{updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Complete profile
				</Button>
			</form>
		</Form>
	)
}
