import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Flag, AlertTriangle, Shield, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Report an Issue | VarsityMart",
  description: "Report suspicious activity, scams, or policy violations on VarsityMart.",
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Flag className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Report an Issue</h1>
              <p className="text-sm text-muted-foreground mt-1">Help us keep VarsityMart safe for everyone</p>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Your Safety Matters</h3>
              <p className="text-sm text-muted-foreground">
                If you've encountered fraud, scams, or feel unsafe, please report it immediately. All reports are reviewed
                confidentially.
              </p>
            </div>
          </div>

          {/* Report Form */}
          <form className="space-y-6">
            <div>
              <Label htmlFor="issue-type" className="text-foreground mb-2 block">
                Issue Type <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="issue-type">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scam">Scam or Fraud</SelectItem>
                  <SelectItem value="fake">Fake or Counterfeit Items</SelectItem>
                  <SelectItem value="harassment">Harassment or Abuse</SelectItem>
                  <SelectItem value="prohibited">Prohibited Items</SelectItem>
                  <SelectItem value="spam">Spam or Misleading Content</SelectItem>
                  <SelectItem value="safety">Safety Concern</SelectItem>
                  <SelectItem value="other">Other Violation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reported-user" className="text-foreground mb-2 block">
                User or Listing URL (if applicable)
              </Label>
              <Input
                id="reported-user"
                type="text"
                placeholder="https://varsitymart.com/products/12345 or username"
                className="bg-background"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground mb-2 block">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Please provide as much detail as possible about the issue..."
                className="bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Include any relevant details like dates, messages, or transaction IDs
              </p>
            </div>

            <div>
              <Label htmlFor="evidence" className="text-foreground mb-2 block">
                Evidence (Optional)
              </Label>
              <Input
                id="evidence"
                type="file"
                accept="image/*,.pdf"
                multiple
                className="bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Upload screenshots, photos, or documents (max 5MB each)
              </p>
            </div>

            <div>
              <Label htmlFor="contact-email" className="text-foreground mb-2 block">
                Contact Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="your.email@university.edu"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-2">
                We'll use this to follow up on your report if needed
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </form>

          {/* Additional Resources */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Need More Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  For immediate safety concerns or urgent issues, please:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    Contact campus security if you feel unsafe
                  </li>
                  <li>
                    Email us directly at{" "}
                    <a href="mailto:safety@varsitymart.com" className="text-primary hover:underline">
                      safety@varsitymart.com
                    </a>
                  </li>
                  <li>
                    Review our{" "}
                    <Link href="/help/safety" className="text-primary hover:underline">
                      Safety Guidelines
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
