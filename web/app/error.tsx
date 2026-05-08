"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const [retrying, setRetrying] = React.useState(false)

  const handleReset = () => {
    setRetrying(true)
    setTimeout(() => {
      setRetrying(false)
      reset()
    }, 600)
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vm-tangerine/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-md text-center">
        {/* Animated icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 animate-ping rounded-full bg-vm-tangerine/20" />
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-vm-tangerine/10 ring-1 ring-vm-tangerine/30">
              <AlertTriangle className="h-9 w-9 text-vm-tangerine" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl font-black leading-tight text-foreground sm:text-4xl">
          Something broke
          <br />
          at the stall.
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          One of our merchants is having a rough day. This isn&apos;t on you
          — give it a moment, then try again.
        </p>

        {/* Error digest */}
        {error.digest && (
          <p className="mt-4 font-mono text-[11px] text-muted-foreground/50">
            ref: {error.digest}
          </p>
        )}

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleReset}
            disabled={retrying}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-vm-tangerine px-6 text-sm font-semibold text-vm-tangerine-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <RefreshCcw
              className={`h-4 w-4 transition-transform ${retrying ? "animate-spin" : ""}`}
            />
            {retrying ? "Retrying…" : "Try again"}
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>

        {/* Glitch stripes decoration */}
        <GlitchStripes />
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest text-muted-foreground/40">
        VarsityMart · Campus Marketplace
      </p>
    </div>
  )
}

function GlitchStripes() {
  return (
    <div aria-hidden className="mt-16 flex items-center justify-center gap-1 opacity-20">
      {[40, 16, 28, 8, 48, 20, 12, 36].map((w, i) => (
        <div
          key={i}
          className="h-1 rounded-full bg-vm-tangerine"
          style={{ width: `${w}px` }}
        />
      ))}
    </div>
  )
}
