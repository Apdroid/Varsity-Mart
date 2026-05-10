import Link from "next/link"
import { ArrowRight, FileText, HelpCircle, Shield, Store } from "lucide-react"

type RouteSkeletonProps = {
	title: string
	description: string
}

export function RouteSkeleton({ title, description }: RouteSkeletonProps) {
	const quickLinks = [
		{ label: "Browse Products", href: "/products", icon: Store },
		{ label: "Explore Restaurants", href: "/restaurants", icon: Store },
		{ label: "Visit Stores", href: "/stores", icon: Store },
		{ label: "Help Center", href: "/help", icon: HelpCircle },
	]

	const contentBlocks = [
		{
			title: "What this page covers",
			copy: `${title} has been set up with production-ready layout structure, responsive spacing, and route-level navigation wiring.`,
			icon: FileText,
		},
		{
			title: "What comes next",
			copy: "Data integration, user flows, and action handlers can now be connected directly without changing route architecture.",
			icon: ArrowRight,
		},
		{
			title: "Trust and clarity",
			copy: "All links point to internal routes with consistent UX patterns for desktop and mobile screen sizes.",
			icon: Shield,
		},
	]

	return (
		<main className="container mx-auto px-4 py-10 md:py-14">
			<section className="rounded-3xl bg-card p-6 md:p-10">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-vm-tangerine">
					Varsity Mart
				</p>
				<h1 className="mt-3 text-3xl font-extrabold text-vm-graphite md:text-4xl">{title}</h1>
				<p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
					{description}
				</p>
				<div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold">
					<Link
						href="/"
						className="inline-flex items-center gap-1.5 rounded-full bg-vm-graphite px-4 py-2 text-white transition-opacity hover:opacity-90"
					>
						Go to home
					</Link>
					<Link
						href="/search"
						className="inline-flex items-center gap-1.5 rounded-full bg-vm-tangerine px-4 py-2 text-white transition-opacity hover:opacity-90"
					>
						Browse marketplace
					</Link>
				</div>
			</section>

			<section className="mt-8 grid gap-4 md:grid-cols-3">
				{contentBlocks.map((block) => (
					<article key={block.title} className="rounded-2xl bg-card p-5">
						<block.icon className="h-5 w-5 text-vm-tangerine" />
						<h2 className="mt-3 text-base font-bold text-vm-graphite">{block.title}</h2>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.copy}</p>
					</article>
				))}
			</section>

			<section className="mt-8 rounded-2xl bg-card p-5 md:p-6">
				<h2 className="text-base font-bold text-vm-graphite">Quick links</h2>
				<div className="mt-4 grid gap-2 sm:grid-cols-2">
					{quickLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="inline-flex items-center justify-between rounded-xl bg-background px-4 py-3 text-sm font-semibold text-vm-graphite transition-colors hover:bg-muted"
						>
							<span className="inline-flex items-center gap-2">
								<link.icon className="h-4 w-4 text-vm-tangerine" />
								{link.label}
							</span>
							<ArrowRight className="h-4 w-4 text-vm-tangerine" />
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}
