import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, User, Camera, Mail, Phone, MapPin, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Edit Profile | VarsityMart",
  description: "Update your profile information and preferences.",
}

export default function ProfilePage() {
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

          <form className="space-y-8">
            {/* Profile Photo */}
            <div>
              <Label className="text-foreground mb-4 block text-lg font-semibold">Profile Photo</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">U</AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" className="mb-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first-name" className="text-foreground mb-2 block">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="John"
                    defaultValue=""
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="last-name" className="text-foreground mb-2 block">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    defaultValue=""
                    className="bg-background"
                  />
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
                      defaultValue=""
                      className="bg-background pl-10"
                    />
                  </div>
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
                      defaultValue=""
                      className="bg-background pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">University Information</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="university" className="text-foreground mb-2 block">
                    University <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="university"
                      type="text"
                      placeholder="University of Ghana"
                      defaultValue=""
                      className="bg-background pl-10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="major" className="text-foreground mb-2 block">
                      Major / Course (Optional)
                    </Label>
                    <Input
                      id="major"
                      type="text"
                      placeholder="Computer Science"
                      defaultValue=""
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="graduation" className="text-foreground mb-2 block">
                      Graduation Year (Optional)
                    </Label>
                    <Input
                      id="graduation"
                      type="text"
                      placeholder="2026"
                      defaultValue=""
                      className="bg-background"
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
              <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Link href="/account">
                <Button type="button" variant="outline" size="lg">
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
