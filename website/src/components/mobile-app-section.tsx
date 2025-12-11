import { Bell, MapPin, Smartphone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
	{ icon: Smartphone, text: "Order faster" },
	{ icon: Bell, text: "Instant notifications" },
	{ icon: MapPin, text: "Track deliveries" },
	{ icon: Tag, text: "Exclusive deals" },
];

export function MobileAppSection() {
	return (
		<section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
					<div className="relative flex justify-center order-2 md:order-1">
						<div className="relative w-[260px] md:w-[300px]">
							<div className="relative bg-black rounded-[40px] p-3 shadow-2xl">
								<div className="bg-white rounded-[32px] overflow-hidden aspect-[9/19]">
									<img
										src="/mobile-app-marketplace-interface-dark-theme.jpg"
										alt="Varsity Mart App"
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
							</div>
							<div className="absolute -top-4 -right-4 w-20 h-20 bg-sky-400/20 rounded-full blur-xl" />
							<div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
						</div>
					</div>

					<div className="order-1 md:order-2 text-center md:text-left">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Get the Varsity Mart App
						</h2>
						<p className="text-white/80 text-lg mb-8">
							Everything you love about Varsity Mart, now in your pocket.
						</p>

						<div className="grid grid-cols-2 gap-4 mb-8">
							{features.map((feature) => (
								<div
									key={feature.text}
									className="flex items-center gap-3 text-white"
								>
									<div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
										<feature.icon className="w-5 h-5" />
									</div>
									<span>{feature.text}</span>
								</div>
							))}
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
							<Button
								size="lg"
								className="bg-white text-blue-900 hover:bg-white/90 font-semibold h-14 px-6"
							>
								<svg
									className="w-6 h-6 mr-2"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
								</svg>
								App Store
							</Button>
							<Button
								size="lg"
								className="bg-white text-blue-900 hover:bg-white/90 font-semibold h-14 px-6"
							>
								<svg
									className="w-6 h-6 mr-2"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.56.68.56 1.19s-.22.92-.57 1.19l-2.11 1.21-2.5-2.5 2.5-2.5 2.12 1.21zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
								</svg>
								Google Play
							</Button>
						</div>

						<div className="flex items-center gap-4 justify-center md:justify-start">
							<div className="w-20 h-20 bg-white rounded-lg p-2">
								<img
									src="/qr-code.png"
									alt="QR Code"
									className="w-full h-full"
								/>
							</div>
							<p className="text-white/80 text-sm">Scan to download</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
