import {
	Bell,
	CreditCard,
	Heart,
	MapPin,
	Package,
	Settings,
	Shield,
} from "lucide-react";
export type KYCStatus = "pending" | "approved" | "rejected";

export interface User {
	firstName: string;
	lastName: string;
	email: string;
	avatar: string;
	kycStatus: KYCStatus;
	ordersCount: number;
	wishlistCount: number;
}

export const mockUser: User = {
	firstName: "John",
	lastName: "Mensah",
	email: "john@campus.edu",
	avatar: "/male-student-portrait.png",
	kycStatus: "approved",
	ordersCount: 12,
	wishlistCount: 8,
};

export const menuItems = [
	{
		icon: Package,
		label: "My Orders",
		href: "/account/orders",
		description: "Track and manage your orders",
		count: 3,
	},
	{
		icon: Heart,
		label: "Wishlist",
		href: "/account/wishlist",
		description: "Items you've saved",
		count: 8,
	},
	{
		icon: MapPin,
		label: "Addresses",
		href: "/account/addresses",
		description: "Manage delivery addresses",
	},
	{
		icon: CreditCard,
		label: "Payments",
		href: "/account/payments",
		description: "Payment methods & wallet",
	},
	{
		icon: Bell,
		label: "Notifications",
		href: "/account/notifications",
		description: "Notification preferences",
	},
	{
		icon: Shield,
		label: "Security",
		href: "/account/security",
		description: "Password & 2FA settings",
	},
	{
		icon: Settings,
		label: "Settings",
		href: "/account/settings",
		description: "Account preferences",
	},
];

export const recentOrders = [
	{
		id: "ORD-001",
		product: "MacBook Pro M2",
		status: "delivered",
		date: "Jan 10, 2024",
		total: 4500,
	},
	{
		id: "ORD-002",
		product: "Wireless Earbuds",
		status: "shipped",
		date: "Jan 8, 2024",
		total: 650,
	},
	{
		id: "ORD-003",
		product: "Calculus Textbook",
		status: "processing",
		date: "Jan 5, 2024",
		total: 85,
	},
];

import { orderStatusColors } from "@/data/shared/status-colors";

export const statusColors = orderStatusColors;
