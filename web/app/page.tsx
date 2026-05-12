import HeroSlider from "@/components/main/hero"
import Newsletter from "@/components/main/newsletter"
import { HomepageContent } from "@/components/main/homepage-content"

export default function Page() {
	return (
		<div className="max-w-8xl mx-auto min-h-svh">
			<HeroSlider />
			<HomepageContent />
			<Newsletter />
		</div>
	)
}
