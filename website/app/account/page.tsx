import { MainLayout } from "@/components/layout/main-layout"
import { AccountDashboard } from "@/components/account/account-dashboard"
import { Metadata } from "next"

export const metadata:Metadata = {
	title: "My Account - VarsityMart",
	description: "Manage your VarsityMart account",
}

export default function AccountPage() {
	return (
		<MainLayout>
			<AccountDashboard />
		</MainLayout>
	)
}
