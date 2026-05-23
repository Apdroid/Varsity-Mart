import {
	ArrowLeft,
	DollarSign,
	Eye,
	MessageSquare,
	Package,
	Plus,
	Settings,
	TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Seller Dashboard | VarsityMart",
	description: "Manage your listings, sales, and seller performance.",
};

export default function SellerDashboardPage() {
	const stats = [
		{
			label: "Active Listings",
			value: "0",
			icon: Package,
			color: "text-blue-600",
		},
		{
			label: "Total Sales",
			value: "$0",
			icon: DollarSign,
			color: "text-green-600",
		},
		{ label: "Total Views", value: "0", icon: Eye, color: "text-purple-600" },
		{
			label: "Messages",
			value: "0",
			icon: MessageSquare,
			color: "text-orange-600",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<Link
								href="/account"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								<ArrowLeft className="h-4 w-4 inline mr-1" />
								Back to Account
							</Link>
						</div>
						<h1 className="text-4xl font-bold text-foreground">
							Seller Dashboard
						</h1>
						<p className="text-muted-foreground mt-2">
							Manage your listings and track your sales performance
						</p>
					</div>
					<Link href="/sell">
						<Button
							size="lg"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							<Plus className="h-5 w-5 mr-2" />
							Create New Listing
						</Button>
					</Link>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="bg-card rounded-xl p-6 hover:shadow-lg transition-shadow"
						>
							<div className="flex items-center justify-between mb-4">
								<div
									className={`h-12 w-12 rounded-full bg-${stat.color}/10 flex items-center justify-center`}
								>
									<stat.icon className={`h-6 w-6 ${stat.color}`} />
								</div>
								<TrendingUp className="h-5 w-5 text-green-500" />
							</div>
							<p className="text-3xl font-bold text-foreground mb-1">
								{stat.value}
							</p>
							<p className="text-sm text-muted-foreground">{stat.label}</p>
						</div>
					))}
				</div>

				{/* Main Content */}
				<div className="grid lg:grid-cols-3 gap-6">
					{/* Active Listings */}
					<div className="lg:col-span-2 bg-card rounded-xl  p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-foreground">
								Active Listings
							</h2>
							<Link href="/sell">
								<Button variant="outline" size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Listing
								</Button>
							</Link>
						</div>

						{/* Empty State */}
						<div className="text-center py-12">
							<div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
								<Package className="h-10 w-10 text-primary" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">
								No Active Listings
							</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">
								You haven't created any listings yet. Start selling by creating
								your first listing!
							</p>
							<Link href="/sell">
								<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
									Create Your First Listing
								</Button>
							</Link>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="space-y-6">
						{/* Performance */}
						<div className="bg-card rounded-xl p-6">
							<h3 className="text-lg font-semibold text-foreground mb-4">
								Performance
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Response Rate
									</span>
									<span className="font-semibold text-foreground">--</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Avg. Response Time
									</span>
									<span className="font-semibold text-foreground">--</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Seller Rating
									</span>
									<span className="font-semibold text-foreground">--</span>
								</div>
							</div>
						</div>

						{/* Quick Links */}
						<div className="bg-card rounded-xl  p-6">
							<h3 className="text-lg font-semibold text-foreground mb-4">
								Quick Links
							</h3>
							<div className="space-y-3">
								<Link
									href="/help/selling"
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									<Package className="h-4 w-4" />
									Seller Guide
								</Link>
								<Link
									href="/help/fees"
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									<DollarSign className="h-4 w-4" />
									Fees & Pricing
								</Link>
								<Link
									href="/help/safety"
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									<Settings className="h-4 w-4" />
									Safety Guidelines
								</Link>
								<Link
									href="/messages"
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									<MessageSquare className="h-4 w-4" />
									Messages
								</Link>
							</div>
						</div>

						{/* Tips */}
						<div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
							<h3 className="text-lg font-semibold text-foreground mb-2">
								Selling Tips
							</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>• Take clear, well-lit photos</li>
								<li>• Price items competitively</li>
								<li>• Respond to messages quickly</li>
								<li>• Be honest about item condition</li>
							</ul>
							<Link
								href="/help/selling"
								className="text-sm text-primary hover:underline mt-3 inline-block"
							>
								Read full guide →
							</Link>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="mt-6 bg-card rounded-xl p-6">
					<h2 className="text-2xl font-bold text-foreground mb-4">
						Recent Activity
					</h2>
					<div className="text-center py-8">
						<p className="text-muted-foreground">
							No recent activity to display
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
