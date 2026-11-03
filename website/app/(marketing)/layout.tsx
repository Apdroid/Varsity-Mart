import Header from "@/components/global/header"
import Footer from "@/components/global/footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<main className="min-h-screen">
				{children}
			</main>
			<Footer />
		</>
	)
}
