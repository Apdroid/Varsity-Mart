"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { useAuth } from "@/providers/auth-provider"
import { useUpdateProfile, useUploadAvatar } from "@/hooks/queries/use-user"
import { getUserLocationValue } from "@/lib/user-location"
import { toast } from "sonner"

const profileSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().min(10, "Enter a valid phone number"),
	campus: z.string().min(1, "Campus is required"),
	bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function SettingsPage() {
	const router = useRouter()
	const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth()
	const updateProfileMutation = useUpdateProfile()
	const uploadAvatarMutation = useUploadAvatar()
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			phone: user?.phone || "",
			campus: getUserLocationValue(user?.campus),
			bio: user?.bio || "",
		},
	})

	if (authLoading) {
		return (
			<div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (!isAuthenticated || !user) {
		router.push("/login?redirect=/account/settings")
		return null
	}

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setAvatarPreview(URL.createObjectURL(file))

		const formData = new FormData()
		formData.append("avatar", file)

		try {
			await uploadAvatarMutation.mutateAsync(formData)
			await refreshUser()
			toast.success("Avatar updated successfully")
		} catch {
			toast.error("Failed to update avatar")
			setAvatarPreview(null)
		}
	}

	const onSubmit = async (data: ProfileFormData) => {
		try {
			const fd = new FormData()
			fd.append("first_name", data.firstName)
			fd.append("last_name", data.lastName)
			fd.append("phone", data.phone)
			fd.append("campus", data.campus)
			if (data.bio) fd.append("bio", data.bio)
			await updateProfileMutation.mutateAsync(fd)
			await refreshUser()
			toast.success("Profile updated successfully")
		} catch {
			toast.error("Failed to update profile")
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-xl">
				<div className="mb-6">
					<Link
						href="/account"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to account
					</Link>
				</div>

				<h1 className="mb-6 text-2xl font-bold">Account Settings</h1>

				<div className="mb-8 flex items-center gap-4">
					<div className="relative">
						<Avatar className="h-20 w-20">
							<AvatarImage src={avatarPreview || user.avatar || user.avatarUrl} alt={user.firstName} />
							<AvatarFallback className="text-2xl">
								{user.firstName[0]}{user.lastName[0]}
							</AvatarFallback>
						</Avatar>
						<label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
							<Camera className="h-4 w-4" />
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleAvatarChange}
								disabled={uploadAvatarMutation.isPending}
							/>
						</label>
					</div>
					<div>
						<p className="font-medium">Profile Photo</p>
						<p className="text-sm text-muted-foreground">
							Click the camera icon to change
						</p>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium">Email</p>
							<Input value={user.email} disabled className="bg-muted" />
							<p className="text-xs text-muted-foreground">
								Email cannot be changed
							</p>
						</div>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input type="tel" placeholder="+233201234567" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="campus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Campus</FormLabel>
									<FormControl>
										<Input placeholder="e.g., KNUST Main Campus" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio (optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Tell others a bit about yourself..."
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={updateProfileMutation.isPending}
						>
							{updateProfileMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Save Changes
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
