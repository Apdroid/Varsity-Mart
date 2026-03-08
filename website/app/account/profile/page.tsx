"use client"

import { useProfile } from "@/hooks/queries/useProfile"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { ArrowLeft, User, Camera, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect } from "react"

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating, uploadAvatar, isUploadingAvatar } = useProfile()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
    }
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.first_name || profile.fullName?.split(" ")[0] || "",
        lastName: profile.last_name || profile.fullName?.split(" ").slice(1).join(" ") || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: "", // Bio is not in the model yet, but let's keep it for UI
      })
    }
  }, [profile, reset])

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadAvatar(file)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </Link>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Edit Profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Update your personal information and preferences</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Photo */}
            <div>
              <Label className="text-foreground mb-4 block text-lg font-semibold">Profile Photo</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {profile?.fullName?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="relative">
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mb-2"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 mr-2" />
                      )}
                      Upload Photo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-foreground mb-2 block">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="bg-background"
                    {...register("firstName")}
                    disabled={isUpdating}
                  />
                  {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground mb-2 block">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="bg-background"
                    {...register("lastName")}
                    disabled={isUpdating}
                  />
                  {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="bio" className="text-foreground mb-2 block">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell others about yourself..."
                  className="bg-background resize-none"
                  {...register("bio")}
                  disabled={isUpdating}
                />
                <p className="text-xs text-muted-foreground mt-2">Brief description for your profile (max 500 characters)</p>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-foreground mb-2 block">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@university.edu"
                      className="bg-background pl-10"
                      {...register("email")}
                      disabled={isUpdating}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Use your university email to verify student status
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground mb-2 block">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="bg-background pl-10"
                      {...register("phone")}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Show Profile Publicly</p>
                    <p className="text-sm text-muted-foreground">Allow others to view your profile and listings</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1" disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
              <Link href="/account">
                <Button type="button" variant="outline" size="lg" disabled={isUpdating}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
