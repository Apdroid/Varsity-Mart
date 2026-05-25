"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Store,
  Upload,
  UtensilsCrossed,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { useKycStatus, useSubmitKyc } from "@/hooks/queries/use-seller"

type SellerType = "products" | "food"
type DocumentType = "ghana_card" | "student_id"

// ── Pending screen ─────────────────────────────────────────────────────────────

function PendingScreen({
  submittedAt,
  isFetching,
  onRefetch,
}: {
  submittedAt: string | null
  isFetching: boolean
  onRefetch: () => void
}) {
  const router = useRouter()
  const formatted = submittedAt
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(submittedAt))
    : "Just now"

  const steps = [
    { label: "Application submitted", detail: formatted, done: true },
    { label: "Identity under review", detail: "24–48 hours", done: false, active: true },
    { label: "Approval & access granted", detail: "After review", done: false },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      {/* Icon */}
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 ring-[10px] ring-amber-50/40">
        <Clock className="h-10 w-10 text-amber-500 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-heading">Application under review</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Your identity verification is being reviewed by our team. We'll reach out once it's complete.
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        {steps.map(({ label, detail, done, active }, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors z-10",
                  done
                    ? "border-green-500 bg-green-500 text-white"
                    : active
                      ? "border-vm-tangerine bg-vm-tangerine/10 text-vm-tangerine"
                      : "border-border bg-background text-muted-foreground"
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 my-1",
                    done ? "bg-green-400" : "bg-border"
                  )}
                  style={{ minHeight: 32 }}
                />
              )}
            </div>
            <div className="pb-7">
              <p
                className={cn(
                  "text-sm font-medium",
                  active && "text-vm-tangerine",
                  done && "text-foreground"
                )}
              >
                {label}
              </p>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="rounded-xl border border-amber-500  px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        We'll send you a notification once your review is complete. You can continue shopping on VarsityMart in the meantime.
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full"
          disabled={isFetching}
          onClick={onRefetch}
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
          Check status
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => router.push("/")}
        >
          Return to home
        </Button>
      </div>
    </div>
  )
}

// ── Rejected screen ────────────────────────────────────────────────────────────

function RejectedScreen({
  reason,
  onResubmit,
}: {
  reason?: string | null
  onResubmit: () => void
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 ring-[10px] ring-red-50/40 dark:bg-red-950/30">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>

      <h1 className="text-2xl font-bold font-heading">Verification unsuccessful</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        We couldn't verify your identity with the documents provided.
      </p>

      {reason && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive text-left">
          <span className="font-semibold">Reason: </span>
          {reason}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-sm text-left">
        <p className="font-semibold text-foreground">Tips for a successful resubmission</p>
        <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
          <li>Ensure the ID document is fully visible and not cut off</li>
          <li>Use good lighting — avoid glare and shadows</li>
          <li>Hold the ID close to your face in the selfie</li>
          <li>Do not submit photocopies — use the original document</li>
        </ul>
      </div>

      <Button
        className="mt-6 w-full bg-vm-tangerine text-white hover:bg-vm-tangerine/90 font-semibold"
        onClick={onResubmit}
      >
        Try again
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  )
}

// ── Document upload field ──────────────────────────────────────────────────────

function DocUploadField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: File | null
  onChange: (f: File | null) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">
          {label} <span className="text-destructive">*</span>
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 aspect-video transition-all hover:border-vm-tangerine hover:bg-vm-tangerine/5"
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground transition-colors group-hover:text-vm-tangerine">
            <Upload className="h-8 w-8" />
            <span className="text-xs font-medium">Tap to upload</span>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Upload className="h-5 w-5 text-white" />
            <span className="ml-2 text-sm font-medium text-white">Change photo</span>
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

// ── KYC Form (2-step) ──────────────────────────────────────────────────────────

function KycForm() {
  const router = useRouter()
  const submitKyc = useSubmitKyc()
  const { mutateAsync, isPending } = submitKyc

  const [step, setStep] = React.useState(0)
  const [sellerType, setSellerType] = React.useState<SellerType | null>(null)
  const [documentType, setDocumentType] = React.useState<DocumentType | null>(null)
  const [docFile, setDocFile] = React.useState<File | null>(null)
  const [selfieFile, setSelfieFile] = React.useState<File | null>(null)

  const handleSubmit = async () => {
    if (!sellerType || !documentType || !docFile || !selfieFile) {
      toast.error("Please complete all required fields")
      return
    }
    const fd = new FormData()
    fd.append("seller_type", sellerType)
    fd.append("kyc_document_type", documentType)
    fd.append("kyc_document", docFile)
    fd.append("kyc_selfie", selfieFile)

    try {
      await mutateAsync(fd)
      toast.success("Application submitted! We'll review it within 24–48 hours.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again."
      toast.error(msg)
    }
  }

  const sellerChoices = [
    {
      value: "products" as SellerType,
      icon: Store,
      title: "Sell products",
      desc: "List clothing, electronics, books, and more for students on your campus.",
    },
    {
      value: "food" as SellerType,
      icon: UtensilsCrossed,
      title: "Sell food",
      desc: "Open a campus restaurant or food vendor and take delivery or pickup orders.",
    },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 pb-16 pt-8">
      {/* Back */}
      <button
        type="button"
        onClick={step === 0 ? () => router.back() : () => setStep(0)}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {step === 0 ? "Back" : "Previous step"}
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-vm-tangerine" />
          <span className="text-xs font-semibold uppercase tracking-wider text-vm-tangerine">
            Identity Verification
          </span>
        </div>
        <h1 className="text-2xl font-bold font-heading">
          {step === 0 ? "What would you like to sell?" : "Verify your identity"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {step === 0
            ? "Choose your seller type to get started. You can add more later."
            : "Upload a clear photo of your ID and a selfie holding it."}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i <= step ? "bg-vm-tangerine" : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Step 0: Seller type */}
      {step === 0 && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
          {sellerChoices.map(({ value, icon: Icon, title, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSellerType(value)}
              className={cn(
                "group flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200",
                sellerType === value
                  ? "border-vm-tangerine bg-vm-tangerine/5"
                  : "border-border hover:border-vm-tangerine/40 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-colors",
                  sellerType === value
                    ? "border-vm-tangerine bg-vm-tangerine/15"
                    : "border-accent group-hover:bg-vm-tangerine/5"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    sellerType === value ? "text-vm-tangerine" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              {sellerType === value && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-vm-tangerine" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Documents */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Document type chips */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              ID document type <span className="text-destructive">*</span>
            </p>
            <div className="flex gap-3">
              {[
                { value: "ghana_card" as DocumentType, label: "Ghana Card" },
                { value: "student_id" as DocumentType, label: "Student ID" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDocumentType(value)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all",
                    documentType === value
                      ? "border-vm-tangerine bg-vm-tangerine/10 text-vm-tangerine"
                      : "border-border text-muted-foreground hover:border-vm-tangerine/40"
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <DocUploadField
            label="ID Document"
            hint="Front face or scan — must be fully legible and not cut off"
            value={docFile}
            onChange={setDocFile}
          />

          <DocUploadField
            label="Verification selfie"
            hint="Hold your ID next to your face so both are clearly visible"
            value={selfieFile}
            onChange={setSelfieFile}
          />

          {/* Tips */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-sm">
            <p className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-vm-tangerine" />
              Tips for a smooth review
            </p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>Good lighting — avoid glare and shadows</li>
              <li>All text on your ID must be clearly readable</li>
              <li>In your selfie, hold the ID close to your face</li>
              <li>Original document only — no photocopies</li>
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setStep(0)}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        )}

        {step === 0 ? (
          <Button
            type="button"
            disabled={!sellerType}
            className="flex-1 bg-vm-tangerine text-white hover:bg-vm-tangerine/90 font-semibold"
            onClick={() => setStep(1)}
          >
            Continue
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!documentType || !docFile || !selfieFile || isPending}
            className="flex-1 bg-vm-tangerine text-white hover:bg-vm-tangerine/90 font-semibold"
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Submitting…" : "Submit for review"}
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KycPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { data: kycData, isLoading: kycLoading, isFetching: kycFetching, refetch: refetchKyc } = useKycStatus({
    enabled: isAuthenticated && !authLoading,
  })
  const [showForm, setShowForm] = React.useState(false)

  // Redirect unauthenticated users
  React.useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.replace("/login?next=/seller/kyc")
    }
  }, [authLoading, isAuthenticated, router])

  // Redirect approved users straight to seller start
  React.useEffect(() => {
    const status = kycData?.kyc_status ?? user?.kycStatus
    if (status === "approved") {
      router.replace("/seller/start")
    }
  }, [kycData, user, router])

  if (authLoading || kycLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const kycStatus = kycData?.kyc_status ?? user?.kycStatus ?? "not_submitted"

  if (kycStatus === "pending") {
    return (
      <PendingScreen
        submittedAt={kycData?.submitted_at ?? null}
        isFetching={kycFetching}
        onRefetch={refetchKyc}
      />
    )
  }

  if (kycStatus === "rejected" && !showForm) {
    return (
      <RejectedScreen
        reason={kycData?.rejection_reason}
        onResubmit={() => setShowForm(true)}
      />
    )
  }

  return <KycForm />
}
