"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
	className?: string;
}

export function AuthLayout({ children, title, description, className }: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex">
			{/* ── Left Panel (brand) ── hidden on mobile */}
			<div
				className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden"
				style={{ background: "var(--ink)" }}
			>
				{/* Dot-grid texture */}
				<div
					aria-hidden
					className="absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage:
							"radial-gradient(circle, #ffffff 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>

				{/* Subtle top-right glow */}
				<div
					aria-hidden
					className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
					style={{ background: "var(--orange)", filter: "blur(80px)" }}
				/>

				{/* Logo */}
				<div className="relative z-10 p-8 xl:p-10">
					<Link
						href="/"
						className="inline-flex items-center gap-2.5 group"
					>
						<div
							className="flex items-center justify-center w-9 h-9 rounded-lg"
							style={{ background: "var(--orange)" }}
						>
							<svg
								viewBox="0 0 20 20"
								fill="none"
								className="w-5 h-5"
								aria-hidden
							>
								<path
									d="M3 6l7-3 7 3v8l-7 3-7-3V6z"
									stroke="#fff"
									strokeWidth="1.5"
									strokeLinejoin="round"
								/>
								<path
									d="M10 3v14M3 6l7 3 7-3"
									stroke="#fff"
									strokeWidth="1.5"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<span
							className="font-bold text-lg text-white tracking-tight"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							VarsityMart
						</span>
					</Link>
				</div>

				{/* Illustration area */}
				<div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 xl:px-14 pb-16">
					{/* Abstract campus illustration */}
					<div className="w-full max-w-sm mb-10">
						<svg
							viewBox="0 0 360 260"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full"
							aria-hidden
						>
							{/* Background card shapes */}
							<rect x="20" y="60" width="140" height="100" rx="12" fill="#ffffff" fillOpacity="0.06" />
							<rect x="200" y="40" width="140" height="120" rx="12" fill="#ffffff" fillOpacity="0.06" />
							<rect x="80" y="170" width="200" height="70" rx="12" fill="#ffffff" fillOpacity="0.06" />

							{/* Product card left */}
							<rect x="30" y="70" width="120" height="80" rx="8" fill="#ffffff" fillOpacity="0.10" />
							<rect x="42" y="82" width="45" height="40" rx="6" fill="#ffffff" fillOpacity="0.15" />
							<rect x="95" y="86" width="42" height="6" rx="3" fill="#ffffff" fillOpacity="0.4" />
							<rect x="95" y="96" width="28" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.25" />
							<rect x="95" y="108" width="38" height="10" rx="5" fill="var(--orange)" fillOpacity="0.9" />
							<rect x="42" y="130" width="95" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />

							{/* Product card right */}
							<rect x="210" y="50" width="120" height="80" rx="8" fill="#ffffff" fillOpacity="0.10" />
							<rect x="222" y="62" width="45" height="40" rx="6" fill="#ffffff" fillOpacity="0.15" />
							<rect x="275" y="66" width="42" height="6" rx="3" fill="#ffffff" fillOpacity="0.4" />
							<rect x="275" y="76" width="28" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.25" />
							<rect x="275" y="88" width="38" height="10" rx="5" fill="var(--orange)" fillOpacity="0.9" />
							<rect x="222" y="118" width="95" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />

							{/* Hot badge */}
							<rect x="212" y="46" width="36" height="16" rx="8" fill="var(--orange)" />
							<text x="230" y="58" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">HOT</text>

							{/* Price tag */}
							<rect x="32" y="66" width="42" height="16" rx="8" fill="var(--orange)" fillOpacity="0.9" />
							<text x="53" y="78" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">GH₵ 400</text>

							{/* Bottom stat bar */}
							<rect x="90" y="178" width="180" height="52" rx="10" fill="#ffffff" fillOpacity="0.08" />
							<circle cx="116" cy="204" r="12" fill="var(--orange)" fillOpacity="0.25" />
							<text x="116" y="208" textAnchor="middle" fontSize="11" fill="var(--orange)" fontWeight="700">3</text>
							<rect x="136" y="196" width="60" height="6" rx="3" fill="#ffffff" fillOpacity="0.35" />
							<rect x="136" y="207" width="40" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.2" />
							<circle cx="232" cy="204" r="12" fill="#ffffff" fillOpacity="0.12" />
							<path d="M228 204l3 3 5-5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

							{/* Floating ₵ symbol */}
							<circle cx="300" cy="170" r="20" fill="var(--orange)" fillOpacity="0.15" />
							<text x="300" y="177" textAnchor="middle" fontSize="18" fill="var(--orange)" fontWeight="700" fontFamily="monospace">₵</text>

							{/* Floating star */}
							<circle cx="60" cy="170" r="16" fill="#ffffff" fillOpacity="0.08" />
							<path d="M60 158l2.5 5 5.5.8-4 3.9 1 5.5L60 171l-5 2.6 1-5.5-4-3.9 5.5-.8L60 158z" fill="#ffffff" fillOpacity="0.5" />
						</svg>
					</div>

					<div className="text-center max-w-xs">
						<h1
							className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-3"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							Plan your path to{" "}
							<span style={{ color: "var(--orange)" }}>campus success</span>
						</h1>
						<p
							className="text-sm leading-relaxed"
							style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)" }}
						>
							Buy, sell and discover deals across campus. Thousands of students
							already buying and selling on VarsityMart.
						</p>
					</div>

					{/* Social proof chips */}
					<div className="flex items-center gap-4 mt-8">
						<div
							className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
							style={{
								background: "rgba(255,255,255,0.08)",
								color: "rgba(255,255,255,0.6)",
								fontFamily: "var(--font-body)",
							}}
						>
							<span
								className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
								style={{ background: "var(--orange)" }}
							>
								✓
							</span>
							Students verified
						</div>
						<div
							className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
							style={{
								background: "rgba(255,255,255,0.08)",
								color: "rgba(255,255,255,0.6)",
								fontFamily: "var(--font-body)",
							}}
						>
							<span
								className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
								style={{ background: "var(--orange)" }}
							>
								⚡
							</span>
							Instant delivery
						</div>
					</div>
				</div>

				{/* Bottom copyright */}
				<div className="relative z-10 p-8 xl:p-10">
					<p
						className="text-xs"
						style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}
					>
						© {new Date().getFullYear()} VarsityMart. Campus Marketplace.
					</p>
				</div>
			</div>

			{/* ── Right Panel (form) ── */}
			<div
				className="flex-1 flex flex-col min-h-screen"
				style={{ background: "var(--surface)" }}
			>
				{/* Mobile header */}
				<header className="flex items-center justify-between p-5 lg:hidden">
					<Link href="/" className="inline-flex items-center gap-2 group">
						<div
							className="flex items-center justify-center w-8 h-8 rounded-lg"
							style={{ background: "var(--orange)" }}
						>
							<svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
								<path
									d="M3 6l7-3 7 3v8l-7 3-7-3V6z"
									stroke="#fff"
									strokeWidth="1.5"
									strokeLinejoin="round"
								/>
								<path
									d="M10 3v14M3 6l7 3 7-3"
									stroke="#fff"
									strokeWidth="1.5"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<span
							className="font-bold text-base"
							style={{ color: "var(--ink)", fontFamily: "var(--font-heading)" }}
						>
							VarsityMart
						</span>
					</Link>
				</header>

				{/* Form area */}
				<main className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8">
					<div className={cn("w-full max-w-[420px]", className)}>
						{/* Title */}
						<div className="mb-7">
							<h2
								className="text-2xl sm:text-3xl font-bold mb-1.5"
								style={{ color: "var(--ink)", fontFamily: "var(--font-heading)" }}
							>
								{title}
							</h2>
							<p
								className="text-sm"
								style={{ color: "var(--ink-3)", fontFamily: "var(--font-body)" }}
							>
								{description}
							</p>
						</div>

						{/* Form content */}
						{children}
					</div>
				</main>

				{/* Mobile footer */}
				<footer className="p-5 lg:hidden text-center">
					<p
						className="text-xs"
						style={{ color: "var(--ink-3)", fontFamily: "var(--font-body)" }}
					>
						© {new Date().getFullYear()} VarsityMart
					</p>
				</footer>
			</div>
		</div>
	);
}
