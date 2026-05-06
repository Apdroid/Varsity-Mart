import * as React from "react"
import { Facebook, Twitter, Instagram, Youtube,  MapPin } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Logo from "./logo"

/* -----------------------------------------------------------
   Link group config
----------------------------------------------------------- */
type LinkGroup = {
  heading: string
  links: { label: string; href: string }[]
}

const linkGroups: LinkGroup[] = [
  {
    heading: "Marketplace",
    links: [
      { label: "Browse Products", href: "https://varsity-mart.vercel.app/products" },
      { label: "Stores", href: "https://varsity-mart.vercel.app/stores" },
      { label: "Food & Restaurants", href: "https://varsity-mart.vercel.app/restaurants" },
      { label: "Categories", href: "https://varsity-mart.vercel.app/categories" },
    ],
  },
  {
    heading: "Selling",
    links: [
      { label: "Start Selling", href: "https://varsity-mart.vercel.app/sell" },
      { label: "Seller Dashboard", href: "https://varsity-mart.vercel.app/seller/dashboard" },
      { label: "Seller Guide", href: "https://varsity-mart.vercel.app/help/selling" },
      { label: "Fees & Pricing", href: "https://varsity-mart.vercel.app/help/fees" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "https://varsity-mart.vercel.app/help" },
      { label: "Contact Us", href: "https://varsity-mart.vercel.app/contact" },
      { label: "Safety Tips", href: "https://varsity-mart.vercel.app/help/safety" },
      { label: "Report Issue", href: "https://varsity-mart.vercel.app/report" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "https://varsity-mart.vercel.app/about" },
      { label: "Careers", href: "https://varsity-mart.vercel.app/careers" },
      { label: "Privacy Policy", href: "https://varsity-mart.vercel.app/privacy" },
      { label: "Terms of Service", href: "https://varsity-mart.vercel.app/terms" },
    ],
  },
]

const socials = [
  { label: "Facebook", href: "https://facebook.com/", Icon: Facebook },
  { label: "Twitter", href: "https://twitter.com/", Icon: Twitter },
  { label: "Instagram", href: "https://instagram.com/", Icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/", Icon: Youtube },
]

const legalLinks = [
  { label: "Privacy", href: "https://varsity-mart.vercel.app/privacy" },
  { label: "Terms", href: "https://varsity-mart.vercel.app/terms" },
  { label: "Cookies", href: "https://varsity-mart.vercel.app/cookies" },
]


export default function VarsityMartFooter() {
  return (
    <footer className="text-white bg-vm-graphite opacity-95">
      {/* Main grid */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand column — spans 2 on lg */}
          <div className="col-span-2 lg:col-span-2">
            <Logo variant="footer" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/80">
              The student marketplace for buying, selling, and discovering campus deals.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              KNUST Campus · Kumasi, Ghana
            </div>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center hover:bg-vm-tangerine rounded-full border border-white/15 text-white/80 transition hover:border-transparent hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <FooterLinkGroup key={group.heading} group={group} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row">
          <p className="text-white/80">
            © 2026 VarsityMart. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            {legalLinks.map((link, i) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  className="px-2 text-white/80 transition hover:text-white"
                >
                  {link.label}
                </a>
                {i < legalLinks.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="h-3 bg-white/15"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* -----------------------------------------------------------
   Link group — heading with tangerine underline accent
----------------------------------------------------------- */
function FooterLinkGroup({ group }: { group: LinkGroup }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <h4 className="text-sm font-semibold text-white">{group.heading}</h4>
        <span
          className="h-0.5 w-6 rounded-full bg-vm-tangerine"
        />
      </div>
      <ul className="space-y-3">
        {group.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={cn(
                "group inline-flex items-center text-sm text-white/80",
                "transition-all hover:text-white"
              )}
            >
              <span
                className="absolute -ml-3 h-0.5 w-2 bg-vm-tangerine rounded-full opacity-0 transition-all group-hover:opacity-100"
              />
              <span className="transition-all group-hover:translate-x-1">
                {link.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
