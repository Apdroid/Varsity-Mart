"use client"

import Link from "next/link"
import {
  ShoppingBag,
  Search,
  ArrowLeft,
  Tag,
  Cpu,
  Shirt,
  BookOpen,
  Coffee,
} from "lucide-react"

const POPULAR_SEARCHES = [
  { label: "MacBook", icon: Cpu },
  { label: "Sneakers", icon: Shirt },
  { label: "Jollof rice", icon: Coffee },
  { label: "Textbooks", icon: BookOpen },
]

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Floating background price tags */}
      <FloatingDecorations />

      {/* Main card */}
      <div className="relative z-10 mx-auto w-full max-w-lg text-center">
        {/* Price tag badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full -vm-tangerine/30 bg-vm-tangerine/10 px-4 py-1.5 text-sm font-semibold text-vm-tangerine">
          <Tag className="h-3.5 w-3.5" />
          Listing not found
        </div>

        {/* 404 display */}
        <div className="relative mb-2 select-none">
          {/* Ghost number behind */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-heading text-[11rem] font-black leading-none tracking-tighter text-vm-tangerine/[0.07] sm:text-[14rem]"
          >
            404
          </p>

          {/* Foreground number */}
          <h1 className="relative font-heading text-8xl font-black leading-none tracking-tighter text-foreground sm:text-9xl">
            4
            <span className="text-vm-tangerine">0</span>
            4
          </h1>

          {/* Sold-out stamp */}
          <div
            aria-hidden="true"
            className="absolute -right-4 top-2 rotate-18 rounded-sm border-4 border-red-500/70 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.3em] text-red-500/70 sm:-right-2 sm:top-4 sm:text-xs"
          >
            Sold out
          </div>
        </div>

        {/* Copy */}
        <div className="mt-8 space-y-2">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            This page left campus.
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            Maybe the seller deactivated the listing, maybe it moved,
            or maybe it never existed. Either way — nothing here.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex vm-button h-11 items-center gap-2 rounded-md bg-vm-tangerine px-6 text-sm font-semibold text-vm-tangerine-foreground transition-opacity hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            Back to marketplace
          </Link>
          <Link
            href="/search"
            className="inline-flex h-11 rounded-full border-2 border-vm-tangerine items-center gap-2 py-6  px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Search className="h-4 w-4 text-vm-tangerine" />
            Search instead
          </Link>
        </div>

        {/* Popular searches */}
        <div className="mt-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trending right now
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map(({ label, icon: Icon }) => (
              <Link
                key={label}
                href={`/search?query=${encodeURIComponent(label)}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-sm font-medium text-foreground ring-1 ring-border transition-colors hover:bg-vm-tangerine hover:text-vm-tangerine-foreground hover:ring-vm-tangerine"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => history.back()}
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Go back to previous page
        </button>
      </div>

      {/* Brand watermark */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-widest text-muted-foreground/40 uppercase">
        VarsityMart · Campus Marketplace
      </p>
    </div>
  )
}

function FloatingDecorations() {
  const items = [
    { top: "8%", left: "5%", rotate: "-15deg", size: "h-8 w-8", delay: "0s" },
    { top: "15%", right: "8%", rotate: "20deg", size: "h-6 w-6", delay: "0.4s" },
    { top: "60%", left: "3%", rotate: "10deg", size: "h-5 w-5", delay: "0.8s" },
    { top: "70%", right: "5%", rotate: "-25deg", size: "h-7 w-7", delay: "0.2s" },
    { top: "40%", left: "9%", rotate: "30deg", size: "h-4 w-4", delay: "1s" },
    { top: "30%", right: "12%", rotate: "-8deg", size: "h-5 w-5", delay: "0.6s" },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-bounce text-vm-tangerine/15"
          style={{
            top: item.top,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
            transform: `rotate(${item.rotate})`,
            animationDuration: "3s",
            animationDelay: item.delay,
          }}
        >
          <Tag className={item.size} />
        </div>
      ))}
    </div>
  )
}
