// Price formatting
export function formatPrice(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Date formatting
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  return new Intl.DateTimeFormat("en-NG", options || defaultOptions).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(date)
}

// Number formatting
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Phone formatting
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.startsWith("234")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  }
  return phone
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Order status display
export function getOrderStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "yellow" },
    confirmed: { label: "Confirmed", color: "blue" },
    processing: { label: "Processing", color: "blue" },
    shipped: { label: "Shipped", color: "purple" },
    out_for_delivery: { label: "Out for Delivery", color: "purple" },
    delivered: { label: "Delivered", color: "green" },
    cancelled: { label: "Cancelled", color: "red" },
    refunded: { label: "Refunded", color: "gray" },
  }
  return statusMap[status] || { label: status, color: "gray" }
}
