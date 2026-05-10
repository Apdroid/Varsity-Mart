import { Package, MessageCircle, CreditCard, CheckCircle, AlertCircle, type LucideIcon } from "lucide-react";

export interface NotificationData {
  id: string;
  type: "order_update" | "new_message" | "payment" | "system";
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  icon: LucideIcon;
  iconColor: string;
}

export const mockNotifications: NotificationData[] = [
  {
    id: "1",
    type: "order_update",
    title: "Order Shipped",
    body: "Your order VM-2024-002 has been shipped and is on its way!",
    time: "2 minutes ago",
    isRead: false,
    icon: Package,
    iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  },
  {
    id: "2",
    type: "new_message",
    title: "New Message",
    body: "John M. sent you a message about MacBook Pro",
    time: "15 minutes ago",
    isRead: false,
    icon: MessageCircle,
    iconColor: "text-primary bg-primary/10 dark:bg-primary/20",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Received",
    body: "You received GH₵650 for your order VM-2024-001",
    time: "1 hour ago",
    isRead: true,
    icon: CreditCard,
    iconColor: "text-green-600 bg-green-100 dark:bg-green-950",
  },
  {
    id: "4",
    type: "order_update",
    title: "Order Delivered",
    body: "Your order VM-2024-001 has been delivered successfully",
    time: "2 hours ago",
    isRead: true,
    icon: CheckCircle,
    iconColor: "text-green-600 bg-green-100 dark:bg-green-950",
  },
  {
    id: "5",
    type: "system",
    title: "Complete Your Profile",
    body: "Add a profile photo and verify your phone number to increase trust",
    time: "1 day ago",
    isRead: true,
    icon: AlertCircle,
    iconColor: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
  },
];

